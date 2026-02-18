"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, MoreVertical, Trash, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { createTask, updateTaskStatus, deleteTask } from "./actions";

type Task = {
    id: string;
    title: string;
    description: string | null;
    status: string | null;
    priority: string | null;
    createdAt: Date | null;
};

export function TaskBoard({ initialTasks }: { initialTasks: Task[] }) {
    const [tasks, setTasks] = useState(initialTasks);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // Optimistic updates could be added here, but for now we rely on revalidation/props
    // or we can just manage local state and let the server catch up.
    // For "dynamic" feel, let's use the props passed down, but in a real app better to use useOptimistic.

    const columns = [
        { id: "todo", title: "To Do", color: "bg-red-500/10 text-red-500 border-red-500/20" },
        { id: "in_progress", title: "In Progress", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
        { id: "done", title: "Done", color: "bg-green-500/10 text-green-500 border-green-500/20" },
    ];

    const handleCreate = async (formData: FormData) => {
        setIsCreateOpen(false);
        await createTask(formData);
        // In a real app we'd refresh or update optimistic state.
        // Since we are using a client component initialized with server data,
        // we might need to router.refresh() to see changes if not using optimistic.
        // But for now let's hope revalidatePath works and nextjs updates the RSC payload.
        // Actually, we need to refresh the router to see the new data if passed as props.
        window.location.reload(); // Simple brute force for now, ideally use router.refresh()
    };

    // Better approach: use router.refresh()
    const handleStatusChange = async (taskId: string, newStatus: string) => {
        // Optimistic update
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
        await updateTaskStatus(taskId, newStatus);
    };

    const handleDelete = async (taskId: string) => {
        setTasks(prev => prev.filter(t => t.id !== taskId));
        await deleteTask(taskId);
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Task Flow</h1>
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                    <Plus className="w-4 h-4" /> New Task
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full overflow-x-auto pb-10">
                {columns.map(col => (
                    <div key={col.id} className="flex flex-col h-full min-h-[500px] bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
                        <div className={`flex items-center justify-between p-3 rounded-xl mb-4 border ${col.color}`}>
                            <span className="font-semibold">{col.title}</span>
                            <span className="text-xs font-bold px-2 py-1 bg-black/20 rounded-full">
                                {tasks.filter(t => (t.status || "todo") === col.id).length}
                            </span>
                        </div>

                        <div className="flex-1 space-y-3 overflow-y-auto">
                            <AnimatePresence>
                                {tasks.filter(t => (t.status || "todo") === col.id).map(task => (
                                    <TaskCard
                                        key={task.id}
                                        task={task}
                                        onStatusChange={handleStatusChange}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </AnimatePresence>
                            {tasks.filter(t => (t.status || "todo") === col.id).length === 0 && (
                                <div className="text-center text-gray-500 py-10 text-sm italic">
                                    No tasks here
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Task Modal */}
            {isCreateOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-zinc-900 border border-white/10 p-6 rounded-2xl w-full max-w-md shadow-2xl"
                    >
                        <h2 className="text-xl font-bold mb-4">Create New Task</h2>
                        <form action={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Title</label>
                                <input name="title" required className="w-full bg-black/50 border border-white/10 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 outline-none" placeholder="What needs to be done?" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Description</label>
                                <textarea name="description" className="w-full bg-black/50 border border-white/10 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 outline-none" rows={3} placeholder="Add details..." />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Priority</label>
                                <select name="priority" className="w-full bg-black/50 border border-white/10 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 outline-none">
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setIsCreateOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium">Create Task</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

function TaskCard({ task, onStatusChange, onDelete }: { task: Task, onStatusChange: (id: string, status: string) => void, onDelete: (id: string) => void }) {
    const priorityColors = {
        low: "text-blue-400",
        medium: "text-yellow-400",
        high: "text-red-400"
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-black/40 border border-white/5 p-4 rounded-xl group hover:border-purple-500/30 transition-all hover:shadow-[0_0_15px_rgba(168,85,247,0.1)]"
        >
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-white">{task.title}</h3>
                <div className="relative">
                    <button onClick={() => onDelete(task.id)} className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {task.description && (
                <p className="text-sm text-gray-400 mb-3 line-clamp-2">{task.description}</p>
            )}

            <div className="flex items-center justify-between mt-2">
                <div className={`text-xs font-medium capitalize flex items-center gap-1 ${priorityColors[task.priority as keyof typeof priorityColors] || "text-gray-400"}`}>
                    <AlertCircle className="w-3 h-3" />
                    {task.priority}
                </div>

                <div className="flex gap-1">
                    {/* Quick Actions moved to hover or a menu ideally */}
                    {task.status !== 'done' && (
                        <button onClick={() => onStatusChange(task.id, 'done')} title="Mark Done" className="p-1 hover:bg-green-500/20 rounded text-gray-500 hover:text-green-500">
                            <CheckCircle className="w-4 h-4" />
                        </button>
                    )}
                    {task.status === 'todo' && (
                        <button onClick={() => onStatusChange(task.id, 'in_progress')} title="Start" className="p-1 hover:bg-yellow-500/20 rounded text-gray-500 hover:text-yellow-500">
                            <Clock className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
