"use client";

import { motion } from "framer-motion";
import { Coffee, Brain, Sparkles, Heart, Zap, ShieldCheck } from "lucide-react";
import Link from "next/link";

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        },
    },
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background text-foreground overflow-hidden">
            {/* Hero Section */}
            <section className="relative py-24 md:py-32 container mx-auto px-6 text-center">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="max-w-3xl mx-auto"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", bounce: 0.5, duration: 1 }}
                        className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8"
                    >
                        <Coffee className="w-10 h-10 text-primary" />
                    </motion.div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                        Productivity shouldn't feel like <span className="text-primary italic">punishment.</span>
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        We're building a digital sanctuary where your brain feels safe, happy, and ready to create.
                        Welcome to the era of <strong>Cozy Productivity</strong>.
                    </p>
                </motion.div>

                {/* Floating Elements Background */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
                    <motion.div
                        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-20 left-[10%] w-32 h-32 bg-secondary/5 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
                        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute bottom-40 right-[10%] w-48 h-48 bg-primary/5 rounded-full blur-3xl"
                    />
                </div>
            </section>

            {/* Our Philosophy Grid */}
            <section className="py-24 bg-card border-y border-border/50">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
                    >
                        {/* Value 1 */}
                        <motion.div variants={fadeIn} className="flex flex-col gap-4">
                            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center dark:bg-orange-900/20">
                                <Brain className="w-6 h-6 text-orange-500" />
                            </div>
                            <h3 className="text-2xl font-bold">Brain-First Design</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Traditional tools are built for managers. FocusForge is built for <strong>your brain</strong>. We use neuroscience principles to reduce cognitive load and keep you in the flow state.
                            </p>
                        </motion.div>

                        {/* Value 2 */}
                        <motion.div variants={fadeIn} className="flex flex-col gap-4">
                            <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center dark:bg-pink-900/20">
                                <Heart className="w-6 h-6 text-pink-500" />
                            </div>
                            <h3 className="text-2xl font-bold">Kindness is Key</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Guilt doesn't work. Our AI doesn't nag; it nudges. We celebrate small wins and help you get back on track with compassion, not pressure.
                            </p>
                        </motion.div>

                        {/* Value 3 */}
                        <motion.div variants={fadeIn} className="flex flex-col gap-4">
                            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center dark:bg-purple-900/20">
                                <Sparkles className="w-6 h-6 text-purple-500" />
                            </div>
                            <h3 className="text-2xl font-bold">Playful by Default</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Who says software has to be sterile? We believe joy is a productivity multiplier. Expect colorful interactions, satisfying animations, and a bit of magic.
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-32 container mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="w-full md:w-1/2"
                >
                    <div className="relative aspect-square rounded-3xl overflow-hidden bg-muted">
                        {/* Abstract art representing the mission */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-background to-secondary/20 flex items-center justify-center">
                            <ShieldCheck className="w-32 h-32 text-muted-foreground/20" />
                        </div>
                        <div className="absolute bottom-8 left-8 right-8 p-6 bg-background/80 backdrop-blur-md rounded-2xl border border-border shadow-lg">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                                    AI
                                </div>
                                <div>
                                    <p className="font-bold text-sm">FocusForge Genius</p>
                                    <p className="text-xs text-muted-foreground">Your personal cheerleader</p>
                                </div>
                            </div>
                            <p className="text-sm italic text-muted-foreground">"You're doing great! Let's tackle this next task together."</p>
                        </div>
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="w-full md:w-1/2"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">Built for the <br /><span className="text-secondary">Overwhelmed</span></h2>
                    <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                        We started FocusForge because we were tired of productivity apps that felt like spreadsheets. We wanted a tool that felt like a warm cup of coffee on a rainy day.
                    </p>
                    <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                        Our mission is simple: <strong>To help 1 million people fall in love with their work again.</strong>
                    </p>
                    <Link href="/signup" className="inline-flex items-center px-8 py-4 rounded-full bg-foreground text-background font-bold text-lg hover:opacity-90 transition-opacity">
                        Join the Movement <Zap className="ml-2 w-5 h-5" />
                    </Link>
                </motion.div>
            </section>
        </div>
    );
}
