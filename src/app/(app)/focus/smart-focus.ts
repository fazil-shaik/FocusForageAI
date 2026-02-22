"use server";

import { generateContent } from "@/lib/ai";
import { db } from "@/db";
import { focusSessions } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getSession } from "@/lib/session";

export async function generateSmartSessionConfig(mood: string, difficulty: string) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    // Fetch Last 3 Sessions
    const history = await db.query.focusSessions.findMany({
        where: eq(focusSessions.userId, session.user.id),
        orderBy: [desc(focusSessions.startTime)],
        limit: 3,
    });

    const performanceSummary = history.map(s =>
        `Duration: ${s.duration}m, Mood: ${s.moodStart}->${s.moodEnd || '?'}, Status: ${s.status}`
    ).join("; ");

    const prompt = `
    Smart Focus AI:
    
    User State:
    - Last 3 sessions: ${performanceSummary || "No recent history"}
    - Current mood: ${mood}
    - Task difficulty: ${difficulty}

    Decide:
    1. Session duration (20–90 mins).
    2. Break duration.
    3. Intensity level.
    4. Micro reward suggestion.

    Return JSON only: { "duration": number, "breakDuration": number, "intensity": "Low"|"Medium"|"High", "microReward": string }
    `;

    try {
        const response = await generateContent(prompt);
        const cleaned = response.replace(/```json/g, "").replace(/```/g, "");
        return JSON.parse(cleaned);
    } catch (error) {
        console.error("Smart Focus Error:", error);
        // Fallback
        return { duration: 25, breakDuration: 5, intensity: "Medium", microReward: "Stretch" };
    }
}
