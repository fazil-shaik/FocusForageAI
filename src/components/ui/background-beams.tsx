"use client";
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export const BackgroundBeams = ({ className }: { className?: string }) => {
    const beamsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!beamsRef.current) return;
        // Simple animation loop could go here if using Canvas
        // For now we use CSS generic animations
    }, []);

    return (
        <div
            className={cn(
                "absolute inset-0 overflow-hidden [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] pointer-events-none",
                className
            )}
        >
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[30rem] bg-purple-500/20 blur-[10rem] rounded-full mix-blend-screen opacity-50 animate-pulse" />
            <div className="absolute left-1/4 top-1/4 w-[40rem] h-[40rem] bg-blue-500/10 blur-[8rem] rounded-full mix-blend-screen opacity-30 animate-blob" />
            <div className="absolute right-1/4 bottom-1/4 w-[40rem] h-[40rem] bg-pink-500/10 blur-[8rem] rounded-full mix-blend-screen opacity-30 animate-blob animation-delay-2000" />

            {/* Grid */}
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        </div>
    );
};
