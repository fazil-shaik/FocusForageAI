"use server";

import { db } from "@/db";
import { focusSessions, dailyStats, users, tasks } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { redis } from "@/lib/redis";
import { calculateXPChange, MentalState } from "@/lib/xp-engine";

export async function startFocusSession(data: {
    duration: number; // in minutes
    mentalState: MentalState;
    taskName: string;
    allowedDomains: string[];
    blockedDomains: string[];
    taskId?: string;
}) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const dbUser = await db.query.users.findFirst({
        where: eq(users.id, session.user.id),
    });

    const xpStart = dbUser?.xp || 0;

    // 1. Create Postgres Entry
    const [newSession] = await db.insert(focusSessions).values({
        userId: session.user.id,
        startTime: new Date(),
        duration: data.duration,
        status: "in_progress",
        mentalState: data.mentalState,
        taskName: data.taskName,
        xpStart: xpStart,
        allowedDomains: data.allowedDomains,
        blockedDomains: data.blockedDomains,
    }).returning();

    // 2. Initialize Redis State
    const sessionKey = `focus:session:${session.user.id}`;
    await redis.hset(sessionKey, {
        sessionId: newSession.id,
        startTime: Date.now(),
        mentalState: data.mentalState,
        xpStart: xpStart,
        distractionCount: 0,
        idleTime: 0,
        tabSwitchCount: 0,
        lastHeartbeat: Date.now(),
    });

    // 3. Optional Task Update
    if (data.taskId) {
        await db.update(tasks)
            .set({ status: "in_progress" })
            .where(and(eq(tasks.id, data.taskId), eq(tasks.userId, session.user.id)));
    }

    return { success: true, sessionId: newSession.id };
}

export async function updateFocusHeartbeat(data: {
    isIdle: boolean;
    isTabHidden: boolean;
    event?: { type: string; timestamp: number; details?: any };
}) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const sessionKey = `focus:session:${session.user.id}`;
    const activeSession = await redis.hgetall(sessionKey);

    if (!activeSession || !activeSession.sessionId) return { active: false };

    // Anti-Cheat: Validate heartbeat interval (roughly 5s)
    const now = Date.now();
    const lastHeartbeat = parseInt(activeSession.lastHeartbeat);
    const drift = now - lastHeartbeat;

    // Heartbeats should be ~5s apart. 
    // If they come too fast (< 3s), we ignore the update instead of crashing.
    // This handles network jitter or multiple open tabs more gracefully.
    if (drift < 3000) {
        console.warn("Heartbeat received too early. Ignoring for anti-cheat.");
        return { active: true, ignored: true };
    }

    // If drift is too large, session might have been suspended or tampered
    if (drift > 60000) { // 1 minute gap
        console.warn("Large heartbeat drift detected. Potential suspension.");
    }

    const updates: any = {
        lastHeartbeat: now,
    };

    if (data.isIdle) {
        updates.idleTime = parseInt(activeSession.idleTime) + 5;
    }

    if (data.isTabHidden) {
        // We handle tab switches via explicit events mostly, but logic can be here
    }

    if (data.event) {
        const eventsKey = `focus:events:${activeSession.sessionId}`;
        await redis.rpush(eventsKey, JSON.stringify(data.event));

        if (data.event.type === "tab_switch" || data.event.type === "distraction") {
            updates.distractionCount = parseInt(activeSession.distractionCount) + 1;
            updates.tabSwitchCount = parseInt(activeSession.tabSwitchCount) + (data.event.type === "tab_switch" ? 1 : 0);
        }
    }

    await redis.hset(sessionKey, updates);

    return { active: true };
}

export async function endFocusSession(data: {
    status: "completed" | "abandoned";
    taskId?: string;
}) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const sessionKey = `focus:session:${session.user.id}`;
    const activeSession = await redis.hgetall(sessionKey);

    if (!activeSession || !activeSession.sessionId) throw new Error("No active session");

    // 1. Fetch Events from Redis
    const eventsKey = `focus:events:${activeSession.sessionId}`;
    const events = await redis.lrange(eventsKey, 0, -1);
    const parsedEvents = events.map(e => JSON.parse(e));

    const distractionCount = parseInt(activeSession.distractionCount);
    const totalDuration = Math.round((Date.now() - parseInt(activeSession.startTime)) / 60000);

    // 2. Authoritative XP Calculation
    const xpChange = calculateXPChange({
        durationMinutes: totalDuration,
        mentalState: activeSession.mentalState as MentalState,
        distractionCount,
        isBoosted: false,
        isCompleted: data.status === "completed"
    });

    // 3. Update Postgres
    await db.update(focusSessions)
        .set({
            endTime: new Date(),
            status: data.status,
            distractionCount: distractionCount,
            distractionEvents: parsedEvents,
            idleTime: parseInt(activeSession.idleTime),
            tabSwitchCount: parseInt(activeSession.tabSwitchCount),
            xpCurrent: parseInt(activeSession.xpStart) + xpChange,
        })
        .where(eq(focusSessions.id, activeSession.sessionId));

    await db.update(users)
        .set({
            xp: sql`GREATEST(0, ${users.xp} + ${xpChange})`
        })
        .where(eq(users.id, session.user.id));

    // 4. Update Daily Stats
    const today = new Date().toISOString().split("T")[0];
    const existingStats = await db.query.dailyStats.findFirst({
        where: and(eq(dailyStats.userId, session.user.id), eq(dailyStats.date, today)),
    });

    if (existingStats) {
        await db.update(dailyStats).set({
            totalDeepWorkMinutes: (existingStats.totalDeepWorkMinutes || 0) + totalDuration,
            sessionsCompleted: (existingStats.sessionsCompleted || 0) + (data.status === "completed" ? 1 : 0),
            distractionCount: (existingStats.distractionCount || 0) + distractionCount
        }).where(eq(dailyStats.id, existingStats.id));
    }

    // 5. Cleanup Redis
    await redis.del(sessionKey);
    await redis.del(eventsKey);

    if (data.taskId) {
        await db.update(tasks).set({ status: data.status === "completed" ? "done" : "todo" }).where(eq(tasks.id, data.taskId));
    }

    revalidatePath("/dashboard");
    revalidatePath("/focus");

    return { xpEarned: xpChange };
}

export async function getPreSessionAdjustment(data: {
    emotion: string;
    taskId?: string;
}) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const { adjustFocusSession } = await import("@/lib/ai-orchestrator");

    // Fetch recent session history for context
    const recentHistory = await db.query.focusSessions.findMany({
        where: eq(focusSessions.userId, session.user.id),
        orderBy: [sql`${focusSessions.startTime} DESC`],
        limit: 3,
    });

    const performance_history = recentHistory.length > 0
        ? recentHistory.map(h => `${h.taskName}: ${h.status} (${h.duration}m)`).join(", ")
        : "No recent history";

    const task = data.taskId
        ? await db.query.tasks.findFirst({ where: eq(tasks.id, data.taskId) })
        : null;

    const adjustment = await adjustFocusSession({
        userId: session.user.id,
        performance_history,
        emotion: data.emotion,
        current_time: new Date().toLocaleTimeString(),
        difficulty: task?.priority || "medium"
    });

    return adjustment;
}
