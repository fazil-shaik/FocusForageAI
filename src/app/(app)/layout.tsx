import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { TopNav } from "@/components/TopNav";

export default async function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/signin");
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-300">
            {/* Navigation */}
            <TopNav user={session.user as any} />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-grid-small-black/[0.2] dark:bg-grid-small-white/[0.2] min-h-[calc(100vh-64px)] relative">
                <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
                <div className="relative z-10 p-6 md:p-10 max-w-7xl mx-auto w-full">
                    {children}
                </div>
            </main>
        </div>
    );
}


