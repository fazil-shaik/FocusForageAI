"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RefreshCw, Zap, BrainCircuit, ChevronLeft, ChevronRight, Brain } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { startFocusSession, endFocusSession, updateFocusHeartbeat } from "@/app/(app)/focus/actions";
import { toast } from "sonner";
import { MentalState } from "@/lib/xp-engine";


import { tasks } from "@/db/schema";

type Task = typeof tasks.$inferSelect;

export function FocusTimer({ userPlan = "free", recentTasks = [] }: { userPlan?: string; recentTasks?: Task[] }) {
    const isPro = userPlan === "pro";
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(25);
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(recentTasks[0]?.id || null);
    const [isSaving, setIsSaving] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [mentalState, setMentalState] = useState<MentalState>("Neutral");

    const circleRef = useRef<SVGSVGElement>(null);
    const heartbeatInterval = useRef<NodeJS.Timeout | null>(null);

    const radius = 120;
    const circumference = 2 * Math.PI * radius;

    // Heartbeat Logic for Dashboard Timer
    useEffect(() => {
        if (isPlaying && sessionId) {
            heartbeatInterval.current = setInterval(async () => {
                await updateFocusHeartbeat({
                    isIdle: false, // Dashboard timer doesn't track idle as strictly yet
                    isTabHidden: document.hidden,
                });
            }, 5000);
        } else {
            if (heartbeatInterval.current) clearInterval(heartbeatInterval.current);
        }
        return () => {
            if (heartbeatInterval.current) clearInterval(heartbeatInterval.current);
        };
    }, [isPlaying, sessionId]);

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
        if (!isDragging || isPlaying || !circleRef.current) return;

        const rect = circleRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        const angle = Math.atan2(clientY - centerY, clientX - centerX);
        let degrees = (angle * 180) / Math.PI + 90;
        if (degrees < 0) degrees += 360;

        const minutes = Math.max(1, Math.round((degrees / 360) * 120));
        handleDurationChange(minutes);
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', () => setIsDragging(false));
            window.addEventListener('touchmove', handleMouseMove);
            window.addEventListener('touchend', () => setIsDragging(false));
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleMouseMove);
        };
    }, [isDragging]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isPlaying) {
            handleFinish();
        }
        return () => clearInterval(interval);
    }, [isPlaying, timeLeft]);

    const handleFinish = async () => {
        setIsPlaying(false);
        setIsSaving(true);
        try {
            const res = await endFocusSession({ status: "completed", taskId: selectedTaskId || undefined });
            toast.success(`Session saved! +${res.xpEarned} XP earned.`);
            setSessionId(null);
        } catch (err) {
            toast.error("Failed to sync session.");
        } finally {
            setIsSaving(false);
        }
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const toggleTimer = async () => {
        if (!isPlaying) {
            // Starting session
            try {
                const res = await startFocusSession({
                    duration,
                    mentalState,
                    taskName: recentTasks.find(t => t.id === selectedTaskId)?.title || "Dashboard Timer",
                    taskId: selectedTaskId || undefined,
                    allowedDomains: [],
                    blockedDomains: []
                });
                setSessionId(res.sessionId);
                setIsPlaying(true);
                toast.success("Focus started!");
            } catch (err) {
                toast.error("Failed to start session.");
            }
        } else {
            // Pausing/Stopping (Treat as interim completion for simplicity in dashboard)
            setIsPlaying(false);
        }
    };

    const resetTimer = () => {
        setIsPlaying(false);
        setTimeLeft(duration * 60);
        setSessionId(null);
    };

    const handleDurationChange = (newVal: number) => {
        if (isPlaying) return;
        const clamped = Math.max(1, Math.min(newVal, 120));
        setDuration(clamped);
        setTimeLeft(clamped * 60);
    };

    const handleBoost = async () => {
        if (isSaving || !sessionId) return;
        setIsSaving(true);
        setIsPlaying(false);

        try {
            const res = await endFocusSession({
                status: "completed",
                taskId: selectedTaskId || undefined
            });
            toast.warning(`Boosted skip! ${res.xpEarned} XP change.`);
            setTimeLeft(0);
            setSessionId(null);
        } catch (error: any) {
            toast.error("Boost failed.");
            console.error("Boost failed", error);
        } finally {
            setIsSaving(false);
        }
    };

    // Calculate stroke logic
    // When idle: show percentage of 120m max
    // When playing: show percentage of session completed (0 -> 100%)
    const maxDurationMinutes = 120;
    const idleProgress = duration / maxDurationMinutes;
    const sessionProgress = isPlaying ? (1 - (timeLeft / (duration * 60))) : idleProgress;
    const strokeDashoffset = circumference - (sessionProgress * circumference);

    // Knob position calculation
    const currentAngle = (isPlaying ? (sessionProgress * 360) : (idleProgress * 360)) - 90;
    const knobX = 140 + radius * Math.cos((currentAngle * Math.PI) / 180);
    const knobY = 140 + radius * Math.sin((currentAngle * Math.PI) / 180);

    return (
        <div className="lg:col-span-2 bg-card/50 rounded-3xl p-8 relative overflow-hidden flex flex-col items-center justify-center min-h-[500px] border border-border backdrop-blur-md shadow-sm">
            {/* Adaptive Mode Badge */}
            <div className={`absolute top-4 right-4 px-3 py-1 rounded-full border text-xs flex items-center gap-2 ${isPro ? 'bg-secondary/10 border-border text-muted-foreground' : 'bg-muted border-transparent text-muted-foreground opacity-70'}`}>
                {isPro ? (
                    <>
                        <BrainCircuit className="w-3 h-3 text-primary" /> AI Adaptive Mode
                    </>
                ) : (
                    <>
                        <BrainCircuit className="w-3 h-3" /> Adaptive Mode (Pro)
                    </>
                )}
            </div>

            <div className="relative w-72 h-72 flex items-center justify-center mb-12">
                {/* SVG Circular Interaction */}
                <svg
                    ref={circleRef}
                    className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
                    viewBox="0 0 280 280"
                >
                    {/* Background Track */}
                    <circle
                        cx="140"
                        cy="140"
                        r={radius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="12"
                        className="text-muted/10"
                    />
                    {/* Progress Fill */}
                    {/* Main Circular Progress Ring with Glow */}
                    <motion.circle
                        cx="140"
                        cy="140"
                        r={radius}
                        fill="none"
                        stroke="url(#timer-gradient)"
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{
                            strokeDashoffset,
                            filter: isPlaying ? ["drop-shadow(0 0 2px var(--primary))", "drop-shadow(0 0 8px var(--primary))", "drop-shadow(0 0 2px var(--primary))"] : "none"
                        }}
                        transition={{
                            strokeDashoffset: { duration: isDragging ? 0 : (isPlaying ? 1 : 0.5), ease: "linear" },
                            filter: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                        }}
                    />
                    <defs>
                        <linearGradient id="timer-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="var(--primary)" />
                            <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Draggable Knob Handle */}
                {!isPlaying && (
                    <motion.div
                        className="absolute w-6 h-6 bg-white rounded-full border-2 border-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)] z-30 cursor-grab active:cursor-grabbing touch-none"
                        style={{
                            left: knobX - 12,
                            top: knobY - 12,
                        }}
                        onMouseDown={() => setIsDragging(true)}
                        onTouchStart={() => setIsDragging(true)}
                        whileHover={{ scale: 1.2, boxShadow: "0 0 20px rgba(var(--primary-rgb),0.8)" }}
                        whileTap={{ scale: 0.9 }}
                    />
                )}

                {/* Draggable Area Overlay */}
                {!isPlaying && (
                    <div
                        onMouseDown={() => setIsDragging(true)}
                        onTouchStart={() => setIsDragging(true)}
                        className="absolute inset-0 z-20 rounded-full cursor-crosshair"
                    />
                )}

                <motion.div
                    animate={{ scale: isPlaying ? [1, 1.01, 1] : 1 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="text-center z-10"
                >
                    <div className="text-7xl font-bold tracking-tighter tabular-nums text-foreground drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]">{formatTime(timeLeft)}</div>
                    <div className="text-[10px] text-muted-foreground mt-2 font-black tracking-[0.2em] uppercase opacity-70">Deep Work</div>
                </motion.div>
            </div>

            <div className="flex flex-col items-center gap-8 z-10 w-full">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => handleDurationChange(duration - 5)}
                        className="p-3 rounded-full hover:bg-secondary/10 transition-colors text-muted-foreground hover:text-foreground"
                        disabled={isPlaying}
                        title="-5 Minutes"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    <button onClick={resetTimer} className="p-4 rounded-full bg-secondary/10 border border-border hover:bg-secondary/20 text-muted-foreground hover:text-foreground transition-colors">
                        <RefreshCw className="w-6 h-6" />
                    </button>

                    <button
                        onClick={toggleTimer}
                        className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-105 transition-all shadow-[0_0_20px_rgba(var(--primary-rgb),0.4)] hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.6)] relative z-10 group"
                    >
                        {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                    </button>

                    <button
                        onClick={() => handleDurationChange(duration + 5)}
                        className="p-3 rounded-full hover:bg-secondary/10 transition-all text-muted-foreground hover:text-foreground"
                        disabled={isPlaying}
                        title="+5 Minutes"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>

                {/* Boost Button - Relocated and Highly Styled */}
                <AnimatePresence>
                    {isPlaying && (
                        <motion.button
                            initial={{ y: 20, opacity: 0, scale: 0.9 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 20, opacity: 0, scale: 0.9 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleBoost();
                            }}
                            className="relative group overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary opacity-20 group-hover:opacity-100 transition-opacity blur-xl rounded-2xl scale-110"></div>
                            <div className="relative bg-[#0a0a0b]/80 backdrop-blur-xl border border-white/10 px-8 py-3 rounded-2xl flex items-center gap-3 transition-all group-hover:border-primary/50 group-hover:translate-y-[-2px] group-active:translate-y-[0px] shadow-2xl">
                                <Zap className="w-4 h-4 text-primary animate-pulse" />
                                <div className="flex flex-col items-start leading-none">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80">Hyper Focus</span>
                                    <span className="text-sm font-bold text-white mt-1">QUICK FINISH (-10 XP)</span>
                                </div>
                                <div className="ml-2 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                    <ChevronRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
                                </div>
                            </div>
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>

            {/* Hint for dragging */}
            {!isPlaying && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.1em]"
                >
                    Drag the circle or click icons to shift
                </motion.p>
            )}

            {/* Task Selector */}
            {recentTasks.length > 0 && !isPlaying && (
                <div className="mt-4 flex flex-wrap justify-center gap-2 max-w-md">
                    {recentTasks.map(task => (
                        <button
                            key={task.id}
                            onClick={() => setSelectedTaskId(task.id)}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all border ${selectedTaskId === task.id ? 'bg-primary/20 border-primary text-primary' : 'bg-secondary/5 border-border text-muted-foreground hover:border-primary/50'}`}
                        >
                            {task.title}
                        </button>
                    ))}
                </div>
            )}

            <p className="mt-8 text-[11px] text-muted-foreground/40 max-w-xs text-center italic">
                "The only way to do great work is to love what you do."
            </p>

            {/* Background decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-[100px] rounded-full pointer-events-none -z-10"></div>
        </div>
    );
}

