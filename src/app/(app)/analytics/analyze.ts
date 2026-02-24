"use server";

import { generateContent } from "@/lib/ai";
import { db } from "@/db";
import { dailyStats, tasks, focusSessions } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function generatePatternAnalysis(userId: string) {
    if (!userId) throw new Error("Unauthorized");


    // Fetch Weekly Metrics (Simulated aggregation for now)
    const stats = await db.query.dailyStats.findMany({
        where: eq(dailyStats.userId, userId),
        orderBy: [desc(dailyStats.date)],
        limit: 7,
    });

    const planned = await db.select({ count: sql<number>`count(*)` }).from(tasks).where(eq(tasks.userId, userId));
    const completed = await db.select({ count: sql<number>`count(*)` }).from(focusSessions).where(eq(focusSessions.userId, userId));

    // Simulated Metrics for the Prompt (Hard to calc real delay/sleep without more data)
    const totalMinutes = stats.reduce((acc, curr) => acc + (curr.totalDeepWorkMinutes || 0), 0);
    const totalDistractions = stats.reduce((acc, curr) => acc + (curr.distractionCount || 0), 0);
    const avgSessionsPerDay = stats.length > 0 ? (stats.reduce((acc, curr) => acc + (curr.sessionsCompleted || 0), 0) / stats.length).toFixed(1) : 0;

    const metrics = {
        planned: planned[0].count,
        completed: completed[0].count,
        totalHours: (totalMinutes / 60).toFixed(1),
        distractions: totalDistractions,
        avgSessions: avgSessionsPerDay,
        emotions: "Varying" // Placeholder until real mood logs are integrated
    };

    const prompt = `
    Procrastination Pattern Analyzer
    
    User Weekly Metrics:
    - Planned sessions: ${metrics.planned}
    - Total Deep Work Hours: ${metrics.totalHours}
    - Total Distractions: ${metrics.distractions}
    - Avg Sessions per Day: ${metrics.avgSessions}
    - Emotional logs: ${metrics.emotions}

    Analyze:
    1. 3 procrastination patterns (be aware that some tab switching is research).
    2. 2 triggers.
    3. 1 psychological factor.
    4. 3-step correction strategy.
    5. Risk level next week.

    Be specific. Return JSON:
    {
        "patterns": ["string"],
        "triggers": ["string"],
        "psychologicalFactor": "string",
        "strategy": ["string"],
        "riskLevel": "Low" | "Medium" | "High"
    }
    `;

    try {
        const response = await generateContent(prompt);
        // Find the first { and last } to extract JSON from markdown if exists
        const jsonStart = response.indexOf('{');
        const jsonEnd = response.lastIndexOf('}');

        if (jsonStart === -1 || jsonEnd === -1) {
            throw new Error('No JSON found in response');
        }

        const jsonString = response.substring(jsonStart, jsonEnd + 1);
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Pattern Analysis Error:", error);
        // Fallback for UI stability
        return {
            patterns: ["Occasional context switching during deep work", "Energy dips in late afternoon", "Higher focus consistency on weekdays"],
            triggers: ["Digital notifications", "Task ambiguity"],
            psychologicalFactor: "Context switching fatigue",
            strategy: ["Implement strict noise-canceling blocks", "Pre-define task boundaries", "Use mindful transition gaps"],
            riskLevel: "Medium"
        };
    }
}
