import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { tasks, dailyStats, focusSessions, users } from "@/db/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { BrainCircuit, Target, CheckCircle, Zap, ChevronRight } from "lucide-react";
import Link from "next/link";
import { FocusTimer } from "@/components/FocusTimer";
import { DashboardControls } from "@/components/DashboardControls";
import { Greeting } from "@/components/Greeting";
import { generateDynamicInsight } from "./insights";

import { redis } from "@/lib/redis";

type Task = typeof tasks.$inferSelect;

interface SessionUser {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    plan?: string;
    xp?: number;
}


export const dynamic = "force-dynamic";

async function getDashboardData() {
    const session = await getSession();
    if (!session) return null;

    // Fetch metrics for AI insights
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split("T")[0];

    const [recentTasksData, stats, sessions, dbUser] = await Promise.all([
        db.query.tasks.findMany({
            where: and(
                eq(tasks.userId, session.user.id),
                sql`${tasks.status} != 'done'`
            ),
            orderBy: [desc(tasks.createdAt)],
            limit: 3,
        }),
        db.query.dailyStats.findMany({
            where: and(
                eq(dailyStats.userId, session.user.id),
                sql`${dailyStats.date} >= ${sevenDaysAgoStr}`
            ),
            orderBy: [desc(dailyStats.date)],
        }),
        db.query.focusSessions.findMany({
            where: and(
                eq(focusSessions.userId, session.user.id),
                eq(focusSessions.status, "completed")
            ),
            orderBy: [desc(focusSessions.startTime)],
            limit: 10,
        }),
        db.query.users.findFirst({
            where: eq(users.id, session.user.id)
        })
    ]);

    return {
        session,
        recentTasks: recentTasksData,
        metrics: {
            stats,
            sessions
        },
        dbUser
    };
}

