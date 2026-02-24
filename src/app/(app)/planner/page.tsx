"use client";

import { useState, useEffect } from "react";
import { Loader2, Sparkles, Clock, Battery, ListTodo, Zap } from "lucide-react";
import { savePlanToTasks, getPlannerCredits } from "./actions";
import { toast } from "sonner";

export default function PlannerPage() {
    const [tasks, setTasks] = useState("");
    const [availableTime, setAvailableTime] = useState("4 hours");
    const [energyLevel, setEnergyLevel] = useState("High");
    const [loading, setLoading] = useState(false);
    const [plan, setPlan] = useState<any>(null);
    const [credits, setCredits] = useState<{ count: number, total: number, plan: string } | null>(null);

    useEffect(() => {
        getPlannerCredits().then(setCredits);
    }, []);

    const handleGenerate = async () => {

        setLoading(true);
        try {
            const taskList = tasks.split("\n").filter(t => t.trim().length > 0);
            const res = await fetch("/api/planner", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tasks: taskList, availableTime, energyLevel }),
            });
            const data = await res.json();
            if (data.error) {
                toast.error(data.error);
                return;
            }
            setPlan(data);
            // Refresh credits on successful generation
            getPlannerCredits().then(setCredits);
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate plan");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-foreground tracking-tight">
                        AI Deep Work Architect
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Input your tasks and let AI build your perfect flow state schedule.
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-2xl backdrop-blur-sm shadow-sm group hover:scale-105 transition-transform cursor-default">
                    <Zap className="w-4 h-4 text-primary fill-current" />
                    <span className="text-xs font-black text-primary tracking-widest uppercase">
                        Unlimited Credits
                    </span>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Input Form */}
                <div className="relative group">
                    <div className={`bg-card p-6 rounded-3xl space-y-6 border border-border shadow-sm transition-all`}>
                        <div>
                            <label className="block text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                                <ListTodo className="w-4 h-4 text-primary" /> Tasks (One per line)
                            </label>
                            <textarea
                                value={tasks}
                                onChange={(e) => setTasks(e.target.value)}
                                className="w-full h-40 bg-input border border-transparent rounded-2xl p-4 text-foreground focus:ring-2 focus:ring-primary transition-all resize-none placeholder:text-muted-foreground outline-none"
                                placeholder="- Finish API documentation&#10;- Review PR #102&#10;- Write blog post intro"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-blue-500" /> Available Time
                                </label>
                                <select
                                    value={availableTime}
                                    onChange={(e) => setAvailableTime(e.target.value)}
                                    className="w-full bg-input border border-transparent rounded-xl p-3 text-foreground focus:ring-2 focus:ring-primary outline-none"
                                >
                                    <option>1 hour</option>
                                    <option>2 hours</option>
                                    <option>4 hours</option>
                                    <option>6 hours</option>
                                    <option>8 hours</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-foreground mb-2 flex items-center gap-2">
                                    <Battery className="w-4 h-4 text-green-500" /> Energy Level
                                </label>
                                <select
                                    value={energyLevel}
                                    onChange={(e) => setEnergyLevel(e.target.value)}
                                    className="w-full bg-input border border-transparent rounded-xl p-3 text-foreground focus:ring-2 focus:ring-primary outline-none"
                                >
                                    <option>High</option>
                                    <option>Medium</option>
                                    <option>Low</option>
                                </select>
                            </div>
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={loading || !tasks}
                            className="w-full py-4 rounded-full bg-primary text-primary-foreground font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:-translate-y-1"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-5 h-5" /> Generate Plan</>}
                        </button>
                    </div>

                </div>

                {/* Results View */}
                <div className="space-y-4">
                    {plan ? (


                        <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
                            <div className="bg-card p-6 rounded-3xl border-l-4 border-l-primary border border-border mb-6 shadow-sm">
                                <h3 className="font-bold text-lg mb-2 text-foreground">AI Summary</h3>
                                <p className="text-muted-foreground italic">"{plan.summary}"</p>
                            </div>

                            <div className="space-y-3 mb-8">
                                {plan.schedule.map((item: any, idx: number) => (
                                    <div key={idx} className="bg-card p-4 rounded-2xl flex items-start gap-4 hover:bg-secondary/5 transition-colors group border border-border">
                                        <div className="w-16 text-sm font-mono text-muted-foreground pt-1 border-r border-border pr-2">{item.time}</div>
                                        <div>
                                            <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">{item.activity}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${item.type === 'Deep Work' ? 'bg-primary/10 text-primary' :
                                                    item.type === 'Break' ? 'bg-green-500/10 text-green-600' :
                                                        'bg-blue-500/10 text-blue-600'
                                                    }`}>
                                                    {item.type}
                                                </span>
                                            </div>
                                            {item.notes && <p className="text-xs text-muted-foreground mt-2">{item.notes}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={async () => {
                                    try {
                                        await savePlanToTasks(plan);
                                        toast.success("Plan saved to tasks!");
                                        const newCredits = await getPlannerCredits();
                                        setCredits(newCredits);
                                    } catch (error: any) {
                                        if (error.message.includes("LIMIT_REACHED")) {
                                            toast.error("Daily planning limit reached. Upgrade to Pro!");
                                        } else {
                                            toast.error("Failed to save plan.");
                                        }
                                    }
                                }}
                                className="w-full py-4 rounded-full bg-secondary text-secondary-foreground font-bold hover:bg-secondary/80 transition-all flex items-center justify-center gap-2 border border-border shadow-sm hover:shadow-md"
                            >
                                <ListTodo className="w-5 h-5" /> Save Execution Plan to Tasks
                            </button>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground bg-card/50 rounded-3xl p-10 border-dashed border-2 border-border">
                            <Sparkles className="w-12 h-12 mb-4 opacity-20" />
                            <p>Your optimized schedule will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}
