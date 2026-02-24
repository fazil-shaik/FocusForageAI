"use client";

import { useState } from "react";
import Link from "next/link";
import { DailyReportModal } from "@/components/DailyReportModal";
import { WeeklyReportModal } from "@/components/WeeklyReportModal";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function DashboardControls({ userPlan }: { userPlan: string }) {
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [isWeeklyOpen, setIsWeeklyOpen] = useState(false);
    const router = useRouter();

    const handleWeeklyReport = () => {
        setIsWeeklyOpen(true);
    };

    return (
        <div className="flex items-center gap-3">
            <button
                onClick={() => setIsReportOpen(true)}
                className="px-5 py-2.5 bg-secondary/10 hover:bg-secondary/20 border border-border rounded-xl text-xs font-bold transition-all hover:translate-y-[-1px] active:translate-y-0"
            >
                Daily Report
            </button>
            <button
                onClick={handleWeeklyReport}
                className="px-5 py-2.5 bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary rounded-xl text-xs font-black transition-all hover:translate-y-[-1px] active:translate-y-0 flex items-center gap-2"
            >
                Weekly AI ⚡
            </button>
            <Link href="/tasks" className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-105 transition-all active:scale-95 flex items-center gap-2">
                <span className="text-lg leading-none">+</span> New Task
            </Link>

            <DailyReportModal
                isOpen={isReportOpen}
                onClose={() => setIsReportOpen(false)}
            />

            <WeeklyReportModal
                isOpen={isWeeklyOpen}
                onClose={() => setIsWeeklyOpen(false)}
            />
        </div>
    );
}
