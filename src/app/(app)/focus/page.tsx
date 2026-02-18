"use client";

import { useState, useEffect } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Brain, CheckCircle, Volume2, Maximize2, X, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { saveFocusSession } from "./actions";


export default function FocusSession() {
    const [step, setStep] = useState<"checkin" | "timer" | "summary">("checkin");
    const [mood, setMood] = useState("");
    const [duration, setDuration] = useState(25);
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [distractions, setDistractions] = useState(0);
    const [xpEarned, setXpEarned] = useState(0);
    const [isSaving, setIsSaving] = useState(false);

    // Distraction Tracking
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && isActive) {
                setDistractions((prev) => prev + 1);
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, [isActive]);

    // Timer Logic
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

    const handleMoodSelect = (selectedMood: string) => {
        setMood(selectedMood);
        if (selectedMood === "Tired") setDuration(15);
        if (selectedMood === "Anxious") setDuration(20);
        if (selectedMood === "Flow") setDuration(50);
        if (selectedMood === "Neutral") setDuration(25);
    };

    const startSession = () => {
        setTimeLeft(duration * 60);
        setStep("timer");
        setIsActive(true);
        setDistractions(0);
    };

    const finishSession = async () => {
        setIsActive(false);
        setIsSaving(true);
        try {
            const actualDuration = duration - Math.floor(timeLeft / 60); // In case they stop early? 
            // Currently finishes when time is 0, so duration is full duration.
            // If manual stop, we might want to calculate partial. 
            // But let's assume full completion for "finishSession" triggered by timer.

            const result = await saveFocusSession({
                duration: duration,
                moodStart: mood,
                distractionCount: distractions,
                taskName: "Focus Mode Session"
            });
            setXpEarned(result.xpEarned);
            setStep("summary");
        } catch (error) {
            console.error("Failed to save session", error);
        } finally {
            setIsSaving(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="h-[calc(100vh-80px)] flex flex-col items-center justify-center relative overflow-hidden rounded-3xl bg-card border border-border shadow-2xl">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 pointer-events-none"></div>

            <AnimatePresence mode="wait">
                {step === "checkin" && (
                    <motion.div
                        key="checkin"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="text-center max-w-md p-8"
                    >
                        <Brain className="w-16 h-16 mx-auto text-primary mb-6" />
                        <h2 className="text-3xl font-bold mb-2 text-foreground">Mental State Check-in</h2>
                        <p className="text-muted-foreground mb-8">How are you feeling right now? AI will adjust the session intensity.</p>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            {["Tired", "Anxious", "Neutral", "Flow"].map((m) => (
                                <button
                                    key={m}
                                    onClick={() => handleMoodSelect(m)}
                                    className={`p-4 rounded-xl border transition-all font-medium ${mood === m ? 'bg-primary border-primary text-primary-foreground shadow-lg' : 'bg-secondary/5 border-border hover:bg-secondary/10 text-muted-foreground hover:text-foreground'}`}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>

                        {mood && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <div className="mb-8 p-4 bg-secondary/5 rounded-xl border border-border">
                                    <p className="text-sm text-muted-foreground font-bold">Recommended Session</p>
                                    <div className="text-2xl font-bold text-foreground">{duration} Minutes</div>
                                    <p className="text-xs text-primary mt-1 font-bold">{mood === "Flow" ? "Deep Work Mode" : "Refresh Mode"}</p>
                                </div>
                                <button onClick={startSession} className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-full hover:scale-105 transition-transform shadow-lg">
                                    Start Session
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                )}

                {step === "timer" && (
                    <motion.div
                        key="timer"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center w-full h-full flex flex-col items-center justify-center relative"
                    >
                        {/* Ambient Background */}
                        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background pointer-events-none"></div>

                        <h2 className="text-muted-foreground font-bold tracking-widest uppercase mb-8">Focus Mode Active</h2>

                        <div className="text-[12rem] font-bold leading-none tracking-tighter tabular-nums text-foreground">
                            {formatTime(timeLeft)}
                        </div>

                        {distractions > 0 && (
                            <div className="absolute top-8 right-8 flex items-center gap-2 text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-500/10 px-4 py-2 rounded-full border border-yellow-200 dark:border-yellow-500/20 animate-pulse">
                                <AlertTriangle className="w-4 h-4" />
                                <span className="text-sm font-bold">{distractions} Distractions</span>
                            </div>
                        )}

                        <div className="flex items-center gap-6 mt-12 relative z-10">
                            <button onClick={() => setIsActive(!isActive)} className="p-6 rounded-full bg-secondary/10 border border-border hover:bg-secondary/20 text-foreground transition-all">
                                {isActive ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                            </button>
                            <button onClick={() => setStep("summary")} className="p-6 rounded-full bg-red-100 border border-red-200 hover:bg-red-200 text-red-600 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400 transition-all">
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
                        className="text-center max-w-md p-8"
                    >
                        <CheckCircle className="w-20 h-20 mx-auto text-green-500 mb-6" />
                        <h2 className="text-3xl font-bold mb-2 text-foreground">Session Complete!</h2>
                        <p className="text-muted-foreground mb-4">You completed {duration} minutes of deep work.</p>

                        <div className="bg-gradient-to-r from-primary/20 to-accent/20 p-6 rounded-2xl border border-primary/20 mb-8">
                            <p className="text-sm text-primary font-bold mb-1">XP Earned</p>
                            <div className="text-4xl font-bold text-foreground">+{xpEarned} XP</div>
                            {distractions > 0 && <p className="text-xs text-red-500 mt-2 font-bold">-{distractions * 5} XP penalty for distractions</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => setStep("checkin")} className="py-3 rounded-xl bg-secondary/10 border border-border hover:bg-secondary/20 text-foreground transition-colors font-medium">
                                New Session
                            </button>
                            <Link href="/dashboard" className="py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-colors flex items-center justify-center shadow-md">
                                Dashboard
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
