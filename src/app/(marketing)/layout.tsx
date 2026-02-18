import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SmoothScroll } from "@/components/SmoothScroll";
// import { Button } from "@/components/ui/button";

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SmoothScroll>
            <div className="flex flex-col min-h-screen">
                <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border">
                    <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                        <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                            FocusForge AI
                        </Link>
                        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
                            <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
                            <Link href="#how-it-works" className="hover:text-foreground transition-colors">How it Works</Link>
                            <Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
                        </nav>
                        <div className="flex items-center gap-4">
                            <ThemeToggle />
                            <Link href="/signin" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                                Login
                            </Link>
                            <Link
                                href="/signup"
                                className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-colors shadow-md"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </header>
                <main className="flex-1 pt-16">
                    {children}
                </main>
                <footer className="border-t border-border bg-card py-8">
                    <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
                        © {new Date().getFullYear()} FocusForge AI. Made with 🧡 and 🧠.
                    </div>
                </footer>
            </div>
        </SmoothScroll>
    );
}
