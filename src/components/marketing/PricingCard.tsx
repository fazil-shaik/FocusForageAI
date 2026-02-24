"use client";

import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";

interface PricingCardProps {
    title: string;
    price: string;
    description: string;
    features: string[];
    isPro?: boolean;
    onSelect?: () => void;
    isLoading?: boolean;
}

export function PricingCard({ title, price, description, features, isPro = false, onSelect, isLoading = false }: PricingCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -5 }}
            className={`relative rounded-3xl p-8 border ${isPro
                ? "bg-card border-primary ring-2 ring-primary/20 shadow-2xl shadow-primary/10"
                : "bg-card/50 border-border shadow-lg"
                } flex flex-col h-full overflow-hidden`}
        >
            {isPro && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                    Recommended
                </div>
            )}

            <div className="mb-6">
                <h3 className={`text-2xl font-bold mb-2 ${isPro ? "text-primary" : "text-foreground"}`}>{title}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-bold text-foreground">{price}</span>
                    {price !== "Free" && <span className="text-muted-foreground">/month</span>}
                </div>
                <p className="text-muted-foreground">{description}</p>
            </div>

            <div className="flex-1 mb-8">
                <ul className="space-y-4">
                    {features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm font-medium text-foreground/80">
                            <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${isPro ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                                <Check className="w-3 h-3" />
                            </div>
                            {feature}
                        </li>
                    ))}
                </ul>
            </div>

            <button
                onClick={onSelect}
                disabled={isLoading || (!isPro && onSelect === undefined)}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${isPro
                    ? "bg-primary text-primary-foreground hover:opacity-90 shadow-lg hover:shadow-primary/30 active:scale-95"
                    : "bg-secondary/10 text-foreground hover:bg-secondary/20"
                    } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
                {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                {isPro ? "Get Started" : "Current Plan"}
            </button>
        </motion.div>
    );
}
