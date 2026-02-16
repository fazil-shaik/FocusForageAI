import { NextRequest, NextResponse } from "next/server";
import { generateDeepWorkPlan } from "@/lib/gemini-planner";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { tasks, availableTime, energyLevel } = body;

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
