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
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Neural Stats</h1>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MetricCard
                    title="Total Deep Work"
                    value={`${data.totalDeepWorkHours}h`}
                    icon={<Clock className="w-5 h-5 text-purple-400" />}
                    trend="+12% vs last week"
                />
                <MetricCard
                    title="Focus Sessions"
                    value={data.totalSessions.toString()}
                    icon={<Zap className="w-5 h-5 text-yellow-400" />}
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
                <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-purple-500" />
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
                                        className="w-full bg-gradient-to-t from-purple-900/50 to-purple-500 rounded-t-sm hover:from-purple-600 hover:to-pink-500 transition-colors"
                                    />
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-xs px-2 py-1 rounded border border-white/20 whitespace-nowrap z-10 pointer-events-none">
                                        {stat.date}: {stat.totalDeepWorkMinutes} min
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                        <span>30 Days Ago</span>
                        <span>Today</span>
                    </div>
                </div>

                {/* Recent Sessions */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col">
                    <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-500" />
                        Recent Sessions
                    </h3>
                    <div className="flex-1 space-y-4">
                        {data.recentSessions.length === 0 ? (
                            <p className="text-gray-500 text-sm">No recent sessions recorded.</p>
                        ) : (
                            data.recentSessions.map((session, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                                    <div>
                                        <p className="font-medium text-sm">{session.taskName}</p>
                                        <p className="text-xs text-gray-400">
                                            {session.startTime ? new Date(session.startTime).toLocaleDateString() : 'Unknown Date'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-mono text-sm text-purple-300">{session.duration || 0}m</p>
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${session.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
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
            className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-sm"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-white/5 rounded-lg">{icon}</div>
                <span className="text-xs font-medium text-green-400 bg-green-500/10 px-2 py-1 rounded-full">{trend}</span>
            </div>
            <div>
                <p className="text-gray-400 text-sm mb-1">{title}</p>
                <p className="text-2xl font-bold text-white">{value}</p>
            </div>
        </motion.div>
    );
}
