import Link from "next/link";
import { Button } from "@/components/ui/button"; // Note: I need to create this button component or use standard HTML for now. I'll use standard Tailwind for now to avoid dependency on shadcn right away, or build a simple one.

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen">
            <header className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-lg border-b border-white/5">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                        FocusForge AI
                    </Link>
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
                        <Link href="#features" className="hover:text-white transition-colors">Features</Link>
                        <Link href="#how-it-works" className="hover:text-white transition-colors">How it Works</Link>
                        <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
                    </nav>
                    <div className="flex items-center gap-4">
                        <Link href="/signin" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                            Login
                        </Link>
                        <Link
                            href="/signup"
                            className="px-4 py-2 rounded-full bg-white text-black text-sm font-semibold hover:bg-gray-200 transition-colors"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </header>
            <main className="flex-1 pt-16">
                {children}
            </main>
            <footer className="border-t border-white/5 bg-black py-8">
                <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
                    © {new Date().getFullYear()} FocusForge AI. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
