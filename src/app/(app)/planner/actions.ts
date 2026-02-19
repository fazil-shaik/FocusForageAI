"use server";

import { db } from "@/db";
import { tasks } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function savePlanToTasks(plan: any) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) throw new Error("Unauthorized");

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
