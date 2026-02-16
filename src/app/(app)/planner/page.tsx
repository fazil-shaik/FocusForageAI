"use client";

import { useState } from "react";
import { Loader2, Sparkles, Clock, Battery, ListTodo } from "lucide-react";

export default function PlannerPage() {
    const [tasks, setTasks] = useState("");
    const [availableTime, setAvailableTime] = useState("4 hours");
    const [energyLevel, setEnergyLevel] = useState("High");
    const [loading, setLoading] = useState(false);
    const [plan, setPlan] = useState<any>(null);

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
            setPlan(data);
        } catch (error) {
            console.error(error);
            alert("Failed to generate plan");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <header>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                    AI Deep Work Architect
                </h1>
                <p className="text-gray-400 mt-2">
                    Input your tasks and let AI build your perfect flow state schedule.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Input Form */}
                <div className="glass-card p-6 rounded-2xl space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                            <ListTodo className="w-4 h-4 text-purple-400" /> Tasks (One per line)
                        </label>
                        <textarea
                            value={tasks}
                            onChange={(e) => setTasks(e.target.value)}
                            className="w-full h-40 bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-purple-500 transition-all resize-none placeholder:text-gray-600"
                            placeholder="- Finish API documentation&#10;- Review PR #102&#10;- Write blog post intro"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-blue-400" /> Available Time
                            </label>
                            <select
                                value={availableTime}
                                onChange={(e) => setAvailableTime(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                            >
                                <option>1 hour</option>
                                <option>2 hours</option>
                                <option>4 hours</option>
                                <option>6 hours</option>
                                <option>8 hours</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                                <Battery className="w-4 h-4 text-green-400" /> Energy Level
                            </label>
                            <select
                                value={energyLevel}
                                onChange={(e) => setEnergyLevel(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:ring-2 focus:ring-purple-500 outline-none"
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
                        className="w-full py-4 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-5 h-5" /> Generate Plan</>}
                    </button>
                </div>

                {/* Results View */}
                <div className="space-y-4">
                    {plan ? (
                        <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
                            <div className="glass-card p-6 rounded-2xl border-l-4 border-l-purple-500 mb-6">
                                <h3 className="font-bold text-lg mb-2">AI Summary</h3>
                                <p className="text-gray-400 italic">"{plan.summary}"</p>
                            </div>

                            <div className="space-y-3">
                                {plan.schedule.map((item: any, idx: number) => (
                                    <div key={idx} className="glass-card p-4 rounded-xl flex items-start gap-4 hover:bg-white/5 transition-colors group">
                                        <div className="w-16 text-sm font-mono text-gray-500 pt-1 border-r border-white/10 pr-2">{item.time}</div>
                                        <div>
                                            <h4 className="font-bold text-white group-hover:text-purple-400 transition-colors">{item.activity}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${item.type === 'Deep Work' ? 'bg-purple-500/20 text-purple-300' :
                                                        item.type === 'Break' ? 'bg-green-500/20 text-green-300' :
                                                            'bg-blue-500/20 text-blue-300'
                                                    }`}>
                                                    {item.type}
                                                </span>
                                            </div>
                                            {item.notes && <p className="text-xs text-gray-500 mt-2">{item.notes}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-600 glass-card rounded-2xl p-10 border-dashed border-2 border-white/10">
                            <Sparkles className="w-12 h-12 mb-4 opacity-20" />
                            <p>Your optimized schedule will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
