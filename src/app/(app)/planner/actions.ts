"use server";

import { db } from "@/db";
import { tasks } from "@/db/schema";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function savePlanToTasks(plan: any) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    // Check Plan Limits (1 AI Plan per day for free users)
    const { eq, and, sql } = await import("drizzle-orm");
    const { users, tasks: taskTable } = await import("@/db/schema");

    const user = await db.query.users.findFirst({
        where: eq(users.id, session.user.id),
    });

    if (user?.plan === "free") {
        const { redis } = await import("@/lib/redis");
        const today = new Date().toISOString().split("T")[0];
        const redisKey = `planner_limit:${session.user.id}:${today}`;
        const currentCount = await redis.get(redisKey);

        if (currentCount && parseInt(currentCount) >= 1) {
            throw new Error("LIMIT_REACHED: Daily limit of 1 AI Plan reached for free users. Upgrade to Pro for unlimited planning.");
        }
    }

    if (!plan || !plan.schedule || !Array.isArray(plan.schedule)) {
        throw new Error("Invalid plan format");
    }

    const newTasks = plan.schedule.map((item: any) => {
        let priority = "medium";
        if (item.type === "Deep Work") priority = "high";
        if (item.type === "Break") priority = "low";

        return {
            userId: session.user.id,
            title: item.activity,
            description: `${item.notes || ''} [Scheduled: ${item.time}]`,
            status: "todo",
            priority: priority,
            estimatedDuration: item.duration || 25, // Fallback if not parsed
            aiComplexityScore: item.type === "Deep Work" ? 8 : 3,
        };
    });

    await db.insert(tasks).values(newTasks);

    redirect("/tasks");
}

export async function getPlannerCredits() {
    const session = await getSession();
    if (!session) return { count: 0, total: 1, plan: 'free' };

    const { eq, and, sql } = await import("drizzle-orm");
    const { users, tasks: taskTable } = await import("@/db/schema");

    const user = await db.query.users.findFirst({
        where: eq(users.id, session.user.id),
    });

    if (user?.plan === "pro") {
        return { count: Infinity, total: Infinity, plan: 'pro' };
    }

    const { redis } = await import("@/lib/redis");
    const today = new Date().toISOString().split("T")[0];
    const redisKey = `planner_limit:${session.user.id}:${today}`;
    const currentCount = await redis.get(redisKey);
    const count = currentCount ? parseInt(currentCount) : 0;

    return {
        count: count >= 1 ? 0 : 1,
        total: 1,
        plan: 'free'
    };
}
