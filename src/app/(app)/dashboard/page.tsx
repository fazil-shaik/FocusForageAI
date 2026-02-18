import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { BrainCircuit, Target, CheckCircle } from "lucide-react";
import Link from "next/link";
import { FocusTimer } from "@/components/FocusTimer";

async function getDashboardData() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    if (!session) return null;

    const recentTasks = await db.query.tasks.findMany({
        where: eq(tasks.userId, session.user.id),
        orderBy: [desc(tasks.createdAt)],
        limit: 3,
    });

    return { session, recentTasks };
}

export default async function Dashboard() {
    const data = await getDashboardData();

    if (!data) {
        redirect("/signin");
    }

    const { session, recentTasks } = data;
    const userFirstName = session.user.name?.split(" ")[0] || "User";

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <header className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">
                        Good afternoon, {userFirstName}
                    </h1>
                    <p className="text-muted-foreground flex items-center gap-2 mt-1">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Focus Score: 85/100 (High)
                    </p>
                </div>
                <div className="flex gap-4">
                    <button className="px-4 py-2 bg-card border border-border rounded-lg text-sm text-foreground hover:bg-secondary/10 transition-colors shadow-sm">
                        Daily Report
                    </button>
                    <Link href="/tasks" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:opacity-90 transition-all shadow-md flex items-center">
                        + New Task
                    </Link>
                </div>
            </header>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Focus Timer Card */}
                <FocusTimer />

                {/* Right Column: Stats & Tasks */}
                <div className="space-y-6">

                    {/* AI Insight Card */}
                    <div className="bg-card/50 rounded-2xl p-6 border-l-4 border-l-primary border border-border backdrop-blur-sm shadow-sm">
                        <h3 className="text-sm font-bold text-muted-foreground mb-2 flex items-center gap-2">
                            <BrainCircuit className="w-4 h-4 text-primary" /> AI Insight
                        </h3>
                        <p className="text-sm leading-relaxed text-foreground">
                            You tend to lose focus around <span className="text-primary font-bold">3:00 PM</span>. I've scheduled a high-dopamine break for 2:50 PM.
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

