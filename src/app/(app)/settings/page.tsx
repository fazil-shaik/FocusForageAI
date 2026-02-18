import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SettingsForm } from "@/components/SettingsForm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function SettingsPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/signin");
    }

    const user = await db.query.users.findFirst({
        where: eq(users.id, session.user.id),
    });

    if (!user) return null;

    return <SettingsForm user={user} />;
}
