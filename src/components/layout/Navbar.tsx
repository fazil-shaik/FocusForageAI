"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { authClient } from "@/lib/auth-client";
import { Loader2, User, Brain } from "lucide-react";
import { useRouter } from "next/navigation";

export function Navbar() {
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();

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
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="p-1 w-10 h-10 bg-primary/10 rounded-xl group-hover:scale-110 transition-transform flex items-center justify-center">
                        <Brain className="w-6 h-6 text-primary fill-primary/20" />
                    </div>
                    <span className="font-black text-xl tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">FocusForge AI</span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
                    <Link href="/#features" className="hover:text-foreground transition-colors">Features</Link>
                    <Link href="/how-it-works" className="hover:text-foreground transition-colors">How it Works</Link>
                </nav>

                <div className="flex items-center gap-4">
                    <ThemeToggle />

                    {isPending ? (
                        <div className="w-20 h-9 bg-muted/50 rounded-full animate-pulse" />
                    ) : session ? (
                        <div className="flex items-center gap-4">
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
                        <>
                            <Link href="/signin" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                                Login
                            </Link>
                            <Link
                                href="/signup"
                                className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-colors shadow-md"
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
