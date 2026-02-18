"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { User, Bell, Shield, Smartphone, Monitor, Moon, Sun } from "lucide-react";
import { updateProfile, deleteAccount } from "./actions";

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
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Settings</h1>

            {/* Profile Section */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
            >
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <User className="w-5 h-5 text-purple-500" /> Profile
                </h2>
                <form action={handleProfileUpdate} className="grid gap-6 md:grid-cols-2">
                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm text-gray-400 mb-2">Display Name</label>
                        <input
                            name="name"
                            defaultValue={user.name}
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                        />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm text-gray-400 mb-2">Email</label>
                        <input
                            disabled
                            value={user.email}
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-gray-500 cursor-not-allowed"
                        />
                    </div>
                    <div className="col-span-2 flex justify-end">
                        <button
                            disabled={isLoading}
                            className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
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
                className="bg-zinc-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
            >
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <Monitor className="w-5 h-5 text-blue-500" /> Appearance
                </h2>
                <div className="grid grid-cols-3 gap-4">
                    <button
                        onClick={() => setTheme("light")}
                        className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${theme === 'light' ? 'bg-purple-500/10 border-purple-500' : 'bg-black/20 border-white/5 hover:bg-white/5'}`}
                    >
                        <Sun className="w-6 h-6" />
                        <span className="text-sm">Light</span>
                    </button>
                    <button
                        onClick={() => setTheme("dark")}
                        className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${theme === 'dark' ? 'bg-purple-500/10 border-purple-500' : 'bg-black/20 border-white/5 hover:bg-white/5'}`}
                    >
                        <Moon className="w-6 h-6" />
                        <span className="text-sm">Dark</span>
                    </button>
                    <button
                        onClick={() => setTheme("system")}
                        className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${theme === 'system' ? 'bg-purple-500/10 border-purple-500' : 'bg-black/20 border-white/5 hover:bg-white/5'}`}
                    >
                        <Monitor className="w-6 h-6" />
                        <span className="text-sm">System</span>
                    </button>
                </div>
            </motion.div>

            {/* Danger Zone */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6 backdrop-blur-sm"
            >
                <h2 className="text-xl font-semibold mb-4 text-red-500 flex items-center gap-2">
                    <Shield className="w-5 h-5" /> Danger Zone
                </h2>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium">Delete Account</p>
                        <p className="text-sm text-gray-500">Permanently delete your account and all data.</p>
                    </div>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors font-medium text-sm"
                    >
                        Delete Account
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
