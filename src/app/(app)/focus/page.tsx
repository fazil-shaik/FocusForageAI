"use client";

import { useState, useEffect } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Brain, CheckCircle, Volume2, Maximize2, X, AlertTriangle, Activity } from "lucide-react";
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
    const [isPermissionsGranted, setIsPermissionsGranted] = useState(false);
    const [showMindfulReturn, setShowMindfulReturn] = useState(false);
    const [awayDuration, setAwayDuration] = useState(0);
    const [lastAwayTime, setLastAwayTime] = useState<number | null>(null);
    const [sessionGoal, setSessionGoal] = useState("");

    // Distraction Tracking
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && isActive) {
                setLastAwayTime(Date.now());
            } else if (!document.hidden && isActive && lastAwayTime) {
                const duration = (Date.now() - lastAwayTime) / 1000;
                if (duration > 5) { // 5 second grace period
                    setAwayDuration(Math.round(duration));
                    setShowMindfulReturn(true);
                    setIsActive(false); // Pause timer while they explain
                }
                setLastAwayTime(null);
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, [isActive, lastAwayTime]);

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
        if (selectedMood === "Tired") setDuration(2);
        if (selectedMood === "Anxious") setDuration(20);
        if (selectedMood === "Flow") setDuration(50);
        if (selectedMood === "Neutral") setDuration(25);
    };

    const startSession = () => {
        if (!sessionGoal.trim()) {
            alert("Please set a goal for this session to stay focused!");
            return;
        }
        setTimeLeft(duration * 60);
        setStep("timer");
        setIsActive(true);
        setDistractions(0);

        // Request notification permission if advanced check is enabled
        if (isPermissionsGranted && "Notification" in window) {
            Notification.requestPermission();
        }
    };

    // Focus Ping Logic
    useEffect(() => {
        let pingInterval: NodeJS.Timeout;
        if (isActive && isPermissionsGranted && "Notification" in window && Notification.permission === "granted") {
            pingInterval = setInterval(() => {
                if (document.hidden) {
                    new Notification("Focus Check! 🧠", {
                        body: `Still working on: ${sessionGoal}? Keep it up!`,
                        icon: "/brain-icon.png" // Fallback if no icon
                    });
                }
            }, 5 * 60 * 1000); // Ping every 5 minutes if tab is hidden
        }
        return () => clearInterval(pingInterval);
    }, [isActive, isPermissionsGranted, sessionGoal]);

    const finishSession = async () => {
        setIsActive(false);
        setIsSaving(true);
        try {
            const result = await saveFocusSession({
                duration: duration,
                moodStart: mood,
                distractionCount: distractions,
                taskName: sessionGoal || "Focus Mode Session"
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
                                <div className="mb-8">
                                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block text-left">Your Session Goal</label>
                                    <input
                                        type="text"
                                        value={sessionGoal}
                                        onChange={(e) => setSessionGoal(e.target.value)}
                                        placeholder="e.g., Coding Authentication Flow"
                                        className="w-full p-4 rounded-xl bg-secondary/5 border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-medium text-foreground"
                                    />
                                </div>

                                <button onClick={startSession} className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-full hover:scale-105 transition-transform shadow-lg">
                                    Start Session
                                </button>

                                <div className="mt-6 p-4 rounded-xl border border-border bg-secondary/5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${isPermissionsGranted ? 'bg-green-500/10 text-green-500' : 'bg-muted text-muted-foreground'}`}>
                                            <Activity className="w-4 h-4" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs font-bold text-foreground">Advanced Activity Check</p>
                                            <p className="text-[10px] text-muted-foreground">Require permissions for focus monitoring</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsPermissionsGranted(!isPermissionsGranted)}
                                        className={`w-10 h-6 rounded-full transition-colors relative ${isPermissionsGranted ? 'bg-primary' : 'bg-muted'}`}
                                    >
                                        <motion.div
                                            animate={{ x: isPermissionsGranted ? 18 : 2 }}
                                            className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
                                        />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                )}

                {/* Mindful Return Modal */}
                <AnimatePresence>
                    {showMindfulReturn && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-md flex items-center justify-center p-6"
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                className="bg-card border border-border p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center"
                            >
                                <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <Brain className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Accountability Check</h3>
                                <p className="text-muted-foreground text-sm mb-6">
                                    You were away for <span className="text-foreground font-bold">{awayDuration}s</span>.
                                    Was this for <span className="text-primary font-bold">research ({sessionGoal})</span> or a distraction?
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => {
                                            setShowMindfulReturn(false);
                                            setIsActive(true);
                                        }}
                                        className="py-3 rounded-xl bg-secondary/10 border border-border hover:bg-secondary/20 font-bold transition-all flex flex-col items-center justify-center gap-1"
                                    >
                                        <span className="text-sm">Research</span>
                                        <span className="text-[10px] opacity-70">No Penalty</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setDistractions(prev => prev + 1);
                                            setShowMindfulReturn(false);
                                            setIsActive(true);
                                        }}
                                        className="py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all flex flex-col items-center justify-center gap-1 shadow-lg shadow-red-500/20"
                                    >
                                        <span className="text-sm">Distracted</span>
                                        <span className="text-[10px] opacity-90">-5 XP Penalty</span>
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

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
