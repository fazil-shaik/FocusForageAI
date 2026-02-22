"use client";

import { motion } from "framer-motion";
import { Grid, Clock, Zap, Activity, Brain, Sparkles } from "lucide-react";
import Link from "next/link";

type AnalyticsData = {
    dailyStats: any[];
    recentSessions: any[];
    totalDeepWorkHours: number;
    totalSessions: number;
    averageMood: number;
    userPlan?: string;
    behavioralAnalysis?: {
        patterns: string[];
        triggers: string[];
        psychologicalFactor: string;
        strategy: string[];
        riskLevel: string;
    } | null;
};

export function AnalyticsDashboard({ data }: { data: AnalyticsData }) {
    if (!data) return <div className="p-10 text-center">Loading Analytics...</div>;

    const maxMinutes = Math.max(...data.dailyStats.map(s => s.totalDeepWorkMinutes || 0), 1);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-foreground">Neural Stats</h1>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MetricCard
                    title="Total Deep Work"
                    value={`${data.totalDeepWorkHours}h`}
                    icon={<Clock className="w-5 h-5 text-primary" />}
                    trend="+12% vs last week"
                />
                <MetricCard
                    title="Focus Sessions"
                    value={data.totalSessions.toString()}
                    icon={<Zap className="w-5 h-5 text-secondary" />}
                    trend="+5 from yesterday"
                />
                <MetricCard
                    title="Avg Focus Score"
                    value="8.5/10"
                    icon={<Brain className="w-5 h-5 text-blue-400" />}
                    trend="Self-Reported"
                />
                <MetricCard
                    title="Distractions"
                    value={data.dailyStats.reduce((acc, curr) => acc + (curr.distractionCount || 0), 0).toString()}
                    icon={<Activity className="w-5 h-5 text-red-400" />}
                    trend="Last 30 Days"
                />
            </div>

            {/* Main Chart Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-6 backdrop-blur-sm shadow-sm">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-foreground">
                        <Activity className="w-5 h-5 text-primary" />
                        Focus Rhythm (Last 30 Days)
                    </h3>

                    <div className="h-64 flex items-end justify-between gap-1">
                        {data.dailyStats.map((stat, i) => {
                            const heightPercentage = ((stat.totalDeepWorkMinutes || 0) / maxMinutes) * 100;
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative h-full">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${Math.max(heightPercentage, 2)}%` }} // Min 2% height for visibility
                                        transition={{ duration: 0.5, delay: i * 0.02 }}
                                        className={`w-full rounded-t-full transition-colors ${stat.totalDeepWorkMinutes > 0
                                            ? 'bg-gradient-to-t from-primary/50 to-primary hover:from-primary hover:to-accent'
                                            : 'bg-secondary/10'}`} // Gray bar for no data
                                    />
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-popover text-popover-foreground text-xs px-2 py-1 rounded-lg border border-border whitespace-nowrap z-10 pointer-events-none shadow-lg">
                                        {stat.date}: {stat.totalDeepWorkMinutes} min
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                        <span>30 Days Ago</span>
                        <span>Today</span>
                    </div>
                </div>

                {/* Recent Sessions */}
                <div className="bg-card border border-border rounded-3xl p-6 backdrop-blur-sm shadow-sm flex flex-col">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-foreground">
                        <Clock className="w-5 h-5 text-secondary" />
                        Recent Sessions
                    </h3>
                    <div className="flex-1 space-y-4">
                        {data.recentSessions.length === 0 ? (
                            <p className="text-muted-foreground text-sm">No recent sessions recorded.</p>
                        ) : (
                            data.recentSessions.map((session, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-secondary/5 hover:bg-secondary/10 transition-colors border border-transparent hover:border-border">
                                    <div>
                                        <p className="font-bold text-sm text-foreground">{session.taskName}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {session.startTime ? new Date(session.startTime).toLocaleDateString() : 'Unknown Date'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-mono text-sm text-primary">{session.duration || 0}m</p>
                                        <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${session.status === 'completed' ? 'bg-green-500/10 text-green-600' : 'bg-yellow-500/10 text-yellow-600'}`}>
                                            {session.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Behavioral Analysis (Pro Feature) */}
            <div className="bg-card border border-border rounded-3xl p-8 backdrop-blur-sm shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-accent/10 rounded-2xl">
                            <Brain className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-foreground tracking-tight">Behavioral Analysis</h3>
                            <p className="text-sm text-muted-foreground font-medium">AI-powered cognitive pattern mapping</p>
                        </div>
                    </div>
                    {data.userPlan !== 'pro' ? (
                        <div className="flex items-center gap-2 px-4 py-1.5 bg-primary text-primary-foreground rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                            <Zap className="w-3.5 h-3.5 fill-current" />
                            PRO Access
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 px-4 py-1.5 bg-secondary/10 text-secondary border border-secondary/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                            <Sparkles className="w-3.5 h-3.5" />
                            Live Analysis
                        </div>
                    )}
                </div>

                <div className={data.userPlan === 'pro' ? '' : 'blur-xl select-none opacity-40 pointer-events-none'}>
                    {data.behavioralAnalysis ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-0">
                            <div className="space-y-8">
                                <div>
                                    <h4 className="text-xs font-black text-muted-foreground uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                                        Focus Patterns
                                    </h4>
                                    <div className="grid gap-4">
                                        {data.behavioralAnalysis.patterns.map((p, i) => (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                key={i}
                                                className="text-sm p-5 rounded-2xl bg-secondary/5 border border-white/5 hover:border-primary/20 hover:bg-secondary/10 transition-all flex items-start gap-4 group"
                                            >
                                                <div className="w-2 h-2 rounded-full bg-primary mt-1.5 group-hover:scale-150 transition-transform shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]" />
                                                <p className="text-foreground/90 font-medium leading-relaxed">{p}</p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs font-black text-muted-foreground uppercase tracking-[0.3em] mb-6">
                                        Environmental Triggers
                                    </h4>
                                    <div className="flex flex-wrap gap-3">
                                        {data.behavioralAnalysis.triggers.map((t, i) => (
                                            <span key={i} className="px-6 py-2.5 bg-accent/5 text-accent rounded-2xl text-xs font-black border border-accent/10 hover:bg-accent/10 transition-colors cursor-default capitalize tracking-wide">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="bg-primary/5 rounded-[2.5rem] p-10 border border-primary/10 relative overflow-hidden group min-h-[300px]">
                                    <div className="absolute -top-12 -right-12 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <Brain className="w-64 h-64" />
                                    </div>
                                    <h4 className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-8">Optimization Strategy</h4>
                                    <div className="mb-8">
                                        <span className="text-[10px] font-black text-primary/40 uppercase tracking-widest block mb-3">Dominant Factor</span>
                                        <span className="text-sm font-bold text-primary bg-primary/10 px-5 py-2 rounded-2xl border border-primary/20">
                                            {data.behavioralAnalysis.psychologicalFactor}
                                        </span>
                                    </div>
                                    <div className="space-y-6">
                                        {data.behavioralAnalysis.strategy.map((s, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.5 + (i * 0.1) }}
                                                className="flex gap-5"
                                            >
                                                <span className="flex-shrink-0 w-10 h-10 rounded-2xl bg-primary/20 text-primary flex items-center justify-center text-sm font-black border border-primary/10">
                                                    {i + 1}
                                                </span>
                                                <p className="text-sm text-foreground/80 leading-relaxed font-medium pt-2">{s}</p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-6 bg-secondary/5 rounded-3xl border border-white/5">
                                    <div>
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-1">Next Week Forecast</p>
                                        <p className="text-base font-bold text-foreground">Projected Procrastination Risk</p>
                                    </div>
                                    <div className={`px-6 py-3 rounded-2xl text-xs font-black shadow-lg ${data.behavioralAnalysis.riskLevel === 'High'
                                        ? 'bg-red-500/20 text-red-500 border border-red-500/30'
                                        : data.behavioralAnalysis.riskLevel === 'Medium'
                                            ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30'
                                            : 'bg-green-500/20 text-green-500 border border-green-500/30'
                                        }`}>
                                        {data.behavioralAnalysis.riskLevel.toUpperCase()} RISK
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="animate-pulse space-y-6">
                            <div className="h-4 bg-secondary/20 rounded w-1/4"></div>
                            <div className="h-32 bg-secondary/10 rounded-3xl"></div>
                            <div className="h-48 bg-secondary/10 rounded-3xl"></div>
                        </div>
                    )}
                </div>

                {data.userPlan !== 'pro' && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 bg-background/20 backdrop-blur-xl transition-all">
                        <div className="text-center p-10 bg-card/80 border border-white/10 rounded-[3rem] shadow-[0_32px_64px_rgba(0,0,0,0.4)] max-w-sm backdrop-blur-2xl">
                            <div className="w-20 h-20 bg-primary/20 text-primary rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
                                <Zap className="w-10 h-10 fill-current" />
                            </div>
                            <h4 className="text-3xl font-black mb-3 tracking-tight">Neural Insights Locked</h4>
                            <p className="text-muted-foreground text-sm font-medium mb-8 leading-relaxed">Upgrade to Pro to unlock advanced behavioral patterns and AI-driven correction strategies.</p>
                            <Link href="/pricing" className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-black rounded-2xl hover:scale-105 transition-all shadow-xl shadow-primary/30 active:scale-95">
                                Unlock Pro ⚡
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function MetricCard({ title, value, icon, trend }: { title: string, value: string, icon: React.ReactNode, trend: string }) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-card border border-border p-6 rounded-3xl backdrop-blur-sm shadow-sm group hover:border-primary/20 transition-all"
        >
            <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-secondary/10 rounded-2xl text-secondary group-hover:scale-110 transition-transform">{icon}</div>
                <span className="text-[10px] font-bold text-green-600 bg-green-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider">{trend}</span>
            </div>
            <div>
                <p className="text-muted-foreground text-xs mb-1 font-black uppercase tracking-widest">{title}</p>
                <p className="text-3xl font-black text-foreground tracking-tight">{value}</p>
            </div>
        </motion.div>
    );
}
