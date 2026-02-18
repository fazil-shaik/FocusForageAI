"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignIn = async () => {
        setLoading(true);
        await authClient.signIn.email({
            email,
            password,
        }, {
            onSuccess: () => {
                router.push("/dashboard");
            },
            onError: (ctx) => {
                alert(ctx.error.message);
                setLoading(false);
            }
        });
    };

    return (
        <div className="bg-card/80 border border-border rounded-[2rem] p-8 backdrop-blur-md shadow-2xl max-w-md w-full mx-4">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
                <p className="text-muted-foreground text-sm">Sign in to access your FocusForge.</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-foreground mb-2">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-input border border-transparent focus:border-primary rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
                        placeholder="you@example.com"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-foreground mb-2">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-input border border-transparent focus:border-primary rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
                        placeholder="••••••••"
                    />
                </div>

                <button
                    onClick={handleSignIn}
                    disabled={loading}
                    className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-full hover:opacity-90 transition-all flex items-center justify-center gap-2 mt-6 shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
                </button>

                <p className="text-center text-sm text-muted-foreground mt-8">
                    Don't have an account? <Link href="/signup" className="text-primary font-bold hover:underline">Sign Up</Link>
                </p>
            </div>
        </div>
    );
}
