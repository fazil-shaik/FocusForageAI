"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, Target, Zap, Clock, TrendingUp, Brain, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getDailyReportData } from "@/app/(app)/dashboard/report";
import Link from "next/link";

interface DailyReportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function DailyReportModal({ isOpen, onClose }: DailyReportModalProps) {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            getDailyReportData().then(reportData => {
                setData(reportData);
                setLoading(false);
            });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-background/80 backdrop-blur-md"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-2xl bg-card border border-border shadow-2xl rounded-[2.5rem] overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-8 border-b border-border flex items-center justify-between bg-secondary/5">
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-primary/10 rounded-2xl">
                                <Trophy className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-foreground tracking-tight">Daily Performance</h2>
                                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-secondary/10 rounded-full transition-colors">
                            <X className="w-5 h-5 text-muted-foreground" />
                        </button>
                    </div>

                    <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
                        {loading ? (
                            <div className="py-20 text-center space-y-4">
                                <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
                                <p className="text-muted-foreground font-medium">Analyzing neural activity...</p>
                            </div>
                        ) : data?.error === "limit_reached" ? (
                            <div className="py-12 text-center space-y-8">
                                <div className="w-24 h-24 bg-primary/20 text-primary rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner">
                                    <Zap className="w-12 h-12 fill-current" />
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-3xl font-black text-foreground tracking-tight">Daily Limit Reached</h3>
                                    <p className="text-muted-foreground text-sm max-w-xs mx-auto leading-relaxed font-medium">
                                        You've already generated your focus report for today ({data.limit}/{data.limit} requests used).
                                    </p>
                                </div>
                                {data.plan === "free" && (
                                    <Link href="/pricing" className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-black rounded-2xl hover:scale-105 transition-all shadow-xl shadow-primary/30 active:scale-95">
                                        Upgrade to Pro for 3 Reports/Day ⚡
                                    </Link>
                                )}
                            </div>
                        ) : (
                            <>
                                {/* Key Metrics Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <MetricBox
                                        icon={<Clock className="w-5 h-5 text-blue-400" />}
                                        label="Deep Work"
                                        value={`${data?.totalMinutes || 0}m`}
                                        subValue={`${data?.sessionCount || 0} sessions`}
                                    />
                                    <MetricBox
                                        icon={<Target className="w-5 h-5 text-accent" />}
                                        label="Tasks Finished"
                                        value={(data?.tasks?.length || 0).toString()}
                                        subValue="Completed today"
                                    />
                                    <MetricBox
                                        icon={<Zap className="w-5 h-5 text-primary" />}
                                        label="XP Gained"
                                        value={`+${data?.xpEarnedToday || 0}`}
                                        subValue="Productivity score"
                                    />
                                </div>

                                {/* AI Reflection */}
                                <div className="bg-primary/5 rounded-[2rem] p-8 border border-primary/10 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <Brain className="w-16 h-16" />
                                    </div>
                                    <h3 className="text-[10px] font-black text-primary mb-4 flex items-center gap-2 uppercase tracking-[0.2em]">
                                        <Brain className="w-4 h-4" /> AI Reflection
                                    </h3>
                                    <p className="text-xl font-bold text-foreground leading-relaxed">
                                        {data?.totalMinutes > 60
                                            ? "You've had a highly productive day in deep flow. Your concentration levels are peaking."
                                            : data?.totalMinutes > 0
                                                ? "A solid start. You've built some momentum today, keep it up to reach your goals."
                                                : "A quiet day so far. Sometimes rest is as important as work, but consider a short session to get back in the rhythm."}
                                    </p>
                                </div>

                                {/* Detailed Lists */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Focus Sessions */}
                                    <div>
                                        <h4 className="text-[10px] font-black text-muted-foreground mb-6 uppercase tracking-[0.2em]">Focus Flow</h4>
                                        <div className="space-y-4">
                                            {data?.sessions && data.sessions.length > 0 ? (
                                                data.sessions.map((s: any) => (
                                                    <div key={s.id} className="flex items-center justify-between p-5 rounded-2xl bg-secondary/5 border border-white/5 hover:border-primary/20 transition-all group">
                                                        <div>
                                                            <p className="font-bold text-sm text-foreground">{s.taskName}</p>
                                                            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{s.time}</p>
                                                        </div>
                                                        <span className="text-xs font-black text-primary bg-primary/10 px-4 py-1.5 rounded-xl border border-primary/20">{s.duration}m</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-sm text-muted-foreground italic font-medium">No sessions completed today.</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Completed Tasks */}
                                    <div>
                                        <h4 className="text-[10px] font-black text-muted-foreground mb-6 uppercase tracking-[0.2em]">Victory List</h4>
                                        <div className="space-y-4">
                                            {data?.tasks && data.tasks.length > 0 ? (
                                                data.tasks.map((t: any) => (
                                                    <div key={t.id} className="flex items-center gap-4 p-5 rounded-2xl bg-green-500/5 border border-green-500/10">
                                                        <div className="p-2 bg-green-500/20 rounded-xl">
                                                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                        </div>
                                                        <p className="font-bold text-sm text-foreground">{t.title}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-sm text-muted-foreground italic font-medium">No tasks completed yet today.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-8 border-t border-border bg-secondary/5 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-8 py-3 bg-primary text-primary-foreground font-black rounded-2xl hover:opacity-90 transition-all shadow-lg active:scale-95"
                        >
                            Confirm
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

function MetricBox({ icon, label, value, subValue }: { icon: React.ReactNode, label: string, value: string, subValue: string }) {
    return (
        <div className="bg-card border border-border p-6 rounded-[2rem] shadow-sm hover:border-primary/20 transition-all group">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-secondary/10 rounded-xl group-hover:scale-110 transition-transform">{icon}</div>
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{label}</span>
            </div>
            <div className="text-3xl font-black text-foreground tracking-tight">{value}</div>
            <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.1em]">{subValue}</div>
        </div>
    );
}
