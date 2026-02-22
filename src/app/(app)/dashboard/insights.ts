"use server";

import { aiModel } from "@/lib/ai";

export async function generateDynamicInsight(data: {
    userPlan: string;
    userName: string;
    metrics: {
        stats: any[];
        sessions: any[];
    };
    xp: number;
}) {
    const { userPlan, userName, metrics, xp } = data;

    if (userPlan === "pro") {
        try {
            const prompt = `
                You are a productivity coach for FocusForageAI. 
                Analyze the following performance metrics for ${userName} and provide ONE concise, valuable, and actionable insight or recommendation.
                
                Current XP: ${xp}
                Last 7 Days Stats: ${JSON.stringify(metrics.stats)}
                Recent Sessions: ${JSON.stringify(metrics.sessions)}
                
                Focus on patterns like:
                - Energy management and consistency.
                - Rushing behavior: They boosted ${metrics.sessions.filter(s => s.isBoosted).length} sessions.
                - Why they might be boosting (impatience vs. flow).
                - Actionable tips to improve deep work quality.
                
                Keep the response under 100 characters. Be encouraging, slightly provocative, and highly personalized.
            `;

            const result = await aiModel.generateContent(prompt);
            return result.response.text();
        } catch (error) {
            console.error("AI Insight Error:", error);
            return "Your focus score is looking strong! Keep maintaining your current rhythm.";
        }
    }

    // Rule-based engine for Free users
    const totalMinutes = metrics.stats.reduce((acc, curr) => acc + (curr.totalDeepWorkMinutes || 0), 0);
    const avgMinutes = totalMinutes / (metrics.stats.length || 1);
    const totalDistractions = metrics.stats.reduce((acc, curr) => acc + (curr.distractionCount || 0), 0);

    if (totalMinutes === 0) {
        return "Ready to start your first focus session? Your productivity journey begins now!";
    }

    if (totalDistractions > 10) {
        return "You've been a bit distracted lately. Consider trying a shorter focus interval to build momentum.";
    }

    if (avgMinutes > 120) {
        return "Incredible focus! You're consistently hitting deep work milestones. Keep it up!";
    }

    if (xp > 500) {
        return `You've earned ${xp} XP! You're becoming a productivity master. Upgrade to Pro for deeper insights.`;
    }

    return "Consistency is key. Try to schedule at least one deep work session today.";
}
