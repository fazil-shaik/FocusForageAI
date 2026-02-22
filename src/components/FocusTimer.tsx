"use client";

import { motion } from "framer-motion";
import { Play, Pause, RefreshCw, Zap, BrainCircuit } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { saveFocusSession } from "@/app/(app)/focus/actions";


export function FocusTimer({ userPlan = "free" }: { userPlan?: string }) {
    const isPro = userPlan === "pro";
    const [isPlaying, setIsPlaying] = useState(false);
    const [timeLeft, setTimeLeft] = useState(25 * 60);

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
        setTimeLeft(25 * 60);
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
                <button onClick={resetTimer} className="p-4 rounded-full bg-secondary/10 border border-border hover:bg-secondary/20 text-muted-foreground hover:text-foreground transition-colors">
                    <RefreshCw className="w-6 h-6" />
                </button>
                <button
                    onClick={toggleTimer}
                    className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:scale-105 transition-transform shadow-lg hover:shadow-primary/50"
                >
                    {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                </button>

                {/* Soundscapes Toggle */}
                <button
                    disabled={!isPro}
                    className={`p-4 rounded-full border transition-colors ${isPro ? 'bg-secondary/10 border-border hover:bg-secondary/20 text-muted-foreground hover:text-foreground' : 'bg-muted/50 border-transparent text-muted-foreground/50 cursor-not-allowed'}`}
                    title={isPro ? "Toggle Soundscapes" : "Soundscapes available in Pro"}
                >
                    <Zap className="w-6 h-6" />
                </button>
            </div>

            <p className="mt-8 text-sm text-muted-foreground max-w-sm text-center italic">
                "The only way to do great work is to love what you do." - Steve Jobs
            </p>

            {/* Background decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-[100px] rounded-full pointer-events-none -z-10"></div>
        </div>
    );
}
