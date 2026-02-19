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
        dailyStats: stats.reverse(), // For chart chronology
        recentSessions,
        totalDeepWorkHours: Math.round((totalDeepWorkHours[0]?.value || 0) / 60),
        totalSessions: totalSessions[0]?.value || 0,
        averageMood: 7.5, // Placeholder/Calculated if needed
        userPlan,
        behavioralAnalysis,
    };
}
