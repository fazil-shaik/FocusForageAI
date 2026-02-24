"use server";

import { aiModel } from "./ai";
import { db } from "@/db";
import { userMemories, aiInsights } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * AI Orchestrator Service
 * Handles all structured AI interactions for FocusForge
 */

const SYSTEM_PROMPT = `
You are FocusForge AI, an elite behavioral productivity coach.

Your job:
- Reduce procrastination
- Increase deep work hours
- Detect avoidance patterns
- Provide structured, actionable guidance

Rules:
- Be concise.
- No fluff.
- Give clear steps.
- Use behavioral psychology principles.
- Avoid generic motivation.
- Always personalize based on user data provided.
- Suggest small actionable next steps.
- If emotional distress is detected, be supportive but structured.

Tone:
Professional, sharp, observant, direct.
`;

export async function getBehavioralMemory(userId: string) {
    const memory = await db.query.userMemories.findFirst({
        where: eq(userMemories.userId, userId),
    });
    return memory?.behavioralSummary || "No behavioral history recorded yet.";
}

export async function generateDailyInsight(data: {
    userId: string;
    userName: string;
    metrics: {
        stats: any[];
        sessions: any[];
    };
    xp: number;
}) {
    const { userId, userName, metrics, xp } = data;
    const memory = await getBehavioralMemory(userId);

    const prompt = `
${SYSTEM_PROMPT}

Long-term Behavioral Memory:
${memory}

Current Context:
- User: ${userName}
- XP: ${xp}
- Plan: pro
- Recent Stats: ${JSON.stringify(metrics.stats.slice(0, 3))}
- Recent Sessions: ${JSON.stringify(metrics.sessions.slice(0, 3))}

Task:
Provide ONE sharp, highly personalized insight or direct intervention to improve their deep work rhythm today.
Avoid generic advice. Be observant.

Keep the response under 120 characters.
    `;

    try {
        const result = await aiModel.generateContent(prompt);
        return result.response.text().trim();
    } catch (error) {
        console.error("AI Insight Error:", error);
        return "Consistency is its own reward. Focus on the next small step.";
    }
}

export async function generateDeepWorkPlan(data: {
    userId: string;
    task_list: string;
    available_time: string;
    deadlines: string;
    energy_level: string;
}) {
    const memory = await getBehavioralMemory(data.userId);

    // Using default values for profile fields if not fully available in DB yet
    const prompt = `
${SYSTEM_PROMPT}

User Profile (Memory):
${memory}

Tasks:
${data.task_list}

Constraints:
- Available time today: ${data.available_time}
- Deadlines: ${data.deadlines}
- Current Energy Level: ${data.energy_level}

Your task:
1. Break tasks into deep work blocks.
2. Assign optimal time slots.
3. Tag each block with difficulty (Low/Medium/High).
4. Estimate cognitive load (1-10).
5. Suggest exact start time.
6. Suggest 1 anti-procrastination trigger technique.

Output format: Structured JSON.
    `;

    try {
        const result = await aiModel.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.3 }
        } as any);
        const responseText = result.response.text();
        return JSON.parse(responseText.replace(/```json/g, "").replace(/```/g, "").trim());
    } catch (error) {
        console.error("AI Planner Error:", error);
        throw error;
    }
}

export async function analyzeProcrastinationPatterns(userId: string, weeklyData: any) {
    const prompt = `
${SYSTEM_PROMPT}

User Weekly Data:
${JSON.stringify(weeklyData)}

Analyze:
1. Identify 3 procrastination patterns.
2. Identify 2 environmental triggers.
3. Identify 1 psychological trigger.
4. Suggest behavioral correction plan.
5. Predict risk level next week (Low/Medium/High).

Be specific. Avoid generic advice. Output in bullet points.
    `;

    try {
        const result = await aiModel.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.2 }
        } as any);
        const content = result.response.text().trim();

        // Save to insights
        await db.insert(aiInsights).values({
            userId,
            type: 'pattern_analysis',
            content: { text: content }
        });

        return content;
    } catch (error) {
        console.error("Pattern Analysis Error:", error);
        return null;
    }
}

export async function generateWeeklyReport(userId: string, data: any) {
    const prompt = `
${SYSTEM_PROMPT}

User Data:
${JSON.stringify(data)}

Generate:
1. Weekly performance summary (3 lines max)
2. 3 behavioral insights
3. 2 optimization changes for next week
4. Deep Work Score (0–100)
5. One sharp insight sentence (high impact)

Professional tone.
    `;

    try {
        const result = await aiModel.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.4 }
        } as any);
        const content = result.response.text().trim();

        await db.insert(aiInsights).values({
            userId,
            type: 'weekly_report',
            content: { text: content }
        });

        return content;
    } catch (error) {
        console.error("Weekly Report Error:", error);
        return null;
    }
}

export async function updateBehavioralMemory(userId: string, weeklySummary: string) {
    const memory = await getBehavioralMemory(userId);

    const prompt = `
${SYSTEM_PROMPT}

Long-term Behavioral Memory:
${memory}

Recent Weekly Data:
${weeklySummary}

Update:
1. Refine user behavioral profile.
2. Detect new emerging pattern.
3. Remove outdated assumptions.
4. Return updated behavioral summary (max 150 words).
    `;

    try {
        const result = await aiModel.generateContent(prompt);
        const updatedMemory = result.response.text().trim();

        await db.insert(userMemories)
            .values({ userId, behavioralSummary: updatedMemory })
            .onConflictDoUpdate({
                target: userMemories.userId,
                set: { behavioralSummary: updatedMemory, lastUpdated: new Date() }
            });

        return updatedMemory;
    } catch (error) {
        console.error("Memory Update Error:", error);
        return memory;
    }
}

export async function adjustFocusSession(data: {
    userId: string;
    performance_history: string;
    emotion: string;
    current_time: string;
    difficulty: string;
}) {
    const prompt = `
${SYSTEM_PROMPT}

User Context:
- Last 3 sessions performance: ${data.performance_history}
- Current emotional state: ${data.emotion}
- Time of day: ${data.current_time}
- Task difficulty: ${data.difficulty}

Decide:
1. Ideal session duration (20–90 mins).
2. Break duration.
3. Should intensity be reduced? (Yes/No)
4. Suggest 1 micro-reward.
5. Provide 1 short starting instruction (max 15 words).

Output as structured JSON.
    `;

    try {
        const result = await aiModel.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.6 }
        } as any);
        const responseText = result.response.text();
        return JSON.parse(responseText.replace(/```json/g, "").replace(/```/g, "").trim());
    } catch (error) {
        console.error("Focus Adjustment Error:", error);
        return {
            duration: 25,
            break: 5,
            reduce_intensity: "No",
            reward: "Hydration break",
            instruction: "Focus on the first small step."
        };
    }
}
