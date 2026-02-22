"use client";

import { motion } from "framer-motion";
import { Grid, Clock, Zap, Activity, Brain } from "lucide-react";
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
                    trend="Consistent"
                />
                <MetricCard
                    title="Brain Strain"
                    value="Low"
                    icon={<Activity className="w-5 h-5 text-green-400" />}
                    trend="Optimal range"
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
                                <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${heightPercentage}%` }}
                                        transition={{ duration: 0.5, delay: i * 0.02 }}
                                        className="w-full bg-gradient-to-t from-primary/50 to-primary rounded-t-full hover:from-primary hover:to-accent transition-colors"
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
            <div className="bg-card border border-border rounded-3xl p-6 backdrop-blur-sm shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold flex items-center gap-2 text-foreground">
                        <Brain className="w-5 h-5 text-accent" />
                        Behavioral Analysis
                    </h3>
                    {data.userPlan !== 'pro' && (
                        <span className="text-xs font-bold bg-primary text-primary-foreground px-2 py-1 rounded-full">PRO</span>
                    )}
                </div>

                <div className={data.userPlan === 'pro' ? '' : 'blur-md select-none opacity-50 pointer-events-none'}>
                    {data.behavioralAnalysis ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-0">
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                        Detected Patterns
                                    </h4>
                                    <div className="space-y-3">
                                        {data.behavioralAnalysis.patterns.map((p, i) => (
                                            <motion.div
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                key={i}
                                                className="text-sm p-3 rounded-xl bg-secondary/5 border border-border/50 hover:border-primary/20 transition-colors"
                                            >
                                                {p}
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                                        Primary Triggers
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {data.behavioralAnalysis.triggers.map((t, i) => (
                                            <span key={i} className="px-4 py-1.5 bg-accent/10 text-accent rounded-full text-xs font-bold border border-accent/20">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <Brain className="w-24 h-24" />
                                    </div>
                                    <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-4">Correction Strategy</h4>
                                    <p className="text-xs font-bold text-primary/60 mb-4 bg-primary/10 w-fit px-3 py-1 rounded-full">
                                        Factor: {data.behavioralAnalysis.psychologicalFactor}
                                    </p>
                                    <ol className="space-y-4">
                                        {data.behavioralAnalysis.strategy.map((s, i) => (
                                            <li key={i} className="flex gap-4">
                                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                                                    {i + 1}
                                                </span>
                                                <p className="text-sm text-foreground leading-relaxed">{s}</p>
                                            </li>
                                        ))}
                                    </ol>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-secondary/5 rounded-2xl border border-border/50">
                                    <div>
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Next Week Forecast</p>
                                        <p className="text-sm font-medium text-foreground">Projected Procrastination Risk</p>
                                    </div>
                                    <div className={`px-4 py-2 rounded-xl text-xs font-bold shadow-sm ${data.behavioralAnalysis.riskLevel === 'High'
                                        ? 'bg-red-500/20 text-red-500 border border-red-500/30'
                                        : data.behavioralAnalysis.riskLevel === 'Medium'
                                            ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30'
                                            : 'bg-green-500/20 text-green-500 border border-green-500/30'
                                        }`}>
                                        {data.behavioralAnalysis.riskLevel} Risk
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="animate-pulse space-y-4">
                            <div className="h-4 bg-secondary/20 rounded w-1/4"></div>
                            <div className="h-20 bg-secondary/10 rounded-2xl"></div>
                            <div className="h-20 bg-secondary/10 rounded-2xl"></div>
                        </div>
                    )}
                </div>

                {data.userPlan !== 'pro' && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 bg-background/40 backdrop-blur-md">
                        <div className="text-center p-8 bg-card border border-border rounded-3xl shadow-2xl max-w-sm">
                            <div className="w-16 h-16 bg-primary/20 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Zap className="w-8 h-8" />
                            </div>
                            <h4 className="text-2xl font-bold mb-2">Neural Insights Locked</h4>
                            <p className="text-muted-foreground text-sm mb-6">Upgrade to Pro to unlock advanced behavioral patterns and AI-driven correction strategies.</p>
                            <Link href="/pricing" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/20">
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
            className="bg-card border border-border p-5 rounded-3xl backdrop-blur-sm shadow-sm"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-secondary/10 rounded-2xl text-secondary">{icon}</div>
                <span className="text-xs font-bold text-green-600 bg-green-500/10 px-2 py-1 rounded-full">{trend}</span>
            </div>
            <div>
                <p className="text-muted-foreground text-sm mb-1 font-bold">{title}</p>
                <p className="text-2xl font-bold text-foreground">{value}</p>
            </div>
        </motion.div>
    );
}