export default async function Dashboard() {
    const data = await getDashboardData();

    if (!data) {
        redirect("/signin");
    }

    const { session, recentTasks, metrics, dbUser } = data;
    const user = { ...session.user, ...dbUser } as SessionUser;
    const userFirstName = user.name?.split(" ")[0] || "User";

    const aiInsight = await generateDynamicInsight({
        userPlan: user.plan || "free",
        userName: userFirstName,
        metrics,
        xp: user.xp || 0
    });

    // Calculate dynamic focus score
    // Using avg of last 7 days deep work vs a 2-hour daily goal
    const last7DaysStats = metrics.stats || [];
    const avgMinutes = last7DaysStats.length > 0
        ? last7DaysStats.reduce((acc, s) => acc + (s.totalDeepWorkMinutes || 0), 0) / Math.max(last7DaysStats.length, 1)
        : 0;

    // 120 minutes = 100% focus score for the day
    const focusScore = Math.min(Math.round((avgMinutes / 120) * 100), 100) || 0;

    return (
        <div className="max-w-6xl mx-auto space-y-8 relative">
            {/* Mesh Gradient Background Overlay */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse"></div>
            <div className="absolute top-1/2 -right-24 w-80 h-80 bg-accent/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>

            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <Greeting userName={userFirstName} />
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/10 border border-border/50 rounded-2xl backdrop-blur-sm shadow-sm">
                            <div className="relative flex items-center justify-center">
                                <span className="absolute w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
                                <span className="relative w-2 h-2 rounded-full bg-green-500"></span>
                            </div>
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Focus Score: <span className="text-foreground">{focusScore}/100</span></span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-2xl backdrop-blur-sm shadow-sm group hover:scale-105 transition-transform cursor-default">
                            <Zap className="w-3.5 h-3.5 text-primary fill-current" />
                            <span className="text-xs font-black text-primary tracking-wider">{user.xp || 0} XP</span>
                        </div>
                    </div>
                </div>
                <DashboardControls />
            </header>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Focus Timer Card */}
                <FocusTimer
                    userPlan={(session.user as any).plan || "free"}
                    recentTasks={recentTasks}
                />

                {/* Right Column: Stats & Tasks */}
                <div className="space-y-6">

                    {/* AI Insight Card */}
                    <div className="bg-card/40 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl hover:shadow-primary/5 transition-all group relative overflow-hidden h-full">
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-accent"></div>
                        <h3 className="text-xs font-black text-muted-foreground mb-4 flex items-center justify-between uppercase tracking-widest">
                            <span className="flex items-center gap-2">
                                <BrainCircuit className="w-4 h-4 text-primary animate-pulse" /> AI Insight
                            </span>
                            {user.plan !== "pro" && (
                                <Link href="/pricing" className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full hover:bg-primary/20 transition-colors shadow-sm">
                                    PRO
                                </Link>
                            )}
                        </h3>

                        {user.plan === "pro" ? (
                            <p className="text-sm leading-relaxed text-foreground font-medium italic opacity-90 group-hover:opacity-100 transition-opacity">
                                "{aiInsight}"
                            </p>
                        ) : (
                            <div className="relative">
                                <p className="text-sm leading-relaxed text-foreground/50 font-medium italic blur-[2px] select-none">
                                    "Your neuro-activity suggests a peak in focus during afternoon sessions. Recommendation: Schedule high-complexity tasks between 2 PM and 4 PM..."
                                </p>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Link href="/pricing" className="text-[10px] font-black text-primary bg-primary/10 px-3 py-1 rounded-lg border border-primary/20 hover:bg-primary/20 transition-all opacity-0 group-hover:opacity-100">
                                        REVEAL INSIGHT ⚡
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Task List Preview */}
                    <div className="bg-card/40 backdrop-blur-xl rounded-3xl p-6 flex-1 border border-white/10 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 blur-3xl rounded-full -mr-12 -mt-12 group-hover:bg-accent/10 transition-colors"></div>
                        <h3 className="text-lg font-extrabold mb-6 flex items-center gap-2 text-foreground">
                            <Target className="w-5 h-5 text-accent" /> Up Next
                        </h3>
                        <div className="space-y-4">
                            {recentTasks.length === 0 ? (
                                <div className="py-8 text-center space-y-3">
                                    <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto">
                                        <CheckCircle className="w-6 h-6 text-muted-foreground/30" />
                                    </div>
                                    <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">No pending tasks</p>
                                </div>
                            ) : (
                                recentTasks.map((task) => (
                                    <div key={task.id} className="group p-4 rounded-2xl bg-secondary/5 border border-white/5 hover:border-primary/30 hover:bg-secondary/10 transition-all cursor-pointer flex items-center gap-4 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 to-primary/0 group-hover:from-primary/5 transition-all"></div>
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${task.status === 'done' ? 'border-green-500 bg-green-500/20' : 'border-muted-foreground/20 group-hover:border-primary group-hover:bg-primary/10'} transition-all`}>
                                            {task.status === 'done' && <CheckCircle className="w-3.5 h-3.5 text-green-500" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-bold truncate transition-colors ${task.status === 'done' ? 'text-muted-foreground line-through' : 'text-foreground group-hover:text-primary'}`}>
                                                {task.title}
                                            </p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded-md ${task.priority === 'high' ? 'bg-red-500/10 text-red-500' :
                                                    task.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-500' :
                                                        'bg-blue-500/10 text-blue-500'
                                                    }`}>
                                                    {task.priority}
                                                </span>
                                                <span className="text-[10px] text-muted-foreground font-bold tracking-tight">
                                                    • {task.estimatedDuration || 15}m
                                                </span>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                    </div>
                                ))
                            )}
                        </div>
                        <Link href="/tasks" className="block w-full mt-6 py-3 text-center text-[10px] font-black text-muted-foreground hover:text-primary transition-all uppercase tracking-[0.2em] border-t border-white/5 px-4 hover:bg-primary/5 rounded-b-3xl -mx-6 -mb-6 mt-auto">
                            View All Tasks
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

