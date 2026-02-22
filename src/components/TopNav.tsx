"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, CheckSquare, BarChart2, Settings, LogOut, Brain, Sparkles, User, Sun, Moon, Zap, ChevronDown, Menu, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

interface TopNavProps {
    user: {
        name: string;
        email: string;
        image?: string | null;
        xp?: number;
    };
}

export function TopNav({ user }: TopNavProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/signin");
                },
            },
        });
    };

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return (
        <header className="sticky top-0 w-full border-b border-border bg-card/80 backdrop-blur-xl z-50 transition-all">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Brand */}
                    <div className="flex items-center gap-8">
                        <Link href="/dashboard" className="flex items-center gap-2 group">
                            <div className="p-1 w-10 h-10 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform flex items-center justify-center">
                                <Brain className="w-6 h-6 text-primary fill-primary/20" />
                            </div>
                            <span className="font-black text-xl tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">FocusForge</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-1">
                            <NavItem href="/dashboard" icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard" active={pathname === "/dashboard"} />
                            <NavItem href="/planner" icon={<Sparkles className="w-4 h-4" />} label="AI Planner" active={pathname === "/planner"} />
                            <NavItem href="/focus" icon={<Brain className="w-4 h-4" />} label="Focus" active={pathname === "/focus"} />
                            <NavItem href="/tasks" icon={<CheckSquare className="w-4 h-4" />} label="Tasks" active={pathname === "/tasks"} />
                            <NavItem href="/analytics" icon={<BarChart2 className="w-4 h-4" />} label="Stats" active={pathname === "/analytics"} />
                        </nav>
                    </div>

                    {/* Right side: XP, Theme, User */}
                    <div className="flex items-center gap-4">
                        {/* XP Badge */}
                        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-bold">
                            <Zap className="w-3.5 h-3.5" />
                            {user.xp || 0} XP
                        </div>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-secondary/10 transition-colors text-muted-foreground hover:text-foreground relative"
                        >
                            <Sun className="w-5 h-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute top-2 left-2 w-5 h-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        </button>

                        {/* User Menu */}
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="flex items-center gap-2 p-1 pl-1 pr-2 rounded-full hover:bg-secondary/10 transition-colors border border-transparent hover:border-border"
                            >
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary border border-primary/20 overflow-hidden">
                                    {user.image ? (
                                        <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        user.name?.charAt(0) || "U"
                                    )}
                                </div>
                                <span className="hidden sm:inline text-xs font-medium text-foreground">{user.name?.split(' ')[0]}</span>
                                <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {isMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-2 w-56 rounded-2xl bg-card border border-border shadow-2xl p-2 z-[60]"
                                    >
                                        <div className="px-3 py-2">
                                            <p className="text-sm font-bold text-foreground">{user.name}</p>
                                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                            <div className="mt-2 flex sm:hidden items-center gap-1.5 px-2 py-1 bg-primary/10 text-primary border border-primary/20 rounded-lg text-[10px] font-bold">
                                                <Zap className="w-3 h-3" />
                                                {user.xp || 0} XP
                                            </div>
                                        </div>
                                        <div className="h-px bg-border my-2" />
                                        <Link
                                            href="/settings"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-foreground hover:bg-secondary/10 transition-colors"
                                        >
                                            <Settings className="w-4 h-4" />
                                            <span>Settings</span>
                                        </Link>
                                        <div className="h-px bg-border my-2" />
                                        <button
                                            onClick={handleSignOut}
                                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span>Sign Out</span>
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 rounded-xl border border-border bg-secondary/5 text-muted-foreground hover:text-foreground transition-all"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Container */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden border-t border-border bg-card overflow-hidden"
                    >
                        <nav className="flex flex-col p-4 gap-2">
                            <NavItem href="/dashboard" icon={<LayoutDashboard className="w-5 h-5" />} label="Dashboard" active={pathname === "/dashboard"} />
                            <NavItem href="/planner" icon={<Sparkles className="w-5 h-5" />} label="AI Planner" active={pathname === "/planner"} />
                            <NavItem href="/focus" icon={<Brain className="w-5 h-5" />} label="Focus" active={pathname === "/focus"} />
                            <NavItem href="/tasks" icon={<CheckSquare className="w-5 h-5" />} label="Tasks" active={pathname === "/tasks"} />
                            <NavItem href="/analytics" icon={<BarChart2 className="w-5 h-5" />} label="Stats" active={pathname === "/analytics"} />
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}

function NavItem({ href, icon, label, active = false }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
    return (
        <Link href={href} className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all relative group ${active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
            <span className="relative z-10">{icon}</span>
            <span className="font-medium text-sm relative z-10">{label}</span>
            {active && (
                <motion.div
                    layoutId="active-top-nav"
                    className="absolute inset-0 bg-primary/10 rounded-xl border border-primary/20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                />
            )}
        </Link>
    );
}
