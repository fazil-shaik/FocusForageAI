"use client";

import { motion, useAnimation } from "framer-motion";
import { Play, CheckCircle, Plus, BrainCircuit, MousePointer2, LayoutDashboard, ListTodo, BarChart3, Clock, Calendar, TrendingUp, Zap, Activity } from "lucide-react";
import React, { useState, useEffect } from "react";

export function HeroDemo() {
    const [activeView, setActiveView] = useState<"dashboard" | "tasks" | "analytics">("dashboard");
    const [isPlaying, setIsPlaying] = useState(false);
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [tasks, setTasks] = useState([
        { id: 1, title: "Design Landing Page", priority: "High", status: "todo" },
        { id: 2, title: "Implement Auth Flow", priority: "Medium", status: "todo" },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [showModal, setShowModal] = useState(false);

    // Interaction States for hover effects
    const [hoveredElement, setHoveredElement] = useState<string | null>(null);

    // Animation controls
    const cursorControls = useAnimation();
    const buttonControls = useAnimation();

    // Simulation Sequence
    useEffect(() => {
        let mounted = true;

        const typeText = async (text: string) => {
            for (let i = 0; i <= text.length; i++) {
                if (!mounted) return;
                setInputValue(text.slice(0, i));
                await new Promise(r => setTimeout(r, 50 + Math.random() * 50)); // Random typing speed
            }
        };

        const sequence = async () => {
            if (!mounted) return;

            // --- RESET ---
            setActiveView("dashboard");
            setIsPlaying(false);
            setTimeLeft(25 * 60);
            setTasks([
                { id: 1, title: "Design Landing Page", priority: "High", status: "todo" },
                { id: 2, title: "Implement Auth Flow", priority: "Medium", status: "todo" },
            ]);
            setInputValue("");
            setShowModal(false);
            setHoveredElement(null);
            await cursorControls.set({ x: 0, y: 0, opacity: 0 });

            await new Promise(r => setTimeout(r, 800));

            // --- 1. START FOCUS SESSION (Dashboard) ---
            await cursorControls.start({ opacity: 1, x: 20, y: 30, transition: { duration: 0.5 } });

            // Move to 'Start' button - Center of square is roughly x: 220, y: 240 relative to container top-left
            await cursorControls.start({ x: 220, y: 240, transition: { duration: 1, ease: "easeInOut" } });
            setHoveredElement("play-btn");
            await buttonControls.start({ scale: 0.9, transition: { duration: 0.1 } });
            await new Promise(r => setTimeout(r, 100)); // Click hold
            await buttonControls.start({ scale: 1, transition: { duration: 0.1 } });
            setIsPlaying(true);
            setHoveredElement(null);

            // Simulate timer running for a bit
            await new Promise(r => setTimeout(r, 1500));

            // --- 2. SWITCH TO TASKS VIEW ---
            // Move to sidebar 'Tasks' icon (x: ~40, y: ~150)
            await cursorControls.start({ x: 40, y: 150, transition: { duration: 0.8 } });
            setHoveredElement("nav-tasks");
            // Click Sim
            await new Promise(r => setTimeout(r, 200));
            setActiveView("tasks");
            setHoveredElement(null);

            await new Promise(r => setTimeout(r, 500));

            // --- 3. CREATE NEW TASK ---
            // Move to "New Task" button (top right, x: ~750, y: ~50)
            await cursorControls.start({ x: 750, y: 50, transition: { duration: 1 } });
            setHoveredElement("new-task-btn");
            // Click
            await new Promise(r => setTimeout(r, 200));
            setShowModal(true);
            setHoveredElement(null);

            // Move to input field (center, x: ~400, y: ~200)
            await cursorControls.start({ x: 400, y: 200, transition: { duration: 0.5 } });

            // Type "Review PRs"
            await typeText("Review Pull Requests");

            // Move to "Create" button in modal (bottom right of modal, x: ~580, y: ~320)
            await cursorControls.start({ x: 580, y: 320, transition: { duration: 0.8 } });
            setHoveredElement("create-task-confirm");
            // Click
            await new Promise(r => setTimeout(r, 200));
            setTasks(prev => [{ id: 3, title: "Review Pull Requests", priority: "High", status: "todo" }, ...prev]);
            setShowModal(false);
            setHoveredElement(null);

            await new Promise(r => setTimeout(r, 800));

            // --- 4. SWITCH TO ANALYTICS ---
            // Move to sidebar 'Analytics' icon (x: ~40, y: ~210)
            await cursorControls.start({ x: 40, y: 210, transition: { duration: 1.2 } });
            setHoveredElement("nav-analytics");
            // Click
            await new Promise(r => setTimeout(r, 200));
            setActiveView("analytics");
            setHoveredElement(null);

            await new Promise(r => setTimeout(r, 3000)); // Let user see the charts

            // --- 5. LOOP ---
            // Fade out
            await cursorControls.start({ opacity: 0, transition: { duration: 0.5 } });
            sequence();
        };

        sequence();

        return () => { mounted = false; };
    }, []);

    // Timer Effect
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 10); // Super fast timer
            }, 100);
        }
        return () => clearInterval(interval);
    }, [isPlaying, timeLeft]);


    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="relative w-full max-w-5xl mx-auto mt-12 select-none pointer-events-none">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-[2rem] blur opacity-30 animate-pulse"></div>

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative bg-card rounded-[2rem] shadow-2xl overflow-hidden border-4 border-card/50 ring-1 ring-white/10 aspect-video flex"
            >
                {/* Sidebar */}
                <div className="w-20 bg-muted/30 border-r border-border flex flex-col items-center py-8 gap-8 z-10">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-inner">
                        <BrainCircuit className="w-6 h-6" />
                    </div>

                    <div className="flex flex-col gap-6 w-full px-4">
                        <SidebarIcon active={activeView === 'dashboard'} hover={hoveredElement === 'nav-dashboard'} icon={<LayoutDashboard />} />
                        <SidebarIcon active={activeView === 'tasks'} hover={hoveredElement === 'nav-tasks'} icon={<ListTodo />} />
                        <SidebarIcon active={activeView === 'analytics'} hover={hoveredElement === 'nav-analytics'} icon={<BarChart3 />} />
                        <SidebarIcon active={false} icon={<Calendar />} />
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 bg-background/50 p-8 overflow-hidden relative flex flex-col">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6 shrink-0">
                        <h2 className="text-2xl font-bold capitalize flex items-center gap-2">
                            {activeView === 'analytics' && <BarChart3 className="w-6 h-6 text-primary" />}
                            {activeView === 'tasks' && <ListTodo className="w-6 h-6 text-primary" />}
                            {activeView === 'dashboard' && <LayoutDashboard className="w-6 h-6 text-primary" />}
                            {activeView}
                        </h2>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <div className="text-xs text-muted-foreground font-bold">SHAIB P.</div>
                                <div className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full inline-block">Pro Plan</div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold shadow-md">
                                SP
                            </div>
                        </div>
                    </div>

                    <div className="relative flex-1 overflow-hidden">
                        {/* VIEW: DASHBOARD */}
                        {activeView === 'dashboard' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-2 gap-6 h-full">
                                <div className="col-span-1 bg-card rounded-3xl p-8 flex flex-col items-center justify-center border border-border shadow-sm relative overflow-hidden group">
                                    <div className="absolute top-4 right-4 text-xs font-bold text-muted-foreground bg-secondary/10 px-2 py-1 rounded-full">AI MODE</div>
                                    <div className={`text-6xl font-bold tabular-nums mb-4 tracking-tighter ${isPlaying ? 'text-primary' : 'text-foreground'}`}>
                                        {formatTime(timeLeft)}
                                    </div>
                                    <motion.button
                                        animate={buttonControls}
                                        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-colors ${isPlaying ? 'bg-secondary text-secondary-foreground' : 'bg-primary text-primary-foreground'} ${hoveredElement === 'play-btn' ? 'scale-110 ring-4 ring-primary/20' : ''}`}
                                    >
                                        <Play className="w-6 h-6 fill-current" />
                                    </motion.button>
                                </div>
                                <div className="col-span-1 space-y-4">
                                    <div className="bg-card/50 p-5 rounded-2xl border border-border">
                                        <h3 className="font-bold mb-2 text-sm text-muted-foreground flex items-center gap-2"><Activity className="w-4 h-4" /> Focus Score</h3>
                                        <div className="text-4xl font-bold text-foreground">92<span className="text-lg text-muted-foreground">/100</span></div>
                                        <div className="h-2 w-full bg-muted mt-3 rounded-full overflow-hidden">
                                            <div className="h-full bg-green-500 w-[92%] animate-pulse"></div>
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-br from-primary/10 to-transparent p-5 rounded-2xl border border-primary/20">
                                        <h3 className="font-bold mb-1 text-sm text-primary flex items-center gap-2"><BrainCircuit className="w-4 h-4" /> AI Insight</h3>
                                        <p className="text-xs text-foreground/80 leading-relaxed">Your focus peaks at 10 AM. Scheduling a deep work session now is recommended.</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* VIEW: TASKS */}
                        {activeView === 'tasks' && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="h-full flex flex-col">
                                <div className="flex justify-between mb-4">
                                    <div className="flex gap-2">
                                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">Todo</span>
                                        <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-bold border border-border">Done</span>
                                    </div>
                                    <button className={`flex items-center gap-2 px-3 py-1 bg-primary text-primary-foreground rounded-lg text-xs font-bold transition-transform ${hoveredElement === 'new-task-btn' ? 'scale-105 shadow-md' : ''}`}>
                                        <Plus className="w-3 h-3" /> New Task
                                    </button>
                                </div>
                                <div className="space-y-3 flex-1 overflow-visible">
                                    {tasks.map((task, i) => (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            key={task.id}
                                            className="bg-card p-4 rounded-xl border border-border flex justify-between items-center shadow-sm hover:border-primary/30 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${task.status === 'done' ? 'bg-green-500 border-green-500' : 'border-primary/50'}`}>
                                                    {task.status === 'done' && <CheckCircle className="w-3 h-3 text-white" />}
                                                </div>
                                                <span className="font-medium text-sm">{task.title}</span>
                                            </div>
                                            <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${task.priority === 'High' ? 'bg-red-500/10 text-red-500' : 'bg-secondary/10 text-secondary'}`}>
                                                {task.priority}
                                            </span>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* VIEW: ANALYTICS */}
                        {activeView === 'analytics' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col gap-6">
                                {/* Stats Row */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-card border border-border p-4 rounded-2xl">
                                        <div className="text-muted-foreground text-[10px] uppercase font-bold mb-1">Total Focus</div>
                                        <div className="text-2xl font-bold flex items-baseline gap-1">12.5<span className="text-sm font-normal text-muted-foreground">hrs</span></div>
                                    </div>
                                    <div className="bg-card border border-border p-4 rounded-2xl">
                                        <div className="text-muted-foreground text-[10px] uppercase font-bold mb-1">Sessions</div>
                                        <div className="text-2xl font-bold">14</div>
                                    </div>
                                    <div className="bg-card border border-border p-4 rounded-2xl">
                                        <div className="text-muted-foreground text-[10px] uppercase font-bold mb-1">Streak</div>
                                        <div className="text-2xl font-bold text-orange-500 flex items-center gap-1"><Zap className="w-4 h-4 fill-current" /> 5</div>
                                    </div>
                                </div>

                                {/* Chart */}
                                <div className="flex-1 bg-card border border-border rounded-2xl p-6 flex flex-col justify-end relative overflow-hidden">
                                    <p className="absolute top-4 left-4 text-xs font-bold text-muted-foreground flex items-center gap-2"><TrendingUp className="w-3 h-3" /> Weekly Activity</p>
                                    <div className="flex items-end justify-between gap-2 h-32">
                                        {[40, 65, 30, 85, 50, 90, 60].map((h, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ height: 0 }}
                                                animate={{ height: `${h}%` }}
                                                transition={{ delay: i * 0.1, duration: 0.5, type: 'spring' }}
                                                className="w-full bg-gradient-to-t from-primary/50 to-primary rounded-t-md relative group opacity-80 hover:opacity-100 transition-opacity"
                                            >
                                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-popover px-2 py-0.5 rounded shadow-sm">{h}m</div>
                                            </motion.div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between mt-2 text-[10px] text-muted-foreground font-medium uppercase">
                                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* MODAL */}
                        {showModal && (
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-20">
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="bg-card border border-border p-6 rounded-2xl w-3/4 shadow-2xl"
                                >
                                    <h3 className="font-bold mb-4">Create New Task</h3>
                                    <div className="h-10 border-2 border-primary/50 rounded-lg bg-background px-3 flex items-center text-sm mb-4 shadow-sm">
                                        {inputValue}<span className="animate-pulse w-0.5 h-4 bg-primary ml-0.5"></span>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <div className="px-4 py-2 bg-muted rounded-lg text-xs font-bold">Cancel</div>
                                        <div className={`px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-bold transition-transform ${hoveredElement === 'create-task-confirm' ? 'scale-105 shadow-lg' : ''}`}>Create</div>
                                    </div>
                                </motion.div>
                            </div>
                        )}

                    </div>
                </div>

                {/* CURSOR */}
                <motion.div
                    animate={cursorControls}
                    className="absolute z-50 pointer-events-none drop-shadow-2xl"
                    style={{ left: 0, top: 0 }}
                >
                    <MousePointer2 className="w-8 h-8 fill-black text-white stroke-[1.5]" />
                </motion.div>

            </motion.div>
        </div>
    );
}

function SidebarIcon({ active, hover, icon }: { active: boolean, hover?: boolean, icon: React.ReactNode }) {
    return (
        <div className={`p-3 rounded-xl transition-all duration-300 ${active ? 'bg-primary text-primary-foreground shadow-lg scale-105' : 'text-muted-foreground hover:bg-muted'} ${hover ? 'bg-accent/20 text-accent scale-110' : ''}`}>
            {React.cloneElement(icon as React.ReactElement, { size: 20 })}
        </div>
    );
}
