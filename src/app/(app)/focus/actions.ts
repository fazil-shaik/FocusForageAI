"use server";

import { db } from "@/db";
import { focusSessions, dailyStats, users, tasks } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


export async function saveFocusSession(data: {
    duration: number; // in minutes
    moodStart?: string;
    taskName?: string;
    distractionCount?: number;
    isBoosted?: boolean;
    taskId?: string;
    taskStatus?: "todo" | "in_progress" | "done";
}) {
    const session = await getSession();

    if (!session) throw new Error("Unauthorized");

    const today = new Date().toISOString().split("T")[0];
    const taskName = data.taskName || "General Focus";
    const duration = data.duration;
    const distractions = data.distractionCount || 0;

    // 1. Save Session
    await db.insert(focusSessions).values({
        userId: session.user.id,
        startTime: new Date(Date.now() - duration * 60 * 1000), // Approximate start time
        endTime: new Date(),
        duration: duration,
        status: "completed",
        moodStart: data.moodStart,
        taskName: taskName,
        isBoosted: data.isBoosted || false,
    });

    // 2. Update Daily Stats
    const existingStats = await db.query.dailyStats.findFirst({
        where: and(
            eq(dailyStats.userId, session.user.id),
            eq(dailyStats.date, today)
        ),
    });

    if (existingStats) {
        await db.update(dailyStats)
            .set({
                totalDeepWorkMinutes: (existingStats.totalDeepWorkMinutes || 0) + duration,
                sessionsCompleted: (existingStats.sessionsCompleted || 0) + 1,
                distractionCount: (existingStats.distractionCount || 0) + distractions,
            })
            .where(eq(dailyStats.id, existingStats.id));
    } else {
        await db.insert(dailyStats).values({
            userId: session.user.id,
            date: today,
            totalDeepWorkMinutes: duration,
            sessionsCompleted: 1,
            distractionCount: distractions,
        });
    }

    // 3. Calculate XP (Refined per feedback)
    // Normal: 10/min + 50 bonus - distractions penalty
    // Boost: -10 XP penalty
    const baseXP = data.isBoosted ? 0 : duration * 10;
    const bonusXP = data.isBoosted ? -10 : 50;
    const penaltyXP = distractions * 5;
    const totalXPChange = baseXP + bonusXP - penaltyXP;

    // 4. Update User XP (Ensuring it doesn't go below 0)
    await db.update(users)
        .set({
            xp: sql`GREATEST(0, ${users.xp} + ${totalXPChange})`
        })
        .where(eq(users.id, session.user.id));

    // 5. Optional Task Update
    if (data.taskId && data.taskStatus) {
        await db.update(tasks)
            .set({ status: data.taskStatus })
            .where(and(eq(tasks.id, data.taskId), eq(tasks.userId, session.user.id)));
        revalidatePath("/tasks");
    }

    revalidatePath("/dashboard");
    revalidatePath("/analytics");

    return { success: true, xpEarned: totalXPChange };
}
