import { NextRequest, NextResponse } from "next/server";
import { generateDeepWorkPlan } from "@/lib/gemini-planner";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        let { tasks, availableTime, energyLevel } = body;

        // Check Plan Limits
        const user = await db.query.users.findFirst({
            where: eq(users.id, session.user.id),
        });

        if (user?.plan === "free") {
            const { redis } = await import("@/lib/redis");
            const dateKey = new Date().toISOString().split("T")[0];
            const redisKey = `planner_limit:${session.user.id}:${dateKey}`;

            const currentCount = await redis.get(redisKey);
            if (currentCount && parseInt(currentCount) >= 1) {
                return NextResponse.json({ error: "LIMIT_REACHED" }, { status: 403 });
            }

            if (tasks.length > 3) {
                return NextResponse.json({ error: "Free plan is limited to 3 tasks. Upgrade to Pro." }, { status: 403 });
            }

            // Increment count immediately on generation
            await redis.incr(redisKey);
            await redis.expire(redisKey, 86400); // 1 day
        }

        if (!tasks || !availableTime || !energyLevel) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const plan = await generateDeepWorkPlan(tasks, availableTime, energyLevel);
        return NextResponse.json(plan);
    } catch (error) {
        console.error("Planner API Error:", error);
        return NextResponse.json({ error: "Failed to generate plan" }, { status: 500 });
    }
}
