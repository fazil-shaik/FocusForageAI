import { getSession } from "@/lib/session";
export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { SettingsForm } from "@/components/SettingsForm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function SettingsPage() {
    const session = await getSession();

    if (!session) {
        redirect("/signin");
    }

    const user = await db.query.users.findFirst({
        where: eq(users.id, session.user.id),
    });

    if (!user) return null;

    return <SettingsForm user={user} />;
}
