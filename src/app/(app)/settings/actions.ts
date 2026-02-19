"use server";

import { db } from "@/db";
import { users, focusSessions, tasks, dailyStats, accounts, sessions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function updateProfile(formData: FormData) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) throw new Error("Unauthorized");

    const name = formData.get("name") as string;

    if (name) {
        await db.update(users)
            .set({ name })
            .where(eq(users.id, session.user.id));
    }

    revalidatePath("/settings");
    revalidatePath("/dashboard"); // To update name in sidebar/greeting
}

export async function deleteAccount() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) throw new Error("Unauthorized");

    const userId = session.user.id;

    // Manually delete related records (Cascade not set in DB)
    await db.delete(focusSessions).where(eq(focusSessions.userId, userId));
    await db.delete(tasks).where(eq(tasks.userId, userId));
    await db.delete(dailyStats).where(eq(dailyStats.userId, userId));

    // Auth related
    await db.delete(accounts).where(eq(accounts.userId, userId));
    // sessions table in Drizzle schema is 'session' in DB usually, checked schema.ts it is 'session' table, export 'sessions'
    // But wait, better-auth might handle its own tables if we use its client, but we are using direct DB access here.
    // The schema has 'sessions' table defined.
    await db.delete(sessions).where(eq(sessions.userId, userId));

    // Finally delete user
    await db.delete(users).where(eq(users.id, userId));

    redirect("/");
}
