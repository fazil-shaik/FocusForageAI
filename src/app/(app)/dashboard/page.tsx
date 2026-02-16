"use client";

import { motion } from "framer-motion";
import { Play, Pause, RefreshCw, Zap, BrainCircuit, Target } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function Dashboard() {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <header className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Good afternoon, Shaik</h1>
                    <p className="text-gray-400 flex items-center gap-2 mt-1">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Focus Score: 85/100 (High)
                    </p>
                </div>
                <div className="flex gap-4">
                    <button className="px-4 py-2 bg-neutral-900 border border-white/10 rounded-lg text-sm text-gray-300 hover:bg-neutral-800 transition-colors">
                        Daily Report
                    </button>
                    <button className="px-4 py-2 bg-white text-black rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors">
                        + New Task
                    </button>
                </div>
            </header>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Focus Timer Card */}
                <div className="lg:col-span-2 glass-card rounded-3xl p-8 relative overflow-hidden flex flex-col items-center justify-center min-h-[400px]">
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 flex items-center gap-2">
                        <BrainCircuit className="w-3 h-3 text-purple-400" /> AI Adaptive Mode
                    </div>

                    <motion.div
                        animate={{ scale: isPlaying ? [1, 1.05, 1] : 1 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="w-64 h-64 rounded-full border-4 border-white/5 flex items-center justify-center relative mb-8"
                    >
                        <div className="absolute inset-0 rounded-full border-4 border-t-purple-500 border-r-pink-500 border-b-transparent border-l-transparent rotate-45"></div>
                        {isPlaying && <div className="absolute inset-0 rounded-full bg-purple-500/5 blur-3xl animate-pulse"></div>}

                        <div className="text-center">
                            <div className="text-7xl font-bold tracking-tighter tabular-nums">25:00</div>
                            <div className="text-sm text-gray-500 mt-2 font-medium tracking-widest uppercase">Deep Work</div>
                        </div>
                    </motion.div>

                    <div className="flex items-center gap-6">
                        <button className="p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 transition-colors">
                            <RefreshCw className="w-6 h-6" />
                        </button>
                        <Link
                            href="/focus"
                            className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                        >
                            {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                        </Link>
                        <button className="p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 transition-colors">
                            <Zap className="w-6 h-6" />
                        </button>
                    </div>

                    <p className="mt-8 text-sm text-gray-500 max-w-sm text-center">
                        "The only way to do great work is to love what you do." - Steve Jobs
                    </p>
                </div>

                {/* Right Column: Stats & Tasks */}
                <div className="space-y-6">

                    {/* AI Insight Card */}
                    <div className="glass-card rounded-2xl p-6 border-l-4 border-l-purple-500">
                        <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                            <BrainCircuit className="w-4 h-4 text-purple-500" /> AI Insight
                        </h3>
                        <p className="text-sm leading-relaxed">
                            You tend to lose focus around <span className="text-white font-bold">3:00 PM</span>. I've scheduled a high-dopamine break for 2:50 PM.
                        </p>
                    </div>

                    {/* Task List Preview */}
                    <div className="glass-card rounded-2xl p-6 flex-1">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Target className="w-5 h-5 text-pink-500" /> Up Next
                        </h3>
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="group p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 transition-all cursor-pointer flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full border-2 border-gray-600 group-hover:border-purple-500 transition-colors"></div>
                                    <div>
                                        <p className="text-sm font-medium group-hover:text-white transition-colors">Implement Auth Flow</p>
                                        <p className="text-xs text-gray-500">High Priority • 45m</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-4 py-2 text-xs font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest">
                            View All Tasks
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
