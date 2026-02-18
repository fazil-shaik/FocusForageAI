"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useState, useRef } from "react";

export function HeroVideo() {
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handlePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div className="relative w-full max-w-5xl mx-auto mt-12">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-[2rem] blur opacity-30 animate-tilt"></div>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
                className="relative bg-card rounded-[2rem] shadow-2xl overflow-hidden border-4 border-card/50 ring-1 ring-white/10"
            >
                <div className="relative aspect-video group cursor-pointer" onClick={handlePlay}>
                    {!isPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10 transition-opacity group-hover:bg-black/30">
                            <div className="w-20 h-20 bg-primary/90 text-primary-foreground rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm transform transition-all duration-300 group-hover:scale-110 group-hover:bg-primary">
                                <Play className="w-8 h-8 fill-current ml-1" />
                            </div>
                            <p className="absolute bottom-8 text-white font-medium text-lg tracking-wide bg-black/50 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
                                Watch how it works
                            </p>
                        </div>
                    )}

                    <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        poster="https://images.unsplash.com/photo-1616469829581-73993eb86b02?q=80&w=2070&auto=format&fit=crop" // Nice productive desk setup
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onClick={(e) => {
                            // Prevent clicking the video from pausing if we want strictly the overlay to handle it, 
                            // but usually clicking video to pause is expected.
                            // We'll let the parent div handle the click.
                        }}
                        controls={isPlaying} // Show controls only when playing
                    >
                        <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            </motion.div>

            {/* Decorative elements around the video to make it "nice" */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/20 rounded-full blur-3xl -z-10"></div>
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-secondary/20 rounded-full blur-3xl -z-10"></div>
        </div>
    );
}
