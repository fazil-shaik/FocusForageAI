"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Brain, TrendingUp, Zap, Sparkles, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { generateWeeklyAIReport } from "@/app/(app)/dashboard/report";
import Link from "next/link";

interface WeeklyReportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function WeeklyReportModal({ isOpen, onClose }: WeeklyReportModalProps) {
    const [report, setReport] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            generateWeeklyAIReport().then(content => {
                setReport(content);
                setLoading(false);
            }).catch(err => {
                console.error(err);
                setLoading(false);
            });
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 md:p-10 pointer-events-none">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-xl pointer-events-auto"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-2xl bg-[#0a0a0b] border border-white/10 shadow-[0_32px_128px_rgba(0,0,0,0.8)] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden flex flex-col pointer-events-auto max-h-[90vh]"
                    >
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />

                        {/* Header */}
                        <div className="p-5 sm:p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 rounded-xl sm:rounded-2xl flex items-center justify-center">
                                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Weekly Performance</h2>
                                    <p className="text-[10px] sm:text-xs text-muted-foreground font-bold uppercase tracking-widest opacity-60">Neural Impact Analysis</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 sm:p-3 hover:bg-white/5 rounded-xl sm:rounded-2xl transition-colors text-muted-foreground hover:text-white"
                            >
                                <X className="w-5 h-5 sm:w-6 sm:h-6" />
                            </button>
                        </div>

                        {/* Content Scroll Area */}
                        <div className="flex-1 overflow-y-auto p-5 sm:p-8 custom-scrollbar">
                            {loading ? (
                                <div className="h-64 flex flex-col items-center justify-center gap-4">
                                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-[0.2em] animate-pulse">Consulting AI Engine...</p>
                                </div>
                            ) : report ? (
                                <div className="space-y-6">
                                    <div className="prose prose-invert max-w-none">
                                        {report.split('\n').map((line, i) => {
                                            if (line.startsWith('#')) {
                                                return <h3 key={i} className="text-lg sm:text-xl font-black text-primary mt-6 mb-3 flex items-center gap-2">
                                                    <Brain className="w-5 h-5" /> {line.replace(/#/g, '').trim()}
                                                </h3>
                                            }
                                            if (line.startsWith('*') || line.startsWith('-')) {
                                                return <p key={i} className="flex items-start gap-3 text-sm sm:text-base text-zinc-300 mb-2 bg-white/[0.03] p-3 sm:p-4 rounded-xl border border-white/5">
                                                    <Zap className="w-4 h-4 text-secondary shrink-0 mt-1" />
                                                    {line.replace(/^[*|-]\s?/, '')}
                                                </p>
                                            }
                                            return <p key={i} className="text-sm sm:text-base text-zinc-400 mb-4 leading-relaxed">{line}</p>
                                        })}
                                    </div>

                                    {/* Action Footer Inside Modal */}
                                    <div className="pt-6 border-t border-white/5 flex justify-center">
                                        <button
                                            onClick={onClose}
                                            className="w-full py-4 bg-white text-black font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all text-sm uppercase tracking-widest"
                                        >
                                            Understood
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-muted-foreground">Neural sequence interrupted. Please try again.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
