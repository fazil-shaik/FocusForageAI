import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, CheckSquare, BarChart2, Settings, LogOut, Brain, Sparkles } from "lucide-react";

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
        <div className="min-h-screen bg-black text-white flex">
            {/* Sidebar */}
            <aside className="w-20 md:w-64 border-r border-white/10 flex flex-col fixed h-full bg-black/50 backdrop-blur-xl z-50 transition-all">
                <div className="h-16 flex items-center justify-center md:justify-start md:px-6 border-b border-white/10">
                    <Brain className="w-8 h-8 text-purple-500" />
                    <span className="ml-3 font-bold text-lg hidden md:block bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">FocusForge</span>
                </div>

                <nav className="flex-1 py-6 space-y-2 px-2 md:px-4">
                    <NavItem href="/dashboard" icon={<LayoutDashboard className="w-5 h-5" />} label="Command Center" active />
                    <NavItem href="/planner" icon={<Sparkles className="w-5 h-5" />} label="AI Planner" />
                    <NavItem href="/focus" icon={<Brain className="w-5 h-5" />} label="Focus Mode" />
                    <NavItem href="/tasks" icon={<CheckSquare className="w-5 h-5" />} label="Task Flow" />
                    <NavItem href="/analytics" icon={<BarChart2 className="w-5 h-5" />} label="Neural Stats" />
                    <NavItem href="/settings" icon={<Settings className="w-5 h-5" />} label="Settings" />
                </nav>

                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-3 md:px-2 rounded-lg p-2 hover:bg-white/5 transition-colors cursor-pointer group">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold">
                            {session.user.name?.charAt(0) || "U"}
                        </div>
                        <div className="hidden md:block overflow-hidden">
                            <p className="text-sm font-medium truncate">{session.user.name}</p>
                            <p className="text-xs text-gray-500 truncate">Pro Account</p>
                        </div>
                        <LogOut className="w-4 h-4 ml-auto text-gray-500 group-hover:text-red-400 transition-colors hidden md:block" />
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-20 md:ml-64 bg-grid-white bg-fixed min-h-screen relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-black to-black z-0 pointer-events-none"></div>
                <div className="relative z-10 p-6 md:p-10">
                    {children}
                </div>
            </main>
        </div>
    );
}

function NavItem({ href, icon, label, active = false }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
    return (
        <Link href={href} className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${active ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
            <span className={active ? 'text-purple-400' : 'text-gray-400 group-hover:text-white transition-colors'}>{icon}</span>
            <span className="hidden md:block font-medium">{label}</span>
            {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.5)] hidden md:block"></div>}
        </Link>
    )
}
