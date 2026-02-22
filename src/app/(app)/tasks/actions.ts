"use server";

import { db } from "@/db";
import { tasks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redis } from "@/lib/redis";

export async function getTasks() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) return [];

    return await db.query.tasks.findMany({
        where: eq(tasks.userId, session.user.id),
    });
}

export async function createTask(formData: FormData) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) throw new Error("Unauthorized");

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const priority = formData.get("priority") as string;

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
    const session = await auth.api.getSession({
        headers: await headers(),
    });
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
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) throw new Error("Unauthorized");

    await db.delete(tasks)
        .where(eq(tasks.id, taskId));

    const cacheKey = `dashboard:recentTasks:${session.user.id}`;
    await redis.del(cacheKey);

    revalidatePath("/tasks");
}
