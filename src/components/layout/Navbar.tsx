"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { authClient } from "@/lib/auth-client";
import { Loader2, User, Brain, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/signin"); // Redirect to signin after logout
                },
            },
        });
    };

    return (
        <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between relative z-50">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="p-1 w-10 h-10 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform flex items-center justify-center text-primary">
                        <Brain className="w-6 h-6 fill-primary/20" />
                    </div>
                    <span className="font-black text-xl tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">FocusForge AI</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
                    <Link href="/#features" className="hover:text-foreground transition-colors">Features</Link>
                    <Link href="/how-it-works" className="hover:text-foreground transition-colors">How it Works</Link>
                </nav>

                <div className="flex items-center gap-4">
                    <div className="hidden md:block">
                        <ThemeToggle />
                    </div>

                    {isPending ? (
                        <div className="w-20 h-9 bg-muted/50 rounded-full animate-pulse hidden md:block" />
                    ) : session ? (
                        <div className="hidden md:flex items-center gap-4">
                            <Link
                                href="/dashboard"
                                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                            >
                                Dashboard
                            </Link>
                            <div className="group relative">
                                <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 hover:bg-secondary/20 transition-colors">
                                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                                        {session.user.name?.charAt(0) || <User className="w-3 h-3" />}
                                    </div>
                                    <span className="text-sm font-medium truncate max-w-[100px]">{session.user.name}</span>
                                </button>

                                {/* Simple Dropdown */}
                                <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-lg py-1 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all transform origin-top-right">
                                    <Link href="/settings" className="block px-4 py-2 text-sm hover:bg-muted text-muted-foreground hover:text-foreground">
                                        Settings
                                    </Link>
                                    <button
                                        onClick={handleSignOut}
                                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-muted"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center gap-4">
                            <Link href="/signin" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                                Login
                            </Link>
                            <Link
                                href="/signup"
                                className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-colors shadow-lg"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-xl border border-border bg-secondary/5 text-muted-foreground hover:text-foreground transition-all"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Container */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="md:hidden border-t border-border bg-background overflow-hidden absolute top-16 left-0 w-full z-40 bg-card"
                    >
                        <nav className="flex flex-col p-6 gap-4">
                            <Link
                                href="/#features"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-lg font-bold text-foreground hover:text-primary transition-colors flex items-center justify-between"
                            >
                                Features
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Brain className="w-4 h-4 text-primary" />
                                </div>
                            </Link>
                            <Link
                                href="/how-it-works"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-lg font-bold text-foreground hover:text-primary transition-colors flex items-center justify-between"
                            >
                                How it Works
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Brain className="w-4 h-4 text-primary" />
                                </div>
                            </Link>
                            <div className="h-px bg-border my-2" />
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Theme</span>
                                <ThemeToggle />
                            </div>
                            <div className="h-px bg-border my-2" />

                            {session ? (
                                <>
                                    <Link
                                        href="/dashboard"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-lg font-bold text-foreground hover:text-primary transition-colors"
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        href="/settings"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-lg font-bold text-foreground hover:text-primary transition-colors"
                                    >
                                        Settings
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleSignOut();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="text-lg font-bold text-red-500 hover:text-red-600 transition-colors text-left"
                                    >
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <Link
                                        href="/signin"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="px-6 py-3 rounded-2xl bg-secondary/10 border border-border text-foreground font-bold text-center hover:bg-secondary/20 transition-all"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/signup"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-center hover:opacity-90 transition-all shadow-lg"
                                    >
                                        Join Free
                                    </Link>
                                </div>
                            )}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
