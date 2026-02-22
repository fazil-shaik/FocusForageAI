"use server";

import { db } from "@/db";
import { dailyStats, focusSessions, tasks } from "@/db/schema";
import { eq, and, sql, gte } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getDailyReportData() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) return null;

    const today = new Date().toISOString().split("T")[0];
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // 1. Get today's focus stats
    const stats = await db.query.dailyStats.findFirst({
        where: and(
            eq(dailyStats.userId, session.user.id),
            eq(dailyStats.date, today)
        ),
    });

    // 2. Get today's focus sessions
    const sessions = await db.query.focusSessions.findMany({
        where: and(
            eq(focusSessions.userId, session.user.id),
            eq(focusSessions.status, "completed"),
            gte(focusSessions.startTime, startOfToday)
        ),
        orderBy: [sql`${focusSessions.startTime} DESC`],
    });

    // 3. Get completed tasks today
    const completedTasks = await db.query.tasks.findMany({
        where: and(
            eq(tasks.userId, session.user.id),
            eq(tasks.status, "done")
            // Note: If we had a completedAt field, we'd use it. For now, we assume tasks marked done are relevant.
        ),
    });

    return {
        totalMinutes: stats?.totalDeepWorkMinutes || 0,
        sessionCount: stats?.sessionsCompleted || 0,
        distractions: stats?.distractionCount || 0,
        sessions: sessions.map(s => ({
            id: s.id,
            duration: s.duration,
            taskName: s.taskName,
            time: s.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        })),
        tasks: completedTasks.map(t => ({
            id: t.id,
            title: t.title
        })),
        xpEarnedToday: (stats?.totalDeepWorkMinutes || 0) * 10 + (stats?.sessionsCompleted || 0) * 50 - (stats?.distractionCount || 0) * 5
    };
}
