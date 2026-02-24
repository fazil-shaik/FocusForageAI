"use server";

import { db } from "@/db";
import { dailyStats, focusSessions, tasks } from "@/db/schema";
import { eq, and, sql, gte } from "drizzle-orm";
import { getSession } from "@/lib/session";

import { redis } from "@/lib/redis";

export async function getDailyReportData() {
    const session = await getSession();
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

export async function generateWeeklyAIReport() {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const { generateWeeklyReport } = await import("@/lib/ai-orchestrator");

    // Fetch last 7 days of stats
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split("T")[0];

    const stats = await db.query.dailyStats.findMany({
        where: and(
            eq(dailyStats.userId, session.user.id),
            sql`${dailyStats.date} >= ${sevenDaysAgoStr}`
        ),
    });

    const sessions = await db.query.focusSessions.findMany({
        where: and(
            eq(focusSessions.userId, session.user.id),
            eq(focusSessions.status, "completed"),
            sql`${focusSessions.startTime} >= ${sevenDaysAgo}`
        ),
    });

    // Aggregating data for AI
    const deep_hours = Math.round(stats.reduce((acc, s) => acc + (s.totalDeepWorkMinutes || 0), 0) / 60);
    const distraction_count = stats.reduce((acc, s) => acc + (s.distractionCount || 0), 0);

    // Find most productive time slot (simple bucket logic)
    const hourBuckets: Record<number, number> = {};
    sessions.forEach(s => {
        const hour = s.startTime.getHours();
        hourBuckets[hour] = (hourBuckets[hour] || 0) + (s.duration || 0);
    });
    const best_time = Object.entries(hourBuckets).sort((a, b) => b[1] - a[1])[0]?.[0] || "Unknown";

    const report = await generateWeeklyReport(session.user.id, {
        deep_hours,
        best_time: `${best_time}:00`,
        avoided_task: "Complex Engineering", // Placeholder for now
        distraction_time: "Late Afternoon", // Placeholder
        emotion_pattern: "Anxious when facing large tasks", // Placeholder
    });

    return report;
}
