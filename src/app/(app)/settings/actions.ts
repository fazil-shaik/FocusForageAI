"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
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

    await db.delete(users).where(eq(users.id, session.user.id));

    // Auth cleanup if needed, but DB delete cascades usually handle it
    // Better Auth might need explicit session cleanup?
    // For now, redirect to home
    redirect("/");
}
