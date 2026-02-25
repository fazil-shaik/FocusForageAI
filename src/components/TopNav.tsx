"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    ListTodo,
    BarChart3,
    Settings,
    User,
    Brain,
    Menu,
    X,
    LogOut,
    Trophy
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import { authClient } from "@/lib/auth-client";

interface TopNavProps {
    user: {
        name: string;
        email: string;
        image?: string;
    };
}

export function TopNav({ user }: TopNavProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 0);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Tasks", href: "/tasks", icon: ListTodo },
        { name: "Analytics", href: "/analytics", icon: BarChart3 },
        { name: "Settings", href: "/settings", icon: Settings },
    ];

    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/signin");
                },
            },
        });
    };

    return (
        <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-background/80 backdrop-blur-md border-b border-border shadow-sm' : 'bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/dashboard" className="flex items-center gap-2 group border-none outline-none">
                        <div className="p-1.5 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform">
                            <Brain className="w-6 h-6 text-primary fill-primary/20" />
                        </div>
                        <span className="font-black text-xl tracking-tighter text-foreground hidden sm:block">Forge</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all relative ${isActive
                                        ? "text-primary"
                                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/20"
                                        }`}
                                >
                                    <item.icon className={`w-4 h-4 ${isActive ? "fill-primary/20" : ""}`} />
                                    {item.name}
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-pill"
                                            className="absolute inset-0 bg-primary/10 rounded-xl -z-10 border border-primary/20"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    {/* XP Display - Hidden on very small screens */}
                    <div className="hidden xs:flex items-center gap-2 px-3 py-1.5 bg-secondary/30 rounded-full border border-border">
                        <div className="w-5 h-5 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-sm ring-2 ring-amber-400/20">
                            <Trophy className="w-3 h-3" />
                        </div>
                        <span className="text-sm font-black text-foreground tabular-nums">2,450 <span className="text-[10px] text-muted-foreground ml-0.5">XP</span></span>
                    </div>

                    <div className="hidden sm:block">
                        <ThemeToggle />
                    </div>

                    <div className="h-8 w-px bg-border mx-2 hidden md:block" />

                    {/* Desktop Profile Toggle */}
                    <div className="hidden md:block group relative">
                        <button className="flex items-center gap-2 p-1.5 rounded-2xl bg-secondary/30 border border-border hover:border-primary/50 transition-all border-none outline-none">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-black shadow-inner">
                                {user.name.charAt(0)}
                            </div>
                            <div className="text-left pr-2">
                                <p className="text-xs font-black text-foreground leading-none mb-1">{user.name}</p>
                                <div className="flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Focused</p>
                                </div>
                            </div>
                        </button>

                        {/* Profile Dropdown */}
                        <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-2xl shadow-2xl py-2 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all scale-95 group-hover:scale-100 origin-top-right z-50 overflow-hidden">
                            <div className="px-4 py-3 border-b border-border/50">
                                <p className="text-sm font-black text-foreground">{user.name}</p>
                                <p className="text-xs font-bold text-muted-foreground truncate">{user.email}</p>
                            </div>
                            <div className="p-1">
                                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-xl transition-all border-none outline-none">
                                    <User className="w-4 h-4" /> Profile Details
                                </button>
                                <button
                                    onClick={handleSignOut}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold text-red-500 hover:bg-red-500/10 rounded-xl transition-all border-none outline-none"
                                >
                                    <LogOut className="w-4 h-4" /> Sign Out
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-xl border border-border bg-secondary/5 text-muted-foreground hover:text-foreground transition-all border-none outline-none"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-0 top-[64px] z-40 bg-background md:hidden"
                    >
                        <nav className="flex flex-col p-6 gap-2">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center gap-4 p-4 rounded-2xl text-lg font-bold transition-all border-none outline-none ${isActive
                                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                                            }`}
                                    >
                                        <item.icon className="w-6 h-6" />
                                        {item.name}
                                        {isActive && (
                                            <div className="ml-auto w-2 h-2 rounded-full bg-white animate-pulse" />
                                        )}
                                    </Link>
                                );
                            })}

                            <div className="h-px bg-border my-6" />

                            <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-2xl border border-border">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-black shadow-lg">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-foreground">{user.name}</p>
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{user.email}</p>
                                    </div>
                                </div>
                                <ThemeToggle />
                            </div>

                            <button
                                onClick={() => {
                                    handleSignOut();
                                    setIsMobileMenuOpen(false);
                                }}
                                className="mt-4 flex items-center gap-4 p-4 rounded-2xl text-lg font-bold text-red-500 hover:bg-red-500/10 transition-all text-left border-none outline-none"
                            >
                                <LogOut className="w-6 h-6" />
                                Sign Out
                            </button>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
