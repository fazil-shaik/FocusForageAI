"use server";

import { generateDailyInsight as orchestrateInsight } from "@/lib/ai-orchestrator";

export async function generateDynamicInsight(data: {
    userId: string;
    userPlan: string;
    userName: string;
    metrics: {
        stats: any[];
        sessions: any[];
    };
    xp: number;
}) {
    const { userId, userPlan, userName, metrics, xp } = data;

    if (userPlan === "pro") {
        return await orchestrateInsight({
            userId,
            userName,
            metrics,
            xp,
            userPlan
        });
    }

    // Rule-based engine for Free users (Keep it fast and simple)
    const totalMinutes = metrics.stats.reduce((acc, curr) => acc + (curr.totalDeepWorkMinutes || 0), 0);
    const avgMinutes = totalMinutes / (metrics.stats.length || 1);
    const totalDistractions = metrics.stats.reduce((acc, curr) => acc + (curr.distractionCount || 0), 0);

    if (totalMinutes === 0) {
        return "Ready to start your first focus session? Your productivity journey begins now!";
    }

    if (totalDistractions > 10) {
        return "You've been a bit distracted lately. Consider trying a shorter focus interval.";
    }

    if (avgMinutes > 120) {
        return "Incredible focus! Consistently hitting deep work milestones. Keep it up!";
    }

    if (xp > 500) {
        return `You've earned ${xp} XP! Upgrade to Pro for deep behavioral pattern analysis.`;
    }

    return "Consistency is key. Try to schedule at least one deep work session today.";
}
