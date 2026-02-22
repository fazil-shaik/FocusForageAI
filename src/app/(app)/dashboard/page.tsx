import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { tasks, dailyStats, focusSessions } from "@/db/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { BrainCircuit, Target, CheckCircle, Zap } from "lucide-react";
import Link from "next/link";
import { FocusTimer } from "@/components/FocusTimer";
import { DashboardControls } from "@/components/DashboardControls";
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
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) return null;

    // Fetch metrics for AI insights
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split("T")[0];

    const [recentTasksData, stats, sessions] = await Promise.all([
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
        })
    ]);

    return {
        session,
        recentTasks: recentTasksData,
        metrics: {
            stats,
            sessions
        }
    };
}

export default async function Dashboard() {
    const data = await getDashboardData();

    if (!data) {
        redirect("/signin");
    }

    const { session, recentTasks, metrics } = data;
    const user = session.user as SessionUser;
    const userFirstName = user.name?.split(" ")[0] || "User";

    const aiInsight = await generateDynamicInsight({
        userPlan: user.plan || "free",
        userName: userFirstName,
        metrics,
        xp: user.xp || 0
    });

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <header className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">
                        Good afternoon, {userFirstName}
                    </h1>
                    <p className="text-muted-foreground flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1.5 capitalize">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Focus Score: 85/100
                        </span>
                        <span className="flex items-center gap-1.5 px-3 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-bold">
                            <Zap className="w-3 h-3" />
                            {user.xp || 0} XP
                        </span>
                    </p>
                </div>
                <DashboardControls />
            </header>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Focus Timer Card */}
                <FocusTimer userPlan={(session.user as any).plan || "free"} />

                {/* Right Column: Stats & Tasks */}
                <div className="space-y-6">

                    {/* AI Insight Card */}
                    <div className="bg-card/50 rounded-2xl p-6 border-l-4 border-l-primary border border-border backdrop-blur-sm shadow-sm hover:shadow-md transition-all group">
                        <h3 className="text-sm font-bold text-muted-foreground mb-2 flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <BrainCircuit className="w-4 h-4 text-primary animate-pulse" /> AI Insight
                            </span>
                            {user.plan !== "pro" && (
                                <Link href="/pricing" className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full hover:bg-primary/20 transition-colors">
                                    Unlock Pro ⚡
                                </Link>
                            )}
                        </h3>
                        <p className="text-sm leading-relaxed text-foreground font-medium italic">
                            "{aiInsight}"
                        </p>
                    </div>

                    {/* Task List Preview */}
                    <div className="bg-card rounded-2xl p-6 flex-1 border border-border shadow-sm">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-foreground">
                            <Target className="w-5 h-5 text-accent" /> Up Next
                        </h3>
                        <div className="space-y-3">
                            {recentTasks.length === 0 ? (
                                <p className="text-muted-foreground text-sm">No pending tasks. Great job!</p>
                            ) : (
                                recentTasks.map((task) => (
                                    <div key={task.id} className="group p-3 rounded-xl bg-secondary/5 border border-border hover:border-primary/30 transition-all cursor-pointer flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${task.status === 'done' ? 'border-green-500 bg-green-500/20' : 'border-muted-foreground/30 group-hover:border-primary'} transition-colors`}>
                                            {task.status === 'done' && <CheckCircle className="w-3 h-3 text-green-500" />}
                                        </div>
                                        <div>
                                            <p className={`text-sm font-medium transition-colors ${task.status === 'done' ? 'text-muted-foreground line-through' : 'text-foreground group-hover:text-primary'}`}>
                                                {task.title}
                                            </p>
                                            <p className="text-xs text-muted-foreground capitalize">
                                                {task.priority} Priority • {task.estimatedDuration || 15}m
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <Link href="/tasks" className="block w-full mt-4 py-2 text-center text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest border-t border-border pt-4">
                            View All Tasks
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

