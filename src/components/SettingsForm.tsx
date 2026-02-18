"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { User, Bell, Shield, Smartphone, Monitor, Moon, Sun } from "lucide-react";
import { updateProfile, deleteAccount } from "../app/(app)/settings/actions";

type UserData = {
    name: string;
    email: string;
    image?: string | null;
    plan: string | null;
};

export function SettingsForm({ user }: { user: UserData }) {
    const { theme, setTheme } = useTheme();
    const [isLoading, setIsLoading] = useState(false);

    const handleProfileUpdate = async (formData: FormData) => {
        setIsLoading(true);
        await updateProfile(formData);
        setIsLoading(false);
        // Ideally show toast here
        alert("Profile updated!");
    };

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete your account? This cannot be undone.")) {
            await deleteAccount();
        }
    };

    return (
        <div className="space-y-8 max-w-4xl">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Settings</h1>

            {/* Profile Section */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-3xl p-6 shadow-sm"
            >
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-foreground">
                    <User className="w-5 h-5 text-primary" /> Profile
                </h2>
                <form action={handleProfileUpdate} className="grid gap-6 md:grid-cols-2">
                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-bold text-muted-foreground mb-2">Display Name</label>
                        <input
                            name="name"
                            defaultValue={user.name}
                            className="w-full bg-input border border-transparent rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none transition-all text-foreground placeholder:text-muted-foreground"
                        />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-bold text-muted-foreground mb-2">Email</label>
                        <input
                            disabled
                            value={user.email}
                            className="w-full bg-input border border-transparent rounded-xl p-3 text-muted-foreground cursor-not-allowed"
                        />
                    </div>
                    <div className="col-span-2 flex justify-end">
                        <button
                            disabled={isLoading}
                            className="px-6 py-2 bg-primary hover:opacity-90 text-primary-foreground rounded-full font-bold transition-all disabled:opacity-50 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                        >
                            {isLoading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </motion.div>

            {/* Appearance Section */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card border border-border rounded-3xl p-6 shadow-sm"
            >
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-foreground">
                    <Monitor className="w-5 h-5 text-blue-500" /> Appearance
                </h2>
                <div className="grid grid-cols-3 gap-4">
                    <button
                        onClick={() => setTheme("light")}
                        className={`p-4 rounded-2xl border flex flex-col items-center gap-3 transition-all ${theme === 'light' ? 'bg-primary/10 border-primary text-primary' : 'bg-input border-transparent hover:bg-secondary/10 text-muted-foreground hover:text-foreground'}`}
                    >
                        <Sun className="w-6 h-6" />
                        <span className="text-sm font-medium">Light</span>
                    </button>
                    <button
                        onClick={() => setTheme("dark")}
                        className={`p-4 rounded-2xl border flex flex-col items-center gap-3 transition-all ${theme === 'dark' ? 'bg-primary/10 border-primary text-primary' : 'bg-input border-transparent hover:bg-secondary/10 text-muted-foreground hover:text-foreground'}`}
                    >
                        <Moon className="w-6 h-6" />
                        <span className="text-sm font-medium">Dark</span>
                    </button>
                    <button
                        onClick={() => setTheme("system")}
                        className={`p-4 rounded-2xl border flex flex-col items-center gap-3 transition-all ${theme === 'system' ? 'bg-primary/10 border-primary text-primary' : 'bg-input border-transparent hover:bg-secondary/10 text-muted-foreground hover:text-foreground'}`}
                    >
                        <Monitor className="w-6 h-6" />
                        <span className="text-sm font-medium">System</span>
                    </button>
                </div>
            </motion.div>

            {/* Danger Zone */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-red-50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/20 rounded-3xl p-6"
            >
                <h2 className="text-xl font-bold mb-4 text-red-600 dark:text-red-400 flex items-center gap-2">
                    <Shield className="w-5 h-5" /> Danger Zone
                </h2>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-bold text-foreground">Delete Account</p>
                        <p className="text-sm text-muted-foreground">Permanently delete your account and all data.</p>
                    </div>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors font-bold text-sm"
                    >
                        Delete Account
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
