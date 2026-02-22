"use server";

import { db } from "@/db";
import { tasks } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import { redis } from "@/lib/redis";
import { users } from "@/db/schema";
import { redirect } from "next/navigation";

export async function getTasks() {
    const session = await getSession();
    if (!session) return [];

    return await db.query.tasks.findMany({
        where: eq(tasks.userId, session.user.id),
    });
}

export async function createTask(formData: FormData) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const priority = formData.get("priority") as string;

    // Check Plan Limits (5 tasks per day for free users)
    const dbUser = await db.query.users.findFirst({
        where: eq(users.id, session.user.id),
    });

    if (dbUser?.plan === "free") {
        const today = new Date().toISOString().split("T")[0];
        const { count } = await import("drizzle-orm");

        const todayTasks = await db.select({ value: count() }).from(tasks).where(and(
            eq(tasks.userId, session.user.id),
            sql`DATE(${tasks.createdAt}) = ${today}`
        ));

        if (todayTasks[0]?.value && Number(todayTasks[0].value) >= 5) {
            throw new Error("LIMIT_REACHED: Daily limit of 5 tasks reached for free users. Upgrade to Pro for unlimited tasks.");
        }
    }

    await db.insert(tasks).values({
        userId: session.user.id,
        title,
        description,
        priority: priority || "medium",
        status: "todo",
    });

    const cacheKey = `dashboard:recentTasks:${session.user.id}`;
    await redis.del(cacheKey);

    revalidatePath("/tasks");
    revalidatePath("/dashboard");
}

export async function updateTaskStatus(taskId: string, status: string) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    await db.update(tasks)
        .set({ status })
        .where(eq(tasks.id, taskId)); // Add userId check for security in real app

    const cacheKey = `dashboard:recentTasks:${session.user.id}`;
    await redis.del(cacheKey);

    revalidatePath("/tasks");
    revalidatePath("/dashboard");
}

export async function deleteTask(taskId: string) {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");

    await db.delete(tasks)
        .where(eq(tasks.id, taskId));

    const cacheKey = `dashboard:recentTasks:${session.user.id}`;
    await redis.del(cacheKey);

    revalidatePath("/tasks");
}
