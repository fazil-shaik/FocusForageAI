"use client";

import { useState } from "react";
import Link from "next/link";
import { DailyReportModal } from "@/components/DailyReportModal";

export function DashboardControls() {
    const [isReportOpen, setIsReportOpen] = useState(false);

    return (
        <div className="flex gap-4">
            <button
                onClick={() => setIsReportOpen(true)}
                className="px-4 py-2 bg-card border border-border rounded-lg text-sm text-foreground hover:bg-secondary/10 transition-colors shadow-sm"
            >
                Daily Report
            </button>
            <Link href="/tasks" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:opacity-90 transition-all shadow-md flex items-center">
                + New Task
            </Link>

            <DailyReportModal
                isOpen={isReportOpen}
                onClose={() => setIsReportOpen(false)}
            />
        </div>
    );
}
