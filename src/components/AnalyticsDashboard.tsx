"use client";

import { motion } from "framer-motion";
import { Grid, Clock, Zap, Activity, Brain } from "lucide-react";


type AnalyticsData = {
    dailyStats: any[];
    recentSessions: any[];
    totalDeepWorkHours: number;
    totalSessions: number;
    averageMood: number;
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
