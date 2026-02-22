"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RefreshCw, Zap, BrainCircuit, ChevronLeft, ChevronRight, Brain } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { saveFocusSession } from "@/app/(app)/focus/actions";


import { tasks } from "@/db/schema";

type Task = typeof tasks.$inferSelect;

export function FocusTimer({ userPlan = "free", recentTasks = [] }: { userPlan?: string; recentTasks?: Task[] }) {
    const isPro = userPlan === "pro";
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(25);
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(recentTasks[0]?.id || null);
    const [isSaving, setIsSaving] = useState(false);

    const [lastAwayTime, setLastAwayTime] = useState<number | null>(null);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && isPlaying) {
                setLastAwayTime(Date.now());
            } else if (!document.hidden && isPlaying && lastAwayTime) {
                const duration = (Date.now() - lastAwayTime) / 1000;
                if (duration > 5) {
                    // In dashboard, we just pause for simplicity vs a full modal
                    setIsPlaying(false);
                }
                setLastAwayTime(null);
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, [isPlaying, lastAwayTime]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isPlaying) {
            setIsPlaying(false);
            // Auto-save session
            saveFocusSession({
                duration: 25, // Default for now, could be dynamic
                taskName: "Dashboard Timer Session"
            }).then(() => {
                // Could show toast here
                console.log("Session saved");
            });
        }
        return () => clearInterval(interval);
    }, [isPlaying, timeLeft]);


    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const toggleTimer = () => setIsPlaying(!isPlaying);
    const resetTimer = () => {
        setIsPlaying(false);
        setTimeLeft(duration * 60);
    };

    const handleDurationChange = (newVal: number) => {
        if (isPlaying) return;
        const clamped = Math.max(1, Math.min(newVal, 120));
        setDuration(clamped);
        setTimeLeft(clamped * 60);
    };

    const handleBoost = async () => {
        if (isSaving) return;
        setIsSaving(true);
        setIsPlaying(false);

        const currentTask = recentTasks.find(t => t.id === selectedTaskId);

        try {
            await saveFocusSession({
                duration: duration - Math.floor(timeLeft / 60),
                taskName: currentTask?.title || "Boosted Session",
                isBoosted: true,
                taskId: selectedTaskId || undefined,
                taskStatus: "in_progress"
            });
            // Show some visual feedback/toast? 
            setTimeLeft(0);
        } catch (error) {
            console.error("Boost failed", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="lg:col-span-2 bg-card/50 rounded-3xl p-8 relative overflow-hidden flex flex-col items-center justify-center min-h-[400px] border border-border backdrop-blur-md shadow-sm">
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

            <motion.div
                animate={{ scale: isPlaying ? [1, 1.05, 1] : 1 }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-64 h-64 rounded-full border-4 border-muted/20 flex items-center justify-center relative mb-8"
            >
                <div className={`absolute inset-0 rounded-full border-4 border-t-primary border-r-accent border-b-transparent border-l-transparent rotate-45 transition-all duration-1000 ${isPlaying ? 'animate-spin-slow' : ''}`}></div>
                {isPlaying && <div className="absolute inset-0 rounded-full bg-primary/20 blur-3xl animate-pulse"></div>}

                <div className="text-center z-10">
                    <div className="text-7xl font-bold tracking-tighter tabular-nums text-foreground">{formatTime(timeLeft)}</div>
                    <div className="text-sm text-muted-foreground mt-2 font-medium tracking-widest uppercase">Deep Work</div>
                </div>
            </motion.div>

            <div className="flex items-center gap-6 z-10">
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

                <div className="relative">
                    <button
                        onClick={toggleTimer}
                        className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-105 transition-transform shadow-lg hover:shadow-primary/50 relative z-10"
                    >
                        {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                    </button>

                    {/* Boost Button Overlay - Styled more creatively */}
                    <AnimatePresence>
                        {isPlaying && (
                            <motion.button
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: -60, opacity: 1 }}
                                exit={{ y: 20, opacity: 0 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleBoost();
                                }}
                                className="absolute left-1/2 -translate-x-1/2 bg-accent text-accent-foreground px-6 py-2 rounded-full text-[11px] font-black shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center gap-2 border-2 border-white/20 whitespace-nowrap z-0 group"
                            >
                                <Zap className="w-3.5 h-3.5 fill-current animate-pulse group-hover:animate-bounce" />
                                BOOST SKIP (-10 XP)
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>

                <button
                    onClick={() => handleDurationChange(duration + 5)}
                    className="p-3 rounded-full hover:bg-secondary/10 transition-all text-muted-foreground hover:text-foreground"
                    disabled={isPlaying}
                    title="+5 Minutes"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>

            {/* Interactive Timer Shift (Handy Slider) */}
            {!isPlaying && (
                <div className="mt-8 w-full max-w-xs space-y-4">
                    <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">
                        <span>1m</span>
                        <span>Shift Duration</span>
                        <span>120m</span>
                    </div>
                    <div className="relative h-2 bg-secondary/20 rounded-full group cursor-pointer">
                        <input
                            type="range"
                            min="1"
                            max="120"
                            value={duration}
                            onChange={(e) => handleDurationChange(parseInt(e.target.value))}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <motion.div
                            className="absolute left-0 top-0 h-full bg-primary rounded-full"
                            style={{ width: `${(duration / 120) * 100}%` }}
                        />
                        <motion.div
                            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-primary shadow-md"
                            style={{ left: `calc(${(duration / 120) * 100}% - 8px)` }}
                        />
                    </div>
                </div>
            )}

            {/* Task Selector */}
            {recentTasks.length > 0 && !isPlaying && (
                <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-md">
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

            <p className="mt-8 text-sm text-muted-foreground max-w-sm text-center italic">
                "The only way to do great work is to love what you do." - Steve Jobs
            </p>

            {/* Background decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-[100px] rounded-full pointer-events-none -z-10"></div>
        </div>
    );
}
