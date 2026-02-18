"use client";

import { motion, useAnimation } from "framer-motion";
import { Play, CheckCircle, Plus, BrainCircuit, MousePointer2 } from "lucide-react";
import { useState, useEffect } from "react";

export function HeroDemo() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [taskStatus, setTaskStatus] = useState<"todo" | "in_progress" | "done">("todo");

    // Animation controls
    const cursorControls = useAnimation();
    const buttonControls = useAnimation();

    // Simulation Sequence
    useEffect(() => {
        const sequence = async () => {
            // Reset state
            setIsPlaying(false);
            setTimeLeft(25 * 60);
            setTaskStatus("todo");
            await cursorControls.start({ x: 0, y: 0, opacity: 0 });

            // Delay start
            await new Promise(r => setTimeout(r, 1000));

            // 1. Move cursor to "Start Focus" button
            await cursorControls.start({ opacity: 1, x: 20, y: 30, transition: { duration: 0.5 } }); // Initial position
            await cursorControls.start({ x: 260, y: 160, transition: { duration: 1.5, ease: "easeInOut" } }); // Move to button

            // 2. Click "Start"
            await buttonControls.start({ scale: 0.9 });
            await new Promise(r => setTimeout(r, 150));
            await buttonControls.start({ scale: 1 });
            setIsPlaying(true);
            setTaskStatus("in_progress");

            // 3. Timer counts down (simulated fast forward)
            const duration = 2000; // 2 seconds of "focus"
            const startTime = Date.now();
            while (Date.now() - startTime < duration) {
                setTimeLeft(prev => Math.max(0, prev - 15)); // Fast decrement
                await new Promise(r => setTimeout(r, 50));
            }

            // 4. Move cursor to "Complete Task" (simulated task item click)
            await cursorControls.start({ x: 450, y: 60, transition: { duration: 1 } });

            // 5. Click "Complete"
            setTaskStatus("done");
            setIsPlaying(false);

            // 6. Celebration / Wait / Loop
            await new Promise(r => setTimeout(r, 2000));

            // Loop
            sequence();
        };

        sequence();
    }, [cursorControls, buttonControls]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="relative w-full max-w-5xl mx-auto mt-12 select-none pointer-events-none">
            {/* Glow Effects */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-[2rem] blur opacity-30 animate-tilt"></div>

            {/* Main Container */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="relative bg-card rounded-[2rem] shadow-2xl overflow-hidden border-4 border-card/50 ring-1 ring-white/10 aspect-video flex"
            >
                {/* Sidebar (Mock) */}
                <div className="w-16 md:w-64 bg-muted/30 border-r border-border p-6 flex flex-col gap-6 hidden md:flex">
                    <div className="h-8 w-8 bg-primary rounded-lg"></div>
                    <div className="space-y-4 mt-4">
                        <div className="h-4 w-3/4 bg-foreground/10 rounded"></div>
                        <div className="h-4 w-1/2 bg-foreground/10 rounded"></div>
                        <div className="h-4 w-5/6 bg-foreground/10 rounded"></div>
                    </div>
                    <div className="mt-auto">
                        <div className="h-8 w-8 rounded-full bg-secondary/20"></div>
                    </div>
                </div>

                {/* Dashboard Area */}
                <div className="flex-1 p-8 flex flex-col gap-8 bg-background/50">

                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <div>
                            <div className="h-8 w-48 bg-foreground/10 rounded mb-2"></div>
                            <p className="text-muted-foreground text-sm">Focus Score: 85/100</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-accent/20"></div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 h-full">

                        {/* Focus Timer Card */}
                        <div className="col-span-1 bg-card border border-border rounded-3xl p-6 flex flex-col items-center justify-center relative shadow-sm">
                            <div className={`text-5xl font-bold tabular-nums mb-4 tracking-tighter ${isPlaying ? 'text-primary' : 'text-foreground'} transition-colors duration-500`}>
                                {formatTime(timeLeft)}
                            </div>
                            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-8">Deep Work Session</div>

                            <motion.button
                                animate={buttonControls}
                                className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors shadow-lg ${isPlaying ? 'bg-secondary text-secondary-foreground' : 'bg-primary text-primary-foreground'}`}
                            >
                                <Play className={`w-6 h-6 fill-current ${isPlaying ? 'opacity-50' : ''}`} />
                            </motion.button>

                            {isPlaying && (
                                <motion.div
                                    layoutId="focus-ring"
                                    className="absolute inset-0 border-4 border-primary/20 rounded-3xl"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                />
                            )}
                        </div>

                        {/* Tasks Panel */}
                        <div className="col-span-1 space-y-4">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-bold">Up Next</h3>
                                <Plus className="w-5 h-5 text-muted-foreground" />
                            </div>

                            {/* Active Task */}
                            <motion.div
                                layout
                                className={`p-4 rounded-xl border transition-all ${taskStatus === 'in_progress' ? 'bg-primary/5 border-primary shadow-md' : 'bg-card border-border'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${taskStatus === 'done' ? 'bg-green-500 border-green-500' : 'border-primary'}`}>
                                        {taskStatus === 'done' && <CheckCircle className="w-3 h-3 text-white" />}
                                    </div>
                                    <div className="flex-1">
                                        <div className={`font-medium text-sm ${taskStatus === 'done' ? 'line-through text-muted-foreground' : ''}`}>Finish Landing Page Design</div>
                                        <div className="text-xs text-muted-foreground mt-1">High Priority • 25m</div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Other Tasks */}
                            <div className="p-4 rounded-xl border border-border bg-card/50 opacity-50">
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full border-2 border-muted-foreground"></div>
                                    <div className="h-4 w-24 bg-foreground/10 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating Cursor */}
                <motion.div
                    animate={cursorControls}
                    className="absolute z-50 pointer-events-none drop-shadow-xl"
                    style={{ left: 0, top: 0 }}
                >
                    <MousePointer2 className="w-6 h-6 fill-black text-white stroke-[1.5]" />
                    <div className="ml-4 mt-2 bg-black/80 text-white text-[10px] px-2 py-1 rounded-md backdrop-blur-sm whitespace-nowrap">
                        User
                    </div>
                </motion.div>

            </motion.div>

            {/* Playful elements outside */}
            <div className="absolute -right-8 top-1/2 bg-yellow-400 w-16 h-16 rounded-full blur-2xl opacity-20 animate-pulse"></div>
        </div>
    );
}
