"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { data: session } = authClient.useSession();

    if (session) {
        router.push("/dashboard");
    }

    const handleSignUp = async () => {
        setLoading(true);
        await authClient.signUp.email({
            email,
            password,
            name,
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
        <div className="bg-card/80 border border-border rounded-[2rem] p-6 md:p-8 backdrop-blur-md shadow-2xl max-w-md w-full mx-4 sm:mx-0">
            <div className="text-center mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl font-black text-foreground mb-2 tracking-tight">Join FocusForge</h1>
                <p className="text-muted-foreground text-xs md:text-sm font-medium">Start your deep work journey today.</p>
            </div>

            <div className="space-y-4 md:space-y-5">
                <div>
                    <label className="block text-[10px] uppercase font-black text-muted-foreground mb-2 tracking-widest">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-black/40 border border-white/5 focus:border-primary rounded-xl px-4 py-3 text-sm md:text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/30 font-medium"
                        placeholder="John Doe"
                    />
                </div>
                <div>
                    <label className="block text-[10px] uppercase font-black text-muted-foreground mb-2 tracking-widest">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-black/40 border border-white/5 focus:border-primary rounded-xl px-4 py-3 text-sm md:text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/30 font-medium"
                        placeholder="you@example.com"
                    />
                </div>
                <div>
                    <label className="block text-[10px] uppercase font-black text-muted-foreground mb-2 tracking-widest">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-black/40 border border-white/5 focus:border-primary rounded-xl px-4 py-3 text-sm md:text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/30 font-medium"
                        placeholder="••••••••"
                    />
                </div>

                <button
                    onClick={handleSignUp}
                    disabled={loading}
                    className="w-full bg-primary text-primary-foreground font-black py-4 rounded-2xl hover:opacity-90 transition-all flex items-center justify-center gap-2 mt-6 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] text-xs uppercase tracking-widest"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign Up"}
                </button>

                <div className="relative my-6 md:my-8">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
                        <span className="bg-card px-4 text-muted-foreground">Or continue with</span>
                    </div>
                </div>

                <button
                    onClick={async () => {
                        await authClient.signIn.social({
                            provider: "google",
                            callbackURL: "/dashboard",
                        });
                    }}
                    className="w-full bg-white/5 border border-white/10 text-foreground font-bold py-4 rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md outline-none"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                    <span className="text-xs font-black uppercase tracking-widest">Sign up with Google</span>
                </button>

                <p className="text-center text-[10px] md:text-xs text-muted-foreground mt-8 font-medium">
                    Already have an account? <Link href="/signin" className="text-primary font-black hover:underline ml-1">SIGN IN</Link>
                </p>
            </div>
        </div>
    );
}
