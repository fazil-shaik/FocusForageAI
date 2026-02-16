"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Brain, CheckCircle, Volume2, Maximize2, X } from "lucide-react";
import Link from "next/link";

export default function FocusSession() {
    const [step, setStep] = useState<"checkin" | "timer" | "summary">("checkin");
    const [mood, setMood] = useState("");
    const [duration, setDuration] = useState(25);
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);

    // Timer Logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            setStep("summary");
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const handleMoodSelect = (selectedMood: string) => {
        setMood(selectedMood);
        // AI Logic Simulation
        if (selectedMood === "Tired") setDuration(15);
        if (selectedMood === "Anxious") setDuration(20);
        if (selectedMood === "Flow") setDuration(50);
        if (selectedMood === "Neutral") setDuration(25);
    };

    const startSession = () => {
        setTimeLeft(duration * 60);
        setStep("timer");
        setIsActive(true);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="h-[calc(100vh-80px)] flex flex-col items-center justify-center relative overflow-hidden rounded-3xl bg-black border border-white/5">
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
                        <Brain className="w-16 h-16 mx-auto text-purple-500 mb-6" />
                        <h2 className="text-3xl font-bold mb-2">Mental State Check-in</h2>
                        <p className="text-gray-400 mb-8">How are you feeling right now? AI will adjust the session intensity.</p>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            {["Tired", "Anxious", "Neutral", "Flow"].map((m) => (
                                <button
                                    key={m}
                                    onClick={() => handleMoodSelect(m)}
                                    className={`p-4 rounded-xl border transition-all ${mood === m ? 'bg-purple-500 border-purple-500 text-white' : 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-300'}`}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>

                        {mood && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <div className="mb-8 p-4 bg-white/5 rounded-xl border border-white/10">
                                    <p className="text-sm text-gray-400">Recommended Session</p>
                                    <div className="text-2xl font-bold">{duration} Minutes</div>
                                    <p className="text-xs text-purple-400 mt-1">{mood === "Flow" ? "Deep Work Mode" : "Refresh Mode"}</p>
                                </div>
                                <button onClick={startSession} className="w-full py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform">
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
                        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-black pointer-events-none"></div>

                        <h2 className="text-gray-500 font-medium tracking-widest uppercase mb-8">Focus Mode Active</h2>

                        <div className="text-[12rem] font-bold leading-none tracking-tighter tabular-nums bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-600">
                            {formatTime(timeLeft)}
                        </div>

                        <div className="flex items-center gap-6 mt-12 relative z-10">
                            <button onClick={() => setIsActive(!isActive)} className="p-6 rounded-full bg-white/5 border border-white/10 hover:bg-white/20 transition-all">
                                {isActive ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                            </button>
                            <button onClick={() => setStep("summary")} className="p-6 rounded-full bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 transition-all">
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
                        <h2 className="text-3xl font-bold mb-2">Session Complete!</h2>
                        <p className="text-gray-400 mb-8">You completed {duration - Math.floor(timeLeft / 60)} minutes of deep work.</p>

                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => setStep("checkin")} className="py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                New Session
                            </button>
                            <Link href="/dashboard" className="py-3 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-colors flex items-center justify-center">
                                Dashboard
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
