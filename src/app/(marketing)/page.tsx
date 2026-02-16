"use client";

import { motion } from "framer-motion";
import { ArrowRight, Brain, Clock, Zap, Shield, Sparkles } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-pink-500/10 blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-sm text-purple-300 mb-6 backdrop-blur-md">
              ✨ The Future of Deep Work is Here
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
              Master Your Focus.<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                Destroy Procrastination.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Not just another timer. FocusForge is an AI-powered neuro-coach that learns your habits,
              predicts procrastination, and forces you into a flow state.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup" className="px-8 py-4 rounded-full bg-white text-black font-bold text-lg hover:bg-gray-200 transition-all flex items-center gap-2 group">
                Start For Free <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="#demo" className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-medium text-lg hover:bg-white/10 transition-all backdrop-blur-sm">
                Watch Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section id="features" className="py-20 bg-black/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Unlike Anything You've Used</h2>
            <p className="text-gray-400">Powered by behavioral psychology and advanced AI.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Large Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="md:col-span-2 p-8 rounded-3xl bg-neutral-900/50 border border-white/5 hover:border-purple-500/20 transition-all group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-6 text-purple-400">
                  <Brain className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-3">AI Procrastination Prediction</h3>
                <p className="text-gray-400 mb-6">
                  Our AI analyzes your mouse movements, tab switching, and typing speed to detect when you're about to procrastinate—before you even realize it.
                </p>
                <div className="h-40 bg-black/40 rounded-xl border border-white/5 flex items-center justify-center text-sm text-gray-600">
                  [AI Pattern Analysis Visualization]
                </div>
              </div>
            </motion.div>

            {/* Small Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-8 rounded-3xl bg-neutral-900/50 border border-white/5 hover:border-pink-500/20 transition-all relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center mb-6 text-pink-400">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Dopamine Control</h3>
                <p className="text-gray-400">
                  Smartly gates your distractions. Want to check Twitter? Earn it with 20 minutes of deep work first.
                </p>
              </div>
            </motion.div>

            {/* Small Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-8 rounded-3xl bg-neutral-900/50 border border-white/5 hover:border-blue-500/20 transition-all relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-6 text-blue-400">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">Adaptive Scheduling</h3>
                <p className="text-gray-400">
                  Dynamically adjusts your schedule based on your energy levels and task complexity.
                </p>
              </div>
            </motion.div>

            {/* Large Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="md:col-span-2 p-8 rounded-3xl bg-neutral-900/50 border border-white/5 hover:border-green-500/20 transition-all relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-6 text-green-400">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Strict Mode</h3>
                <p className="text-gray-400 mb-6">
                  Lock your browser, block apps, and prevent context switching. The nuclear option for when you need to ship.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust / Stats */}
      <section className="py-20 border-t border-white/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">The Productivity Revolution</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2">40%</div>
              <p className="text-gray-400">Increase in Deep Work Hours</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2">10k+</div>
              <p className="text-gray-400">Sessions Completed</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2">4.9/5</div>
              <p className="text-gray-400">User Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-900/20"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-8">Ready to reclaim your time?</h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Join the beta access list and get a personalized deep work productivity report.
          </p>
          <Link href="/signup" className="px-10 py-5 rounded-full bg-white text-black font-bold text-xl hover:scale-105 transition-transform inline-flex items-center gap-2">
            Get Started Now <Sparkles className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
