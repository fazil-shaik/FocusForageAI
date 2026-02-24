"use client";

import { useEffect, useState } from "react";

interface GreetingProps {
    userName: string;
}

export function Greeting({ userName }: GreetingProps) {
    const [greeting, setGreeting] = useState("Hello");

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) {
            setGreeting("Good morning");
        } else if (hour < 17) {
            setGreeting("Good afternoon");
        } else if (hour < 21) {
            setGreeting("Good evening");
        } else {
            setGreeting("Good night");
        }
    }, []);

    return (
        <h1 className="text-4xl font-extrabold text-foreground tracking-tight mb-2">
            {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">{userName}</span>
        </h1>
    );
}
