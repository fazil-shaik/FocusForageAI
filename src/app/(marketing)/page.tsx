"use client";

import { motion } from "framer-motion";
import { ArrowRight, Star, Heart, Zap, Award, Sparkles, Check, Play } from "lucide-react";
import Link from "next/link";
import { BackgroundBeams } from "@/components/ui/background-beams";

const features = [
  {
    title: "Playful Productivity",
    description: "Who said work has to be boring? Turn your tasks into a game you actually want to play.",
    icon: <Star className="w-8 h-8 text-white" />,
    color: "bg-accent", // Pink
  },
  {
    title: "Cozy Focus",
    description: "Get comfortable with deep work. Our AI creates a safe, distraction-free bubble just for you.",
    icon: <Heart className="w-8 h-8 text-white" />,
    color: "bg-primary", // Orange
  },
  {
    title: "Magic Scheduling",
    description: "Our AI wizardry adapts your calendar based on your energy vibes. It's like magic!",
    icon: <Zap className="w-8 h-8 text-white" />,
    color: "bg-secondary", // Teal
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-sans">

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden">
        {/* Abstract Shapes Background */}
        <div className="absolute top-0 right-0 w-2/3 h-full bg-primary/5 dark:bg-primary/10 rounded-l-[10rem] -z-10 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-secondary/5 dark:bg-secondary/10 rounded-tr-[10rem] -z-10 translate-y-1/3"></div>

        <div className="container mx-auto px-6 relative z-10 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-8 leading-[1.1] text-foreground">
              Focus is <span className="text-primary italic relative">
                Fun
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary opacity-30" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                </svg>
              </span> Again.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
              The world's most friendly AI productivity coach. We turn your to-do list into a
              colorful playground of accomplishment.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup" className="px-10 py-5 rounded-full bg-primary text-primary-foreground font-bold text-xl hover:scale-105 transition-transform flex items-center gap-3 shadow-xl hover:shadow-2xl hover:bg-primary/90">
                Start Playing <Play className="w-5 h-5 fill-current" />
              </Link>
              <Link href="#demo" className="px-10 py-5 rounded-full bg-card border-2 border-border text-foreground font-bold text-xl hover:border-primary/50 transition-all">
                How it Works
              </Link>
            </div>
          </motion.div>

          {/* Hero Image / Visualization */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
            className="w-full max-w-5xl mt-12 relative"
          >
            <div className="bg-card rounded-3xl shadow-2xl overflow-hidden border-8 border-card">
              <div className="bg-muted aspect-video flex items-center justify-center relative overflow-hidden group">
                {/* Abstract representational UI */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5"></div>
                <div className="w-3/4 h-3/4 bg-card rounded-2xl shadow-lg relative z-10 flex flex-col p-6 items-center justify-center border border-border">
                  <div className="w-16 h-16 bg-primary rounded-full mb-4 animate-bounce flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">You're in the Zone!</h3>
                  <p className="text-muted-foreground">25 minutes of deep work remaining...</p>
                </div>

                {/* Floating blobs */}
                <div className="absolute top-10 right-10 w-24 h-24 bg-secondary/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute top-10 left-10 w-24 h-24 bg-primary/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-24 h-24 bg-accent/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid - "Playroom" Vibe */}
      <section id="features" className="py-24 bg-background relative">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">Built for Happy Brains</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Science says dopamine helps you focus. We just made it look good.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                whileHover={{ y: -10, transition: { duration: 0.2 } }}
                className="bg-card rounded-[2.5rem] p-10 hover:shadow-xl transition-shadow border border-border/50 hover:border-primary/20"
              >
                <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-8 shadow-md rotate-3 group-hover:rotate-6 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">{feature.title}</h3>
                <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* "Why It Works" Section - Friendly Layout */}
      <section className="py-24 bg-secondary/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full md:w-1/2"
            >
              <div className="relative">
                <div className="absolute top-0 left-0 w-full h-full bg-secondary rounded-[3rem] rotate-3 opacity-20"></div>
                <div className="bg-card rounded-[3rem] p-10 shadow-xl relative z-10 rotate-0 border border-border">
                  <h3 className="text-3xl font-bold mb-6 text-foreground">The "Nugget" of Productivity</h3>
                  <ul className="space-y-6">
                    <li className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center shrink-0 mt-1">
                        <Check className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-foreground">No More Burnout</h4>
                        <p className="text-muted-foreground">Our adaptive pacing prevents you from frying your circuits.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                        <Check className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-foreground">Kid-Brain Approved</h4>
                        <p className="text-muted-foreground">Simpler is better. We stripped away the clutter so you can just... go.</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-1">
                        <Check className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-foreground">Colorful Life</h4>
                        <p className="text-muted-foreground">Your planner shouldn't look like a spreadsheet. It should look like a party.</p>
                      </div>
                    </li>
                  </ul>
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
              <h2 className="text-4xl md:text-6xl font-bold mb-8 text-foreground leading-tight">
                We believe <br />
                productivity <br />
                should be <span className="text-secondary">cozy.</span>
              </h2>
              <p className="text-xl text-muted-foreground font-medium mb-8">
                Stop fighting your brain. Start working with it. FocusForge creates a digital environment that feels good to be in.
              </p>
              <Link href="/about" className="text-secondary font-bold text-xl hover:underline underline-offset-4 decoration-2">
                Read our philosophy &rarr;
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Big CTA */}
      <section className="py-32 bg-primary relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-6 text-center relative z-10"
        >
          <h2 className="text-4xl md:text-7xl font-bold text-primary-foreground mb-8 tracking-tight">
            Ready to build your<br />focus fort?
          </h2>
          <p className="text-2xl text-primary-foreground/90 mb-12 max-w-2xl mx-auto font-medium">
            Join thousands of happy brains finding their flow today.
          </p>
          <Link href="/signup" className="px-12 py-6 rounded-full bg-background text-primary font-bold text-2xl hover:scale-105 transition-transform inline-flex items-center gap-3 shadow-2xl">
            Get FocusForge Free
          </Link>
        </motion.div>

        {/* Decorative Circles */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3"></div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-background border-t border-border">
        <div className="container mx-auto px-6 text-center text-muted-foreground font-medium">
          <p>&copy; 2026 FocusForge AI. Made with 🧡 and 🧠.</p>
        </div>
      </footer>
    </div>
  );
}
