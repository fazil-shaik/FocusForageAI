"use client";

export const dynamic = "force-dynamic";

import { motion, AnimatePresence } from "framer-motion";
import { Brain, Sparkles, Zap, Activity, Cpu, Binary, Fingerprint, Globe, ShieldCheck } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";

export default function FocusComingSoon() {
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setScanned(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-[calc(100vh-100px)] w-full relative flex items-center justify-center p-4 overflow-hidden bg-[#020202]">
            {/* --- ADVANCED MESH BACKGROUND --- */}
            <div className="absolute inset-0 z-0">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [-100, 100, -100],
                        y: [-50, 50, -50],
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-primary/20 blur-[150px] rounded-full opacity-40"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        x: [100, -100, 100],
                        y: [50, -50, 50],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-accent/20 blur-[130px] rounded-full opacity-30"
                />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
            </div>

            {/* --- FLOATING DECORATIVE NODES --- */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                            opacity: [0, 0.4, 0],
                            scale: [0, 1, 0.5],
                            x: Math.random() * 1000 - 500,
                            y: Math.random() * 1000 - 500,
                        }}
                        transition={{
                            duration: 10 + Math.random() * 10,
                            repeat: Infinity,
                            delay: i * 0.5
                        }}
                        className="absolute left-1/2 top-1/2 w-1.5 h-1.5 bg-primary rounded-full blur-[2px]"
                    />
                ))}
            </div>

            {/* --- MAIN CONTENT CARD --- */}
            <AnimatePresence mode="wait">
                {!scanned ? (
                    <motion.div
                        key="scanning"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        className="relative z-10 flex flex-col items-center gap-8"
                    >
                        <div className="relative">
                            <Binary className="w-20 h-20 text-primary animate-pulse" />
                            <motion.div
                                animate={{ top: ["0%", "100%", "0%"] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="absolute left-0 right-0 h-[2px] bg-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.8)] z-20"
                            />
                        </div>
                        <div className="text-center">
                            <h2 className="text-2xl font-black text-foreground tracking-[0.5em] uppercase mb-2">Syncing Neural Core</h2>
                            <p className="text-muted-foreground font-mono text-xs opacity-50 uppercase tracking-widest">Accessing encrypted focus modules...</p>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="content"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="relative z-10 w-full max-w-4xl"
                    >
                        {/* THE BIG "SOMETHING CRAZY" CONTAINER */}
                        <div className="relative bg-card/40 backdrop-blur-3xl border border-white/10 rounded-[4rem] p-12 lg:p-20 shadow-[0_0_100px_-20px_rgba(0,0,0,0.8)] overflow-hidden">
                            {/* Inner Decorative Elements */}
                            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                                <Cpu className="w-64 h-64" />
                            </div>

                            <div className="flex flex-col items-center text-center">
                                {/* Badge */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex items-center gap-3 px-6 py-2 bg-primary/10 border border-primary/20 rounded-full mb-10"
                                >
                                    <Zap className="w-4 h-4 text-primary fill-primary/20" />
                                    <span className="text-[11px] font-black text-primary uppercase tracking-[0.3em]">Phase 2 Upgrade Initialized</span>
                                </motion.div>

                                {/* Title */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="relative mb-8"
                                >
                                    <h1 className="text-6xl lg:text-8xl font-black text-white tracking-tighter leading-tight">
                                        Something <br />
                                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary animate-gradient-x">Crazy</span> is Coming.
                                    </h1>
                                    <div className="absolute -top-4 -right-8">
                                        <Sparkles className="w-12 h-12 text-accent animate-bounce" />
                                    </div>
                                </motion.div>

                                {/* Description */}
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="text-xl lg:text-2xl text-muted-foreground max-w-2xl font-medium leading-relaxed mb-16"
                                >
                                    We are recalibrating the cognitive architecture. The next generation of flow-state tracking is being forged in the lab.
                                </motion.p>

                                {/* Stats Prototype Grid */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 }}
                                    className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-16"
                                >
                                    <FeaturePreview icon={<Activity />} label="Real-time Neural Feedback" />
                                    <FeaturePreview icon={<Brain />} label="AI Intuition Engine" />
                                    <FeaturePreview icon={<Fingerprint />} label="Biometric Flow Keys" />
                                    <FeaturePreview icon={<Globe />} label="Global Focus Lattice" />
                                </motion.div>

                                {/* CTA / Info */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1 }}
                                    className="flex flex-col items-center gap-6"
                                >
                                    <div className="flex items-center gap-6 text-muted-foreground/40 font-black text-[10px] tracking-[0.5em] uppercase">
                                        <span>Status: Evolving</span>
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                                        <span>ETA: Imminent</span>
                                    </div>

                                    <Link href="/dashboard" className="group flex items-center gap-3 text-white font-bold px-10 py-5 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 hover:border-primary/50 transition-all hover:scale-105">
                                        Return to Base Dashboard
                                        <Activity className="w-4 h-4 text-primary group-hover:rotate-45 transition-transform" />
                                    </Link>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Background Styles */}
            <style jsx global>{`
                @keyframes gradient-x {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .animate-gradient-x {
                    background-size: 200% 200%;
                    animation: gradient-x 5s ease infinite;
                }
            `}</style>
        </div>
    );
}

function FeaturePreview({ icon, label }: { icon: React.ReactNode, label: string }) {
    return (
        <div className="p-6 rounded-[2rem] bg-white/5 border border-white/5 flex flex-col items-center gap-3 group hover:border-primary/20 transition-all">
            <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:scale-110 transition-transform">
                {React.cloneElement(icon as React.ReactElement, { size: 24, strokeWidth: 2.5 })}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 text-center leading-tight">
                {label}
            </span>
        </div>
    );
}
