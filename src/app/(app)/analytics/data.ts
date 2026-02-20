"use server";

import { db } from "@/db";
import { dailyStats, focusSessions } from "@/db/schema";
import { eq, sql, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import { generatePatternAnalysis } from "./analyze";

export async function getAnalyticsData() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) return null;

    // ... existing queries ...
    // Get daily stats
    const stats = await db.query.dailyStats.findMany({
        where: eq(dailyStats.userId, session.user.id),
        orderBy: [desc(dailyStats.date)],
        limit: 30, // Last 30 days
    });

    // Fill missing days for the graph (ensuring 30 bars)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);

    const filledStats = [];
    for (let i = 0; i < 30; i++) {
        const date = new Date(thirtyDaysAgo);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split("T")[0];

        const existingStat = stats.find(s => s.date === dateStr);
        if (existingStat) {
            filledStats.push(existingStat);
        } else {
            filledStats.push({
                date: dateStr,
                totalDeepWorkMinutes: 0,
                sessionsCompleted: 0,
                distractionCount: 0,
                moodScore: 0,
                userId: session.user.id,
                id: `filler-${dateStr}`
            });
        }
    }

    // Get recent focus sessions
    const recentSessions = await db.query.focusSessions.findMany({
        where: eq(focusSessions.userId, session.user.id),
        orderBy: [desc(focusSessions.startTime)],
        limit: 5,
    });

    // Calculate totals
    const totalDeepWorkHours = await db
        .select({ value: sql<number>`sum(${dailyStats.totalDeepWorkMinutes})` })
        .from(dailyStats)
        .where(eq(dailyStats.userId, session.user.id));

    const totalSessions = await db
        .select({ value: sql<number>`count(*)` })
        .from(focusSessions)
        .where(eq(focusSessions.userId, session.user.id));

    const userPlan = (session.user as any).plan || "free";
    let behavioralAnalysis = null;

    if (userPlan === "pro") {
        behavioralAnalysis = await generatePatternAnalysis();
    }

    return {
        dailyStats: filledStats, // Correct order and filled
        recentSessions,
        totalDeepWorkHours: Math.round((totalDeepWorkHours[0]?.value || 0) / 60),
        totalSessions: totalSessions[0]?.value || 0,
        averageMood: 7.5, // Placeholder/Calculated if needed
        userPlan,
        behavioralAnalysis,
    };
}
