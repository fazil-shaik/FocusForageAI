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

    return await orchestrateInsight({
        userId,
        userName,
        metrics,
        xp
    });
}
