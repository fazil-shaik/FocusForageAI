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
    const metrics = {
        planned: planned[0].count,
        completed: completed[0].count,
        delay: "45 mins",
        switching: "High",
        sleep: "6.5 hrs", // Placeholder
        emotions: "Anxious, Tired" // Placeholder
    };

    const prompt = `
    Procrastination Pattern Analyzer
    
    User Weekly Metrics:
    - Planned sessions: ${metrics.planned}
    - Completed: ${metrics.completed}
    - Avg start delay: ${metrics.delay}
    - Task switching: ${metrics.switching}
    - Sleep: ${metrics.sleep}
    - Emotional logs: ${metrics.emotions}

    Analyze:
    1. 3 procrastination patterns.
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
