"use client";

import { motion } from "framer-motion";
import { Play, Pause, RefreshCw, Zap, BrainCircuit } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { saveFocusSession } from "@/app/(app)/focus/actions";


export function FocusTimer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [timeLeft, setTimeLeft] = useState(25 * 60);

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
        <div className="lg:col-span-2 glass-card rounded-3xl p-8 relative overflow-hidden flex flex-col items-center justify-center min-h-[400px] bg-zinc-900/50 border border-white/10 backdrop-blur-md">
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 flex items-center gap-2">
                <BrainCircuit className="w-3 h-3 text-purple-400" /> AI Adaptive Mode
            </div>

            <motion.div
                animate={{ scale: isPlaying ? [1, 1.05, 1] : 1 }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-64 h-64 rounded-full border-4 border-white/5 flex items-center justify-center relative mb-8"
            >
                <div className={`absolute inset-0 rounded-full border-4 border-t-purple-500 border-r-pink-500 border-b-transparent border-l-transparent rotate-45 transition-all duration-1000 ${isPlaying ? 'animate-spin-slow' : ''}`}></div>
                {isPlaying && <div className="absolute inset-0 rounded-full bg-purple-500/5 blur-3xl animate-pulse"></div>}

                <div className="text-center z-10">
                    <div className="text-7xl font-bold tracking-tighter tabular-nums text-white">{formatTime(timeLeft)}</div>
                    <div className="text-sm text-gray-500 mt-2 font-medium tracking-widest uppercase">Deep Work</div>
                </div>
            </motion.div>

            <div className="flex items-center gap-6 z-10">
                <button onClick={resetTimer} className="p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 transition-colors">
                    <RefreshCw className="w-6 h-6" />
                </button>
                <button
                    onClick={toggleTimer}
                    className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                >
                    {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                </button>
                <button className="p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 transition-colors">
                    <Zap className="w-6 h-6" />
                </button>
            </div>

            <p className="mt-8 text-sm text-gray-500 max-w-sm text-center italic">
                "The only way to do great work is to love what you do." - Steve Jobs
            </p>

            {/* Background decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>
        </div>
    );
}
