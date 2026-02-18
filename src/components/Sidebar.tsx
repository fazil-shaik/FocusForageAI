"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, CheckSquare, BarChart2, Settings, LogOut, Brain, Sparkles, User, Sun, Moon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

interface SidebarProps {
    user: {
        name: string;
        email: string;
        image?: string | null;
    };
}

export function Sidebar({ user }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { theme, setTheme } = useTheme();

    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/signin"); // Redirect to signin after logout
                },
            },
        });
    };

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return (
        <aside className="w-20 md:w-64 border-r border-white/10 flex flex-col fixed h-full bg-black/50 backdrop-blur-xl z-50 transition-all">
            <div className="h-16 flex items-center justify-center md:justify-start md:px-6 border-b border-white/10">
                <Brain className="w-8 h-8 text-purple-500" />
                <span className="ml-3 font-bold text-lg hidden md:block bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">FocusForge</span>
            </div>

            <nav className="flex-1 py-6 space-y-2 px-2 md:px-4">
                <NavItem href="/dashboard" icon={<LayoutDashboard className="w-5 h-5" />} label="Command Center" active={pathname === "/dashboard"} />
                <NavItem href="/planner" icon={<Sparkles className="w-5 h-5" />} label="AI Planner" active={pathname === "/planner"} />
                <NavItem href="/focus" icon={<Brain className="w-5 h-5" />} label="Focus Mode" active={pathname === "/focus"} />
                <NavItem href="/tasks" icon={<CheckSquare className="w-5 h-5" />} label="Task Flow" active={pathname === "/tasks"} />
                <NavItem href="/analytics" icon={<BarChart2 className="w-5 h-5" />} label="Neural Stats" active={pathname === "/analytics"} />
                <NavItem href="/settings" icon={<Settings className="w-5 h-5" />} label="Settings" active={pathname === "/settings"} />
            </nav>

            <div className="p-4 border-t border-white/10 space-y-4">
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="flex items-center gap-3 md:px-2 rounded-lg p-2 hover:bg-white/5 transition-colors w-full text-gray-400 hover:text-white"
                >
                    <div className="relative w-5 h-5">
                        <Sun className="absolute w-5 h-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute w-5 h-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    </div>
                    <span className="hidden md:block text-sm font-medium">Toggle Theme</span>
                </button>

                {/* User Profile */}
                <div className="flex items-center gap-3 md:px-2 rounded-lg p-2 hover:bg-white/5 transition-colors cursor-pointer group">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white">
                        {user.image ? (
                            <img src={user.image} alt={user.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                            user.name?.charAt(0) || "U"
                        )}
                    </div>
                    <div className="hidden md:block overflow-hidden">
                        <p className="text-sm font-medium truncate text-white">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <button onClick={handleSignOut} className="ml-auto hidden md:block">
                        <LogOut className="w-4 h-4 text-gray-500 group-hover:text-red-400 transition-colors" />
                    </button>
                </div>
            </div>
        </aside>
    );
}

function NavItem({ href, icon, label, active = false }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
    return (
        <Link href={href} className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${active ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
            <span className={active ? 'text-purple-400' : 'text-gray-400 group-hover:text-white transition-colors'}>{icon}</span>
            <span className="hidden md:block font-medium">{label}</span>
            {active && (
                <motion.div
                    layoutId="active-nav"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.5)] hidden md:block"
                />
            )}
        </Link>
    )
}
