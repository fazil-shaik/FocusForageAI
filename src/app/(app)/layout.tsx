import { getSession } from "@/lib/session";
export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";

import { TopNav } from "@/components/TopNav";
import { Toaster } from "sonner";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
import { db } from "@/db";

export default async function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    if (!session) {
        redirect("/signin");
    }

    // Fetch real-time user data for XP sync

    const dbUser = await db.query.users.findFirst({
        where: eq(users.id, session.user.id)
    });

    const user = { ...session.user, ...dbUser };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-300">
            {/* Navigation */}
            <TopNav user={user as any} />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-grid-small-black/[0.2] dark:bg-grid-small-white/[0.2] min-h-[calc(100vh-64px)] relative">
                <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
                <div className="relative z-10 p-6 md:p-10 max-w-7xl mx-auto w-full">
                    {children}
                </div>
            </main>
            <Toaster position="bottom-right" richColors theme="dark" />
        </div>
    );
}


