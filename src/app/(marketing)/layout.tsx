import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SmoothScroll } from "@/components/SmoothScroll";
// import { Button } from "@/components/ui/button";

import { Navbar } from "@/components/layout/Navbar";

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SmoothScroll>
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1 pt-16">
                    {children}
                </main>
                <footer className="border-t border-border bg-card py-8">
                    <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
                        © {new Date().getFullYear()} FocusForge AI. All rights reserved.
                    </div>
                </footer>
            </div>
        </SmoothScroll>
    );
}
