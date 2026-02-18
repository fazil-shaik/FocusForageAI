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
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        Good afternoon, {userFirstName}
                    </h1>
                    <p className="text-gray-400 flex items-center gap-2 mt-1">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Focus Score: 85/100 (High)
                    </p>
                </div>
                <div className="flex gap-4">
                    <button className="px-4 py-2 bg-neutral-900 border border-white/10 rounded-lg text-sm text-gray-300 hover:bg-neutral-800 transition-colors">
                        Daily Report
                    </button>
                    <Link href="/tasks" className="px-4 py-2 bg-white text-black rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors flex items-center">
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
                    <div className="glass-card rounded-2xl p-6 border-l-4 border-l-purple-500 bg-zinc-900/50 border-white/10 backdrop-blur-sm">
                        <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                            <BrainCircuit className="w-4 h-4 text-purple-500" /> AI Insight
                        </h3>
                        <p className="text-sm leading-relaxed text-gray-300">
                            You tend to lose focus around <span className="text-white font-bold">3:00 PM</span>. I've scheduled a high-dopamine break for 2:50 PM.
                        </p>
                    </div>

                    {/* Task List Preview */}
                    <div className="glass-card rounded-2xl p-6 flex-1 bg-zinc-900/50 border border-white/10 backdrop-blur-sm">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Target className="w-5 h-5 text-pink-500" /> Up Next
                        </h3>
                        <div className="space-y-3">
                            {recentTasks.length === 0 ? (
                                <p className="text-gray-500 text-sm">No pending tasks. Great job!</p>
                            ) : (
                                recentTasks.map((task) => (
                                    <div key={task.id} className="group p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 transition-all cursor-pointer flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${task.status === 'done' ? 'border-green-500 bg-green-500/20' : 'border-gray-600 group-hover:border-purple-500'} transition-colors`}>
                                            {task.status === 'done' && <CheckCircle className="w-3 h-3 text-green-500" />}
                                        </div>
                                        <div>
                                            <p className={`text-sm font-medium transition-colors ${task.status === 'done' ? 'text-gray-500 line-through' : 'group-hover:text-white'}`}>
                                                {task.title}
                                            </p>
                                            <p className="text-xs text-gray-500 capitalize">
                                                {task.priority} Priority • {task.estimatedDuration || 15}m
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <Link href="/tasks" className="block w-full mt-4 py-2 text-center text-xs font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest border-t border-white/5 pt-4">
                            View All Tasks
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

