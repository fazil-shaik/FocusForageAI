"use client";

import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { Play, CheckCircle, Plus, Brain, MousePointer2, LayoutDashboard, ListTodo, BarChart3, Calendar, TrendingUp, Zap, Activity, CreditCard, Lock, User, ArrowRight, ShieldCheck, Clock, Target } from "lucide-react";
import React, { useState, useEffect } from "react";

export function HeroDemo() {
    const [activeView, setActiveView] = useState<"login" | "dashboard" | "tasks" | "analytics">("login");
    const [isPlaying, setIsPlaying] = useState(false);
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [tasks, setTasks] = useState([
        { id: 1, title: "Design Landing Page", priority: "High", status: "todo" },
        { id: 2, title: "Implement Auth Flow", priority: "Medium", status: "todo" },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [emailInput, setEmailInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [showModal, setShowModal] = useState(false);

    // Interaction States
    const [hoveredElement, setHoveredElement] = useState<string | null>(null);

    // Animation controls
    const cursorControls = useAnimation();
    const buttonControls = useAnimation();

    // Simulation Sequence
    useEffect(() => {
        let mounted = true;

        const typeText = async (text: string, setter: (s: string) => void) => {
            for (let i = 0; i <= text.length; i++) {
                if (!mounted) return;
                setter(text.slice(0, i));
                await new Promise(r => setTimeout(r, 40 + Math.random() * 40));
            }
        };

        const sequence = async () => {
            if (!mounted) return;

            // --- RESET ---
            setActiveView("login");
            setIsPlaying(false);
            setTimeLeft(25 * 60);
            setTasks([
                { id: 1, title: "Design Landing Page", priority: "High", status: "todo" },
                { id: 2, title: "Implement Auth Flow", priority: "Medium", status: "todo" },
            ]);
            setInputValue("");
            setEmailInput("");
            setPasswordInput("");
            setShowModal(false);
            setHoveredElement(null);
            await cursorControls.set({ x: 0, y: 0, opacity: 0 });

            await new Promise(r => setTimeout(r, 1000));

            // 1. LOGIN
            await cursorControls.start({ opacity: 1, x: 100, y: 100, transition: { duration: 0.5 } });
            await cursorControls.start({ x: 450, y: 300, transition: { duration: 0.8, ease: "easeInOut" } });
            await typeText("hello@focusforge.ai", setEmailInput);
            await cursorControls.start({ x: 450, y: 380, transition: { duration: 0.4 } });
            await typeText("********", setPasswordInput);
            await cursorControls.start({ x: 450, y: 460, transition: { duration: 0.4 } });
            setHoveredElement("login-btn");
            await new Promise(r => setTimeout(r, 300));
            await buttonControls.start({ scale: 0.95 });
            await buttonControls.start({ scale: 1 });
            setHoveredElement(null);
            await new Promise(r => setTimeout(r, 600));
            setActiveView("dashboard");

            // 2. DASHBOARD
            await cursorControls.start({ x: 420, y: 380, transition: { duration: 1, ease: "circOut" } });
            setHoveredElement("play-btn");
            await new Promise(r => setTimeout(r, 200));
            await buttonControls.start({ scale: 0.9 });
            setIsPlaying(true);
            await buttonControls.start({ scale: 1 });
            setHoveredElement(null);
            await new Promise(r => setTimeout(r, 1500));

            // 3. TASKS
            await cursorControls.start({ x: 50, y: 250, transition: { duration: 0.7 } });
            setHoveredElement("nav-tasks");
            await new Promise(r => setTimeout(r, 300));
            setActiveView("tasks");
            setHoveredElement(null);
            await new Promise(r => setTimeout(r, 800));

            // Complete Task
            await cursorControls.start({ x: 300, y: 280, transition: { duration: 0.6 } });
            setHoveredElement("task-1");
            await new Promise(r => setTimeout(r, 400));
            setTasks(prev => prev.map(t => t.id === 1 ? { ...t, status: "done" } : t));
            setHoveredElement(null);
            await new Promise(r => setTimeout(r, 1000));

            // 4. ANALYTICS
            await cursorControls.start({ x: 50, y: 330, transition: { duration: 0.6 } });
            setHoveredElement("nav-analytics");
            await new Promise(r => setTimeout(r, 300));
            setActiveView("analytics");
            setHoveredElement(null);
            await new Promise(r => setTimeout(r, 4000));

            // LOOP
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
                setTimeLeft((prev) => Math.max(0, prev - 15));
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
        <div className="relative w-full max-w-5xl mx-auto mt-12 md:mt-20 select-none pointer-events-none px-4 md:px-0">
            {/* Ambient Background Glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-[2.5rem] md:rounded-[3rem] blur-3xl opacity-50 animate-pulse"></div>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="relative bg-[#0A0A0B] rounded-[2rem] md:rounded-[2.5rem] shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden border border-white/10 ring-1 ring-white/5 flex flex-col md:flex-row min-h-[450px] md:h-[600px] w-full"
            >
                {/* LOGIN OVERLAY */}
                <AnimatePresence>
                    {activeView === 'login' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="absolute inset-0 z-30 bg-[#0A0A0B] flex flex-col items-center justify-center p-12"
                        >
                            <div className="p-4 bg-primary/10 rounded-2xl mb-8 border border-primary/20">
                                <Brain className="w-12 h-12 text-primary fill-primary/20" />
                            </div>
                            <h2 className="text-3xl font-black text-foreground tracking-tight mb-10">FocusForageAI</h2>
                            <div className="w-full max-w-sm space-y-5">
                                <div className="space-y-2">
                                    <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Cognitive ID</div>
                                    <div className="h-14 rounded-2xl bg-white/5 border border-white/10 px-4 flex items-center text-sm font-medium text-foreground/80 shadow-inner">
                                        {emailInput}{!passwordInput && <span className="w-1.5 h-4 bg-primary ml-1 animate-pulse"></span>}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Access Protocol</div>
                                    <div className="h-14 rounded-2xl bg-white/5 border border-white/10 px-4 flex items-center text-sm font-medium text-foreground/80 shadow-inner">
                                        {passwordInput.replace(/./g, '•')}{passwordInput && <span className="w-1.5 h-4 bg-primary ml-1 animate-pulse"></span>}
                                    </div>
                                </div>
                                <motion.div
                                    animate={buttonControls}
                                    className={`h-14 bg-primary text-primary-foreground rounded-2xl font-black text-sm shadow-xl flex items-center justify-center transition-all ${hoveredElement === 'login-btn' ? 'scale-[1.02] shadow-primary/30' : ''}`}
                                >
                                    Log In ⚡
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* SIDEBAR */}
                <div className="hidden md:flex w-24 bg-card/30 border-r border-white/5 flex flex-col items-center py-10 gap-10 shrink-0">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                        <Brain className="w-7 h-7 text-primary fill-primary/20" />
                    </div>
                    <div className="flex flex-col gap-6 w-full px-5">
                        <NavIcon active={activeView === 'dashboard'} icon={<LayoutDashboard />} />
                        <NavIcon active={activeView === 'tasks'} icon={<ListTodo />} />
                        <NavIcon active={activeView === 'analytics'} icon={<BarChart3 />} />
                        <NavIcon active={false} icon={<Calendar />} />
                    </div>
                </div>

                {/* MOBILE TOP BAR (for demo visualization on mobile) */}
                <div className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-card/30">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20">
                        <Brain className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex gap-4">
                        <LayoutDashboard className={`w-5 h-5 ${activeView === 'dashboard' ? 'text-primary' : 'text-muted-foreground'}`} />
                        <ListTodo className={`w-5 h-5 ${activeView === 'tasks' ? 'text-primary' : 'text-muted-foreground'}`} />
                        <BarChart3 className={`w-5 h-5 ${activeView === 'analytics' ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                </div>

                {/* CONTENT AREA */}
                <div className="flex-1 p-6 md:p-10 flex flex-col min-h-0 bg-gradient-to-br from-background via-background to-primary/[0.02] overflow-hidden">
                    <header className="flex justify-between items-center mb-6 md:mb-10 shrink-0">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl md:text-3xl font-black tracking-tight flex items-center gap-2 md:gap-3">
                                {activeView === 'dashboard' && <><LayoutDashboard className="w-5 h-5 md:w-7 md:h-7 text-primary" /> Dashboard</>}
                                {activeView === 'tasks' && <><ListTodo className="w-5 h-5 md:w-7 md:h-7 text-primary" /> Tasks</>}
                                {activeView === 'analytics' && <><BarChart3 className="w-5 h-5 md:w-7 md:h-7 text-primary" /> Analytics</>}
                            </h2>
                        </div>
                        <div className="flex items-center gap-2 md:gap-4">
                            <div className="text-right hidden xs:block">
                                <div className="text-[8px] md:text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-0.5">Shaib P.</div>
                                <div className="text-[7px] md:text-[9px] font-black px-1.5 md:px-2 py-0.5 rounded-lg bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">Unlimited</div>
                            </div>
                            <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-[1.25rem] bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-black text-sm md:text-lg shadow-lg border border-white/10 ring-2 ring-white/5">SP</div>
                        </div>
                    </header>

                    <div className="relative flex-1 min-h-0">
                        {/* VIEW: DASHBOARD */}
                        {activeView === 'dashboard' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-8 h-full overflow-y-auto pr-1">
                                <div className="md:col-span-3 bg-card/60 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col items-center justify-center relative group p-6 md:p-10">
                                    <div className="absolute top-4 md:top-6 right-4 md:right-6 flex items-center gap-2 px-2 md:px-3 py-1 md:py-1.5 bg-primary/10 rounded-lg md:rounded-xl border border-primary/20">
                                        <Zap className="w-2.5 h-2.5 md:w-3 md:h-3 text-primary fill-current" />
                                        <span className="text-[7px] md:text-[9px] font-black text-primary tracking-widest uppercase">AI Optimal</span>
                                    </div>
                                    <div className={`text-5xl sm:text-6xl md:text-[7rem] font-black tabular-nums tracking-tighter leading-none mb-6 md:mb-10 ${isPlaying ? 'text-primary' : 'text-foreground'}`}>
                                        {formatTime(timeLeft)}
                                    </div>
                                    <motion.div
                                        animate={buttonControls}
                                        className={`w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-[2rem] flex items-center justify-center shadow-2xl transition-all ${isPlaying ? 'bg-secondary text-secondary-foreground rotate-90' : 'bg-primary text-primary-foreground'} ${hoveredElement === 'play-btn' ? 'scale-110 shadow-primary/40 ring-4 md:ring-8 ring-primary/10' : ''}`}
                                    >
                                        <Play className="w-6 h-6 md:w-8 md:h-8 fill-current" />
                                    </motion.div>
                                </div>
                                <div className="md:col-span-2 space-y-4 md:space-y-6">
                                    <div className="bg-card/40 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-white/10">
                                        <h4 className="text-[8px] md:text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 md:mb-4 flex items-center gap-2">
                                            <Activity className="w-3 md:w-4 md:h-4 text-primary" /> Cognitive Score
                                        </h4>
                                        <div className="text-3xl md:text-5xl font-black mb-2 md:mb-4 tracking-tight">92<span className="text-base md:text-xl text-muted-foreground font-medium ml-1">/100</span></div>
                                        <div className="h-2 md:h-2.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: "92%" }}
                                                className="h-full bg-gradient-to-r from-primary to-accent"
                                            />
                                        </div>
                                    </div>
                                    <div className="bg-primary/10 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-primary/20 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-4 opacity-5 md:opacity-10 group-hover:opacity-20 transition-opacity">
                                            <Brain className="w-8 h-8 md:w-12 md:h-12" />
                                        </div>
                                        <h4 className="text-[8px] md:text-[10px] font-black text-primary uppercase tracking-widest mb-1 md:mb-2 flex items-center gap-2">
                                            <Zap className="w-3 md:w-4 md:h-4" /> AI Reflection
                                        </h4>
                                        <p className="text-xs md:text-sm font-bold text-foreground leading-relaxed">
                                            Your neural bandwidth peaks at 11 AM.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* VIEW: TASKS */}
                        {activeView === 'tasks' && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="h-full flex flex-col gap-4 md:gap-6 overflow-y-auto pr-1">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div className="flex gap-2 md:gap-3">
                                        <span className="px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl bg-primary/20 text-primary text-[8px] md:text-[10px] font-black uppercase tracking-widest border border-primary/20 shadow-lg shadow-primary/10">Working</span>
                                        <span className="px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl bg-white/5 text-muted-foreground text-[8px] md:text-[10px] font-black uppercase tracking-widest border border-white/5">Archives</span>
                                    </div>
                                    <div className="px-4 md:px-5 py-2 md:py-2.5 bg-primary text-primary-foreground rounded-lg md:rounded-xl text-[8px] md:text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-primary/20">
                                        <Plus className="w-3 md:w-4 md:h-4" /> New Task
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-3 md:gap-4">
                                    {tasks.map((task, i) => (
                                        <motion.div
                                            key={task.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className={`p-4 md:p-6 rounded-[1.25rem] md:rounded-[1.75rem] border transition-all flex items-center justify-between group ${task.status === 'done' ? 'bg-green-500/10 border-green-500/20 opacity-60' : 'bg-card/40 border-white/10 hover:border-primary/40 shadow-xl'}`}
                                        >
                                            <div className="flex items-center gap-3 md:gap-4">
                                                <div className={`w-5 h-5 md:w-7 md:h-7 rounded-lg md:rounded-xl border-2 flex items-center justify-center transition-all ${task.status === 'done' ? 'bg-green-500 border-green-500' : 'border-primary/50 bg-primary/5'}`}>
                                                    {task.status === 'done' && <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-white" />}
                                                </div>
                                                <span className={`text-sm md:text-lg font-bold tracking-tight ${task.status === 'done' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                                    {task.title}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 md:gap-3">
                                                <span className={`text-[7px] md:text-[9px] px-2 md:px-3 py-0.5 md:py-1 rounded-md md:rounded-lg font-black uppercase tracking-[0.2em] ${task.priority === 'High' ? 'bg-red-500/20 text-red-500' : 'bg-primary/20 text-primary'}`}>
                                                    {task.priority}
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* VIEW: ANALYTICS */}
                        {activeView === 'analytics' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col gap-4 md:gap-8 overflow-y-auto pr-1">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6">
                                    <StatCard label="Total Focus" value="48h 20m" icon={<Clock className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />} />
                                    <StatCard label="Flow Cycles" value="142" icon={<Activity className="w-4 h-4 md:w-5 md:h-5 text-accent" />} />
                                    <StatCard label="Victory Rate" value="98%" icon={<Target className="w-4 h-4 md:w-5 md:h-5 text-primary" />} />
                                </div>
                                <div className="flex-1 bg-card/60 backdrop-blur-xl border border-white/10 rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-8 flex flex-col relative overflow-hidden shadow-2xl min-h-[200px]">
                                    <div className="flex justify-between items-start mb-6 md:mb-10">
                                        <h4 className="text-[8px] md:text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                                            <TrendingUp className="w-3 md:w-4 md:h-4 text-primary" /> Recovery Period
                                        </h4>
                                        <div className="flex gap-1.5 md:gap-2">
                                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary animate-pulse" />
                                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-accent" />
                                        </div>
                                    </div>
                                    <div className="flex-1 flex items-end justify-between gap-1 md:gap-4 px-1 md:px-2">
                                        {[45, 60, 35, 90, 55, 80, 65, 40, 75, 50, 95, 70].map((h, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ scaleY: 0 }}
                                                animate={{ scaleY: 1 }}
                                                transition={{ delay: i * 0.05, duration: 1, ease: "circOut" }}
                                                style={{ height: `${h}%` }}
                                                className="w-full bg-gradient-to-t from-primary/40 to-primary rounded-sm md:rounded-xl origin-bottom relative group"
                                            />
                                        ))}
                                    </div>
                                    <div className="flex justify-between mt-4 md:mt-8 text-[7px] md:text-[9px] text-muted-foreground/60 font-black uppercase tracking-[0.1em] md:tracking-[0.3em] px-1">
                                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* ANIMATED CURSOR */}
                <motion.div
                    animate={cursorControls}
                    className="absolute z-[100] pointer-events-none drop-shadow-[0_15px_15px_rgba(0,0,0,0.5)]"
                    style={{ left: 0, top: 0 }}
                >
                    <MousePointer2 className="w-10 h-10 fill-white text-black stroke-[2px]" />
                </motion.div>
            </motion.div>
        </div>
    );
}

function NavIcon({ active, icon }: { active: boolean, icon: React.ReactNode }) {
    return (
        <div className={`p-4 rounded-2xl transition-all duration-500 border ${active ? 'bg-primary text-primary-foreground shadow-2xl shadow-primary/40 border-primary scale-110' : 'text-muted-foreground border-transparent hover:bg-white/5 hover:border-white/10'}`}>
            {React.cloneElement(icon as React.ReactElement<any>, { size: 24, strokeWidth: active ? 2.5 : 2 })}
        </div>
    );
}

function StatCard({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
    return (
        <div className="bg-card/40 border border-white/10 p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] shadow-xl hover:border-primary/20 transition-all flex flex-col gap-2 md:gap-3 group">
            <div className="flex items-center justify-between">
                <span className="text-[8px] md:text-[9px] font-black text-muted-foreground uppercase tracking-[0.1em] md:tracking-[0.2em]">{label}</span>
                <div className="p-1.5 md:p-2 bg-white/5 rounded-lg md:rounded-xl group-hover:scale-110 transition-transform">{icon}</div>
            </div>
            <div className="text-xl md:text-3xl font-black tracking-tight text-foreground">{value}</div>
        </div>
    );
}
