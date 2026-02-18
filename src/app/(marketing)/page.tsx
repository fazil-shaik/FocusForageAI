"use client";

import { motion } from "framer-motion";

import { ArrowRight, Brain, Clock, Zap, Shield, Sparkles } from "lucide-react";
import Link from "next/link";
import { BackgroundBeams } from "@/components/ui/background-beams";


export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-purple-500/30 overflow-x-hidden transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative pt-32 pb-32 flex flex-col items-center justify-center min-h-[90vh]">
        <BackgroundBeams />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-purple-500/10 border border-purple-500/20 text-sm text-purple-600 dark:text-purple-300 mb-6 backdrop-blur-md">
              ✨ The Future of Deep Work is Here
            </span>
            <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-8 max-w-4xl mx-auto leading-none">
              Master Your Focus.<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 dark:from-purple-400 dark:via-pink-500 dark:to-red-500">
                Destroy Procrastination.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Not just another timer. FocusForge is an AI-powered neuro-coach that learns your habits,
              predicts procrastination, and forces you into a flow state.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup" className="px-8 py-4 rounded-full bg-foreground text-background font-bold text-lg hover:opacity-90 transition-all flex items-center gap-2 group shadow-xl">
                Start For Free <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="#demo" className="px-8 py-4 rounded-full bg-secondary/50 border border-border text-foreground font-medium text-lg hover:bg-secondary transition-all backdrop-blur-sm">
                Watch Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section id="features" className="py-24 bg-secondary/20 dark:bg-black/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Unlike Anything You've Used</h2>
            <p className="text-muted-foreground text-lg">Powered by behavioral psychology and advanced AI.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Large Card */}
            <motion.div
              whileHover={{ y: -5 }}
              className="md:col-span-2 p-8 rounded-3xl bg-background/50 border border-border hover:border-purple-500/50 transition-all group overflow-hidden relative shadow-lg dark:shadow-none"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400">
                  <Brain className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-3">AI Procrastination Prediction</h3>
                <p className="text-muted-foreground mb-6">
                  Our AI analyzes your mouse movements, tab switching, and typing speed to detect when you're about to procrastinate—before you even realize it.
                </p>
                <div className="h-40 bg-secondary/50 rounded-xl border border-border flex items-center justify-center text-sm text-muted-foreground">
                  [AI Pattern Analysis Visualization]
                </div>
              </div>
            </motion.div>

            {/* Small Card */}
            <motion.div
              whileHover={{ y: -5 }}
              className="p-8 rounded-3xl bg-background/50 border border-border hover:border-pink-500/50 transition-all relative overflow-hidden group shadow-lg dark:shadow-none"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center mb-6 text-pink-600 dark:text-pink-400">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Dopamine Control</h3>
                <p className="text-muted-foreground">
                  Smartly gates your distractions. Want to check Twitter? Earn it with 20 minutes of deep work first.
                </p>
              </div>
            </motion.div>

            {/* Small Card */}
            <motion.div
              whileHover={{ y: -5 }}
              className="p-8 rounded-3xl bg-background/50 border border-border hover:border-blue-500/50 transition-all relative overflow-hidden group shadow-lg dark:shadow-none"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Adaptive Scheduling</h3>
                <p className="text-muted-foreground">
                  Dynamically adjusts your schedule based on your energy levels and task complexity.
                </p>
              </div>
            </motion.div>

            {/* Large Card */}
            <motion.div
              whileHover={{ y: -5 }}
              className="md:col-span-2 p-8 rounded-3xl bg-background/50 border border-border hover:border-green-500/50 transition-all relative overflow-hidden group shadow-lg dark:shadow-none"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-6 text-green-600 dark:text-green-400">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Strict Mode</h3>
                <p className="text-muted-foreground mb-6">
                  Lock your browser, block apps, and prevent context switching. The nuclear option for when you need to ship.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust / Stats */}
      <section className="py-20 border-t border-border bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">The Productivity Revolution</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2">40%</div>
              <p className="text-muted-foreground">Increase in Deep Work Hours</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2">10k+</div>
              <p className="text-muted-foreground">Sessions Completed</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2">4.9/5</div>
              <p className="text-muted-foreground">User Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 relative overflow-hidden bg-background">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-900/10 pointer-events-none"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-8">Ready to reclaim your time?</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join the beta access list and get a personalized deep work productivity report.
          </p>
          <Link href="/signup" className="px-10 py-5 rounded-full bg-foreground text-background font-bold text-xl hover:scale-105 transition-transform inline-flex items-center gap-2 shadow-2xl">
            Get Started Now <Sparkles className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
