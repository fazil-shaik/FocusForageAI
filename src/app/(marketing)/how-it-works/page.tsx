"use client";

import { BackgroundBeams } from "@/components/ui/background-beams";
import { BrainCircuit, Zap, BarChart3, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HowItWorksPage() {
    const steps = [
        {
            id: 1,
            title: "Start a Focus Session",
            description: "Set your goal, block distractions, and enter a deep work state with our custom timer.",
            icon: <Zap className="w-8 h-8 text-primary" />,
        },
        {
            id: 2,
            title: "AI Analyzes Your Flow",
            description: "Our AI unobtrusively tracks your focus patterns, interruptions, and energy levels.",
            icon: <BrainCircuit className="w-8 h-8 text-purple-500" />,
        },
        {
            id: 3,
            title: "Get Actionable Insights",
            description: "Receive personalized recommendations to optimize your schedule and boost productivity.",
            icon: <BarChart3 className="w-8 h-8 text-blue-500" />,
        },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-hidden font-sans pt-20 pb-20">
            <BackgroundBeams className="opacity-20" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                            Master your <span className="text-primary">Workflow</span>.
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            FocusForge AI isn't just a timer. It's an intelligent system that learns how you work best.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto mb-24">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2, duration: 0.5 }}
                            className="relative group"
                        >
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative bg-card border border-border/50 p-8 rounded-3xl h-full shadow-lg hover:border-primary/50 transition-colors">
                                <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                                    {step.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                                    <span className="text-muted-foreground/30 text-4xl font-black absolute top-6 right-6">{step.id}</span>
                                    {step.title}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <div className="inline-block p-1 rounded-full bg-gradient-to-r from-primary to-purple-500 mb-8">
                        <div className="bg-background rounded-full px-6 py-2 text-sm font-bold">
                            Ready to optimize your brain?
                        </div>
                    </div>
                    <br />
                    <Link
                        href="/signup"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground text-lg font-bold hover:shadow-lg hover:shadow-primary/25 hover:scale-105 transition-all duration-300"
                    >
                        Start Your Journey <ArrowRight className="w-5 h-5" />
                    </Link>
                </motion.div>

            </div>
        </div>
    );
}
