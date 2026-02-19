"use client";

import { motion } from "framer-motion";
import { Grid, Clock, Zap, Activity, Brain } from "lucide-react";


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

                <div className={data.userPlan === 'pro' ? '' : 'blur-sm select-none opacity-50 pointer-events-none'}>
                    {data.behavioralAnalysis ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="font-bold text-sm text-muted-foreground mb-4">Detected Patterns</h4>
                                <ul className="space-y-2 mb-6">
                                    {data.behavioralAnalysis.patterns.map((p, i) => (
                                        <li key={i} className="text-sm flex items-start gap-2">
                                            <span className="text-red-500 font-bold">•</span>
                                            {p}
                                        </li>
                                    ))}
                                </ul>

                                <h4 className="font-bold text-sm text-muted-foreground mb-4">Triggers</h4>
                                <div className="flex flex-wrap gap-2">
                                    {data.behavioralAnalysis.triggers.map((t, i) => (
                                        <span key={i} className="px-3 py-1 bg-secondary/10 rounded-full text-xs font-medium border border-border">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold text-sm text-muted-foreground mb-4">Correction Strategy</h4>
                                <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
                                    <p className="text-xs text-primary font-bold mb-2 uppercase tracking-wide">Psychological Factor: {data.behavioralAnalysis.psychologicalFactor}</p>
                                    <ol className="list-decimal list-inside space-y-2 text-sm">
                                        {data.behavioralAnalysis.strategy.map((s, i) => (
                                            <li key={i} className="text-foreground">{s}</li>
                                        ))}
                                    </ol>
                                </div>
                                <div className="mt-4 flex items-center justify-between p-3 bg-secondary/5 rounded-xl border border-border">
                                    <span className="text-sm font-medium">Risk Level Next Week</span>
                                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${data.behavioralAnalysis.riskLevel === 'High' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                                        {data.behavioralAnalysis.riskLevel}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="font-bold text-sm text-muted-foreground mb-4">Distraction Triggers</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span>Social Media (Afternoon)</span>
                                        <span className="font-bold text-red-500">High Risk</span>
                                    </div>
                                    <div className="w-full bg-secondary/20 h-2 rounded-full">
                                        <div className="bg-red-500 h-2 rounded-full w-[80%]"></div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-muted-foreground mb-4">Mood Correlation</h4>
                                <p className="text-sm leading-relaxed text-foreground">
                                    Your focus is <span className="font-bold text-green-500">2x higher</span> when you start with a "Flow" mood check-in.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {data.userPlan !== 'pro' && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 bg-background/50 backdrop-blur-[1px]">
                        <div className="text-center">
                            <h4 className="text-xl font-bold mb-2">Unlock Deep Insights</h4>
                            <p className="text-muted-foreground text-sm mb-4">Understand your behavioral patterns with Pro.</p>
                            {/* Link would go here, but component is client side, simple text for now or passed link */}
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
