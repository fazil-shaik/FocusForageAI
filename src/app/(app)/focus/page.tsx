"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Brain, CheckCircle, Volume2, Maximize2, X, AlertTriangle, Activity, ChevronRight, Zap, Target, Battery, BrainCircuit, Waves, Clock, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { startFocusSession, updateFocusHeartbeat, endFocusSession } from "./actions";
import { toast } from "sonner";
import { MentalState } from "@/lib/xp-engine";
import { useSpring, useTransform } from "framer-motion";

function Counter({ value }: { value: number }) {
    const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
    const display = useTransform(spring, (current) => Math.round(current).toLocaleString());

    useEffect(() => {
        spring.set(value);
    }, [value, spring]);

    return <motion.span>{display}</motion.span>;
}

export default function FocusSession() {
    const [step, setStep] = useState<"checkin" | "timer" | "summary">("checkin");
    const [mood, setMood] = useState<MentalState>("Neutral");
    const [duration, setDuration] = useState(25);
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [xpEarned, setXpEarned] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [sessionGoal, setSessionGoal] = useState("");
    const [sessionId, setSessionId] = useState<string | null>(null);
    const router = useRouter();

    // Activity tracking refs
    const lastActivityTime = useRef(Date.now());
    const isIdle = useRef(false);
    const heartbeatInterval = useRef<NodeJS.Timeout | null>(null);

    // 1. Heartbeat Loop
    useEffect(() => {
        if (isActive && sessionId) {
            heartbeatInterval.current = setInterval(async () => {
                const now = Date.now();
                const idleSeconds = (now - lastActivityTime.current) / 1000;

                if (idleSeconds > 60 && !isIdle.current) {
                    isIdle.current = true;
                    toast.warning("Idle detected! Stay focused.");
                    await updateFocusHeartbeat({
                        isIdle: true,
                        isTabHidden: document.hidden,
                        event: { type: "distraction", details: { reason: "idle_timeout" }, timestamp: now }
                    });
                } else {
                    if (idleSeconds <= 60) isIdle.current = false;
                    await updateFocusHeartbeat({
                        isIdle: isIdle.current,
                        isTabHidden: document.hidden
                    });
                }
            }, 5000);
        } else {
            if (heartbeatInterval.current) clearInterval(heartbeatInterval.current);
        }
        return () => {
            if (heartbeatInterval.current) clearInterval(heartbeatInterval.current);
        };
    }, [isActive, sessionId]);

    // 2. Distraction Detection
    useEffect(() => {
        const handleVisibilityChange = async () => {
            if (document.hidden && isActive && sessionId) {
                await updateFocusHeartbeat({
                    isIdle: isIdle.current,
                    isTabHidden: true,
                    event: { type: "tab_switch", timestamp: Date.now() }
                });
                toast.error("Tab switch detected! Penalty applied.");
            }
        };

        const handleFocusBlur = async (e: FocusEvent) => {
            if (e.type === "blur" && isActive && sessionId) {
                await updateFocusHeartbeat({
                    isIdle: isIdle.current,
                    isTabHidden: document.hidden,
                    event: { type: "distraction", details: { reason: "window_blur" }, timestamp: Date.now() }
                });
            }
        };

        const resetIdleTimer = () => {
            lastActivityTime.current = Date.now();
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("blur", handleFocusBlur);
        window.addEventListener("focus", handleFocusBlur);
        window.addEventListener("mousemove", resetIdleTimer);
        window.addEventListener("keydown", resetIdleTimer);
        window.addEventListener("touchstart", resetIdleTimer);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("blur", handleFocusBlur);
            window.removeEventListener("focus", handleFocusBlur);
            window.removeEventListener("mousemove", resetIdleTimer);
            window.removeEventListener("keydown", resetIdleTimer);
            window.removeEventListener("touchstart", resetIdleTimer);
        };
    }, [isActive, sessionId]);

    // 3. Timer Logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            finishSession();
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const handleMoodSelect = (selectedMood: MentalState) => {
        setMood(selectedMood);
        if (selectedMood === "Tired") setDuration(20);
        if (selectedMood === "Anxious") setDuration(25);
        if (selectedMood === "Flow") setDuration(60);
        if (selectedMood === "Neutral") setDuration(45);
    };

    const handleStart = async () => {
        if (!sessionGoal.trim()) {
            toast.error("Please set a goal for this session.");
            return;
        }

        try {
            const res = await startFocusSession({
                duration: duration,
                mentalState: mood,
                taskName: sessionGoal,
                allowedDomains: [],
                blockedDomains: [],
            }) as any;

            setSessionId(res.sessionId);
            setTimeLeft(duration * 60);
            setStep("timer");
            setIsActive(true);
            toast.success(`Session started in ${mood} mode.`);
        } catch (error) {
            toast.error("Failed to start session.");
        }
    };

    const finishSession = async () => {
        setIsActive(false);
        setIsSaving(true);
        try {
            const result = await endFocusSession({ status: "completed" });
            setXpEarned(result.xpEarned);
            setStep("summary");
            toast.success("Session completed and synced!");
        } catch (error) {
            toast.error("Failed to sync final results.");
        } finally {
            setIsSaving(false);
        }
    };

    const abandonSession = async () => {
        if (confirm("Are you sure you want to abandon this session?")) {
            setIsActive(false);
            setIsSaving(true);
            try {
                const result = await endFocusSession({ status: "abandoned" });
                setXpEarned(result.xpEarned);
                setStep("summary");
            } catch (error) {
                toast.error("Failed to abandon session.");
            } finally {
                setIsSaving(false);
            }
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const moods = [
        { name: "Tired", icon: Battery, color: "from-blue-500/20 to-slate-500/20", border: "border-blue-500/30", multiplier: "0.6x Penalty", description: "Softer distractions" },
        { name: "Anxious", icon: Waves, color: "from-amber-500/20 to-orange-500/20", border: "border-amber-500/30", multiplier: "2 Shield", description: "Ignores 2 breaks" },
        { name: "Neutral", icon: Activity, color: "from-slate-500/20 to-indigo-500/20", border: "border-slate-500/30", multiplier: "1.0x Base", description: "Standard accuracy" },
        { name: "Flow", icon: BrainCircuit, color: "from-purple-500/30 to-blue-500/30", border: "border-purple-500/50", multiplier: "1.5x Penalty", description: "Strict discipline" },
    ];

    return (
        <div className="min-h-[calc(100vh-100px)] w-full relative flex items-center justify-center p-4 overflow-hidden">
            {/* Ambient Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full -z-10 bg-[#050505]" />
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    x: [0, 50, 0],
                    y: [0, -50, 0],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full -z-10"
            />
            <motion.div
                animate={{
                    scale: [1.2, 1, 1.2],
                    x: [0, -50, 0],
                    y: [0, 30, 0],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent/10 blur-[100px] rounded-full -z-10"
            />

            <AnimatePresence mode="wait">
                {step === "checkin" && (
                    <motion.div
                        key="checkin"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-5 gap-8"
                    >
                        {/* Left Side: Goal & Duration */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-card/40 backdrop-blur-3xl border border-white/5 p-8 rounded-[3rem] shadow-2xl h-full flex flex-col justify-center">
                                <div className="mb-8">
                                    <h1 className="text-4xl font-extrabold text-foreground tracking-tight mb-2">Deep Focus.</h1>
                                    <p className="text-muted-foreground font-medium">Choose your state and define your purpose.</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-xl group-focus-within:bg-primary/10 transition-all" />
                                        <textarea
                                            value={sessionGoal}
                                            onChange={(e) => setSessionGoal(e.target.value)}
                                            placeholder="What is your mission?"
                                            className="relative w-full bg-[#0a0a0b]/60 border border-white/5 p-6 rounded-3xl min-h-[140px] focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all text-xl font-bold tracking-tight text-foreground placeholder:text-muted-foreground/30 resize-none shadow-inner"
                                        />
                                        <div className="absolute bottom-4 right-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 px-2 py-1 bg-white/5 rounded-lg border border-white/10">Goal</div>
                                    </div>

                                    <div className="p-6 bg-[#0a0a0b]/40 rounded-3xl border border-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                                                <Activity className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-0.5">Focus Duration</p>
                                                <p className="text-2xl font-black text-foreground">{duration} <span className="text-sm font-bold text-muted-foreground opacity-50 uppercase tracking-widest">MIN</span></p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => setDuration(Math.max(5, duration - 5))} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-white">-</button>
                                            <button onClick={() => setDuration(Math.min(120, duration + 5))} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-white">+</button>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleStart}
                                        className="group relative w-full py-6 bg-primary text-primary-foreground font-black text-xl rounded-3xl overflow-hidden shadow-[0_20px_40px_rgba(var(--primary-rgb),0.3)] hover:shadow-primary/40 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                        <Play className="w-6 h-6 fill-current" />
                                        <span>INITIATE TRACKER</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Mental State Grid */}
                        <div className="lg:col-span-3">
                            <div className="grid grid-cols-2 gap-4 h-full">
                                {moods.map((m) => (
                                    <button
                                        key={m.name}
                                        onClick={() => handleMoodSelect(m.name as MentalState)}
                                        className={`relative group h-full flex flex-col p-8 rounded-[3rem] border transition-all text-left overflow-hidden ${mood === m.name ? `bg-gradient-to-br ${m.color} ${m.border} shadow-2xl` : 'bg-card/30 border-white/5 hover:border-white/20'}`}
                                    >
                                        <div className="mb-auto flex justify-between items-start">
                                            <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center transition-all ${mood === m.name ? 'scale-110 shadow-lg' : 'group-hover:scale-105'}`}>
                                                <m.icon className={`w-7 h-7 ${mood === m.name ? 'text-primary' : 'text-muted-foreground/50'}`} />
                                            </div>
                                            {mood === m.name && (
                                                <div className="bg-primary/20 text-primary-foreground px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/30">Active</div>
                                            )}
                                        </div>

                                        <div className="mt-8">
                                            <h3 className={`text-2xl font-black mb-1 transition-colors ${mood === m.name ? 'text-foreground' : 'text-muted-foreground'}`}>{m.name}</h3>
                                            <p className="text-xs text-muted-foreground mb-4 font-bold opacity-60 tracking-tight">{m.description}</p>
                                            <div className={`inline-flex px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-[0.2em] ${mood === m.name ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-white/5 border-white/10 text-muted-foreground/60'}`}>
                                                {m.multiplier}
                                            </div>
                                        </div>

                                        {mood === m.name && (
                                            <motion.div layoutId="glow" className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/20 blur-[60px] rounded-full -z-10" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === "timer" && (
                    <motion.div
                        key="timer"
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center w-full h-full flex flex-col items-center justify-center p-10 relative"
                    >
                        {/* Mode Indicator Overlay */}
                        <div className="absolute top-12 flex flex-col items-center gap-4">
                            <div className="flex items-center gap-3 px-6 py-2 bg-secondary/10 backdrop-blur-2xl border border-white/5 rounded-full shadow-2xl">
                                <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                                <span className="text-[11px] font-black text-foreground uppercase tracking-[0.4em]">{mood} Mode Active</span>
                            </div>
                            <h2 className="text-xl font-bold text-muted-foreground/60 tracking-tight italic">"{sessionGoal}"</h2>
                        </div>

                        {/* Large Minimal Timer */}
                        <div className="relative group flex items-center justify-center">
                            <motion.div
                                animate={{ scale: isActive ? [1, 1.01, 1] : 1, opacity: isActive ? [0.8, 1, 0.8] : 1 }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="text-[22vw] lg:text-[18rem] font-black leading-none tracking-tighter tabular-nums text-foreground flex items-baseline gap-2"
                                style={{
                                    textShadow: "0 0 80px rgba(var(--primary-rgb), 0.15)",
                                    WebkitTextStroke: "1px rgba(255,255,255,0.05)"
                                }}
                            >
                                {formatTime(timeLeft)}
                            </motion.div>
                        </div>

                        {/* Controls Bar */}
                        <div className="flex items-center gap-12 mt-12 bg-white/5 backdrop-blur-3xl px-12 py-8 rounded-[4rem] border border-white/10 shadow-2xl">
                            <button
                                onClick={() => setIsActive(!isActive)}
                                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all active:scale-90 relative ${isActive ? 'bg-secondary/10 hover:bg-secondary/20 text-foreground' : 'bg-primary text-primary-foreground shadow-[0_0_30px_rgba(var(--primary-rgb),0.5)]'}`}
                            >
                                {isActive ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10 fill-current ml-2" />}
                            </button>
                            <button
                                onClick={abandonSession}
                                className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-500 transition-all flex items-center justify-center active:scale-90"
                            >
                                <X className="w-8 h-8" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === "summary" && (
                    <motion.div
                        key="summary"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center max-w-2xl w-full p-1 lg:p-12 relative"
                    >
                        {/* Background Celebration Sparkles */}
                        <div className="absolute inset-0 -z-10 pointer-events-none">
                            {[...Array(6)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{
                                        opacity: [0, 1, 0],
                                        scale: [0, 1, 0.5],
                                        x: Math.random() * 400 - 200,
                                        y: Math.random() * 400 - 200
                                    }}
                                    transition={{
                                        duration: 2 + Math.random() * 2,
                                        repeat: Infinity,
                                        delay: Math.random() * 2
                                    }}
                                    className="absolute left-1/2 top-1/2"
                                >
                                    <Sparkles className="w-6 h-6 text-primary/40" />
                                </motion.div>
                            ))}
                        </div>

                        <div className="bg-card/40 backdrop-blur-3xl border border-white/5 rounded-[4rem] shadow-2xl p-8 lg:p-12 relative overflow-hidden">
                            {/* Decorative Glow */}
                            <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/20 blur-[80px] rounded-full" />
                            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-accent/20 blur-[80px] rounded-full" />

                            <motion.div
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="mx-auto w-24 h-24 bg-green-500/10 backdrop-blur-xl rounded-[2.5rem] border border-green-500/20 flex items-center justify-center shadow-2xl mb-8 group"
                            >
                                <CheckCircle className="w-12 h-12 text-green-500 group-hover:scale-110 transition-transform" />
                            </motion.div>

                            <div className="mb-12 relative">
                                <motion.h2
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-5xl lg:text-6xl font-black mb-4 text-foreground tracking-tighter"
                                >
                                    Session Complete
                                </motion.h2>
                                <motion.p
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-muted-foreground font-medium text-lg"
                                >
                                    Your focus has been forged into progress.
                                </motion.p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="relative group lg:col-span-1"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-primary/20 rounded-[3rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="relative bg-[#0a0a0b]/60 backdrop-blur-2xl p-8 rounded-[3rem] border border-white/5 flex flex-col items-center group-hover:border-primary/30 transition-all overflow-hidden">
                                        {/* Animated Shimmer Line */}
                                        <motion.div
                                            animate={{ x: ['100%', '-100%'] }}
                                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                            className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"
                                        />

                                        <Zap className="w-10 h-10 text-primary mb-3 group-hover:animate-bounce" />
                                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-2">Total Reward</span>
                                        <div className="text-6xl font-black text-white tracking-tighter tabular-nums">
                                            {xpEarned >= 0 ? "+" : ""}<Counter value={xpEarned} />
                                        </div>
                                        <span className="text-xs font-bold text-muted-foreground mt-2 uppercase tracking-widest opacity-40">Focus Forge XP</span>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                    className="relative group"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-emerald-500/20 rounded-[3rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="relative bg-[#0a0a0b]/40 backdrop-blur-2xl border border-white/5 rounded-[3rem] p-8 flex flex-col items-center justify-center group-hover:border-secondary/30 transition-all">
                                        <Clock className="w-10 h-10 text-secondary mb-3 group-hover:rotate-12 transition-transform" />
                                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] mb-2">Time Invested</span>
                                        <div className="text-5xl font-black text-foreground">{duration}</div>
                                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-40 mt-1">Minutes Captured</span>
                                    </div>
                                </motion.div>
                            </div>

                            <div className="flex flex-col gap-4 relative">
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.7 }}
                                >
                                    <Link href="/dashboard" className="group relative w-full py-6 bg-white text-black font-black text-xl rounded-[2rem] overflow-hidden hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(255,255,255,0.1)]">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                        <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                        <span>RETURN TO DASHBOARD</span>
                                    </Link>
                                </motion.div>

                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.9 }}
                                    onClick={() => setStep("checkin")}
                                    className="py-4 text-muted-foreground hover:text-primary font-bold transition-all hover:tracking-widest uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-2 group"
                                >
                                    <Brain className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -ml-6 group-hover:ml-0" />
                                    Initiate Another Cycle
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
