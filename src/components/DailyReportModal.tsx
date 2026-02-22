"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, Target, Zap, Clock, TrendingUp, Brain, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getDailyReportData } from "@/app/(app)/dashboard/report";

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
                    className="relative w-full max-w-2xl bg-card border border-border shadow-2xl rounded-3xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/5">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-xl">
                                <Trophy className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-foreground">Daily Performance Report</h2>
                                <p className="text-xs text-muted-foreground">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
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
                                <p className="text-muted-foreground font-medium">Analyzing your day...</p>
                            </div>
                        ) : (
                            <>
                                {/* Key Metrics Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <MetricBox
                                        icon={<Clock className="w-5 h-5 text-blue-400" />}
                                        label="Deep Work"
                                        value={`${data.totalMinutes}m`}
                                        subValue={`${data.sessionCount} sessions`}
                                    />
                                    <MetricBox
                                        icon={<Target className="w-5 h-5 text-accent" />}
                                        label="Tasks Finished"
                                        value={data.tasks.length.toString()}
                                        subValue="Completed today"
                                    />
                                    <MetricBox
                                        icon={<Zap className="w-5 h-5 text-primary" />}
                                        label="XP Gained"
                                        value={`+${data.xpEarnedToday}`}
                                        subValue="Productivity score"
                                    />
                                </div>

                                {/* AI Reflection */}
                                <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <Brain className="w-12 h-12" />
                                    </div>
                                    <h3 className="text-sm font-bold text-primary mb-2 flex items-center gap-2">
                                        <Brain className="w-4 h-4" /> AI Reflection
                                    </h3>
                                    <p className="text-lg font-medium text-foreground leading-relaxed">
                                        {data.totalMinutes > 60
                                            ? "You've had a highly productive day in deep flow. Your concentration levels are peaking."
                                            : data.totalMinutes > 0
                                                ? "A solid start. You've built some momentum today, keep it up to reach your goals."
                                                : "A quiet day so far. Sometimes rest is as important as work, but consider a short session to get back in the rhythm."}
                                    </p>
                                </div>

                                {/* Detailed Lists */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Focus Sessions */}
                                    <div>
                                        <h4 className="text-sm font-bold text-muted-foreground mb-4 uppercase tracking-widest">Focus Flow</h4>
                                        <div className="space-y-3">
                                            {data.sessions.length > 0 ? (
                                                data.sessions.map((s: any) => (
                                                    <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/5 border border-transparent hover:border-border transition-all">
                                                        <div>
                                                            <p className="font-bold text-sm text-foreground">{s.taskName}</p>
                                                            <p className="text-[10px] text-muted-foreground">{s.time}</p>
                                                        </div>
                                                        <span className="text-xs font-mono font-bold text-primary">{s.duration}m</span>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-sm text-muted-foreground italic">No sessions completed today.</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Completed Tasks */}
                                    <div>
                                        <h4 className="text-sm font-bold text-muted-foreground mb-4 uppercase tracking-widest">Victory List</h4>
                                        <div className="space-y-3">
                                            {data.tasks.length > 0 ? (
                                                data.tasks.map((t: any) => (
                                                    <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl bg-green-500/5 border border-green-500/10">
                                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                        <p className="font-medium text-sm text-foreground">{t.title}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-sm text-muted-foreground italic">No tasks completed yet today.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-border bg-secondary/5 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-all shadow-md"
                        >
                            Got It
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

function MetricBox({ icon, label, value, subValue }: { icon: React.ReactNode, label: string, value: string, subValue: string }) {
    return (
        <div className="bg-card border border-border p-4 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 mb-2">
                {icon}
                <span className="text-xs font-bold text-muted-foreground uppercase">{label}</span>
            </div>
            <div className="text-2xl font-bold text-foreground">{value}</div>
            <div className="text-[10px] text-muted-foreground">{subValue}</div>
        </div>
    );
}
