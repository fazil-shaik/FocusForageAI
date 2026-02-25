"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash, CheckCircle, Clock, AlertCircle, GripVertical } from "lucide-react";
import { createTask, updateTaskStatus, deleteTask } from "@/app/(app)/tasks/actions";
import { toast } from "sonner";
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
    defaultDropAnimationSideEffects,
    DropAnimation,
    useDroppable,
} from "@dnd-kit/core";
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Task = {
    id: string;
    title: string;
    description: string | null;
    status: string | null;
    priority: string | null;
    createdAt: Date | null;
};

const COLUMNS = [
    { id: "todo", title: "To Do", color: "bg-red-500/10 text-red-500 border-red-500/20" },
    { id: "in_progress", title: "In Progress", color: "bg-primary/10 text-primary border-primary/20" },
    { id: "done", title: "Done", color: "bg-green-500/10 text-green-500 border-green-500/20" },
];

export function TaskBoard({ initialTasks }: { initialTasks: Task[] }) {
    const [tasks, setTasks] = useState(initialTasks.filter(t => t.status !== 'done'));
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleCreate = async (formData: FormData) => {
        setIsCreateOpen(false);
        try {
            await createTask(formData);
            toast.success("Task created!");
            window.location.reload();
        } catch (error: any) {
            toast.error("Failed to create task.");
        }
    };

    const handleStatusChange = async (taskId: string, newStatus: string) => {
        if (newStatus === 'done') {
            setTasks(prev => prev.filter(t => t.id !== taskId));
            toast.success("Task completed and archived!");
        } else {
            setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
        }
        await updateTaskStatus(taskId, newStatus);
    };

    const handleDelete = async (taskId: string) => {
        setTasks(prev => prev.filter(t => t.id !== taskId));
        await deleteTask(taskId);
    };

    const findContainer = (id: string) => {
        if (COLUMNS.find(c => c.id === id)) return id;
        const task = tasks.find(t => t.id === id);
        return task?.status || "todo";
    };

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        const activeContainer = findContainer(activeId as string);
        const overContainer = findContainer(overId as string);

        if (!activeContainer || !overContainer || activeContainer === overContainer) {
            return;
        }

        setTasks((prev) => {
            return prev.map(t => {
                if (t.id === activeId) {
                    return { ...t, status: overContainer };
                }
                return t;
            });
        });
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        const activeId = active.id as string;
        const overId = over ? (over.id as string) : null;

        setActiveId(null);
        if (!overId) return;

        const overContainer = findContainer(overId);

        if (overContainer === 'done') {
            setTasks(prev => prev.filter(t => t.id !== activeId));
            toast.success("Task completed!");
            await updateTaskStatus(activeId, 'done');
            return;
        }

        const activeContainer = findContainer(activeId);
        if (activeContainer !== overContainer) {
            setTasks((prev) => prev.map(t => t.id === activeId ? { ...t, status: overContainer } : t));
            await updateTaskStatus(activeId, overContainer);
        }
    };

    const activeTask = tasks.find(t => t.id === activeId);

    return (
        <div className="h-full flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">Focus Tasks</h1>
                    <p className="text-sm text-muted-foreground font-medium">Drag, drop, and conquer your goals.</p>
                </div>
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="w-full sm:w-auto px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-xl shadow-primary/20 hover:scale-105 transition-transform border-none outline-none"
                >
                    <Plus className="w-4 h-4" /> Create Task
                </button>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full pb-10 min-h-0">
                    {COLUMNS.map(col => (
                        <DroppableColumn key={col.id} col={col} tasks={tasks} onDelete={handleDelete} onStatusChange={handleStatusChange} />
                    ))}
                </div>

                <DragOverlay>
                    {activeTask ? (
                        <div className="w-[280px] sm:w-[300px] md:w-[calc(100%/3-1.5rem)] scale-105 rotate-3 pointer-events-none">
                            <TaskCardContent
                                task={activeTask}
                                onDelete={handleDelete}
                                onStatusChange={handleStatusChange}
                                isOverlay
                            />
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>

            {isCreateOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-card border border-border p-6 md:p-8 rounded-3xl w-full max-w-md shadow-2xl"
                    >
                        <h2 className="text-xl font-black mb-6 text-foreground tracking-tight">Create New Task</h2>
                        <form action={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-[10px] uppercase font-black text-muted-foreground mb-1 tracking-widest">Title</label>
                                <input name="title" required className="w-full bg-secondary/20 border border-border/50 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none text-foreground font-bold" placeholder="What needs to be done?" />
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase font-black text-muted-foreground mb-1 tracking-widest">Description</label>
                                <textarea name="description" className="w-full bg-secondary/20 border border-border/50 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none text-foreground font-medium" rows={3} placeholder="Add details..." />
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase font-black text-muted-foreground mb-1 tracking-widest">Priority</label>
                                <select name="priority" className="w-full bg-secondary/20 border border-border/50 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none text-foreground font-bold">
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 mt-8">
                                <button type="button" onClick={() => setIsCreateOpen(false)} className="px-5 py-2 text-xs font-black uppercase text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20">Create Task</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

function DroppableColumn({ col, tasks, onDelete, onStatusChange }: { col: any, tasks: Task[], onDelete: (id: string) => void, onStatusChange: (id: string, status: string) => void }) {
    const { setNodeRef } = useDroppable({
        id: col.id,
    });

    const columnTasks = tasks.filter(t => (t.status || "todo") === col.id);

    return (
        <div ref={setNodeRef} className="flex flex-col h-full min-h-[400px] md:min-h-[500px] bg-card/50 rounded-3xl p-4 border border-border backdrop-blur-sm">
            <div className={`flex items-center justify-between p-3 rounded-2xl mb-4 border ${col.color}`}>
                <span className="font-black text-xs uppercase tracking-widest">{col.title}</span>
                <span className="text-[10px] font-black px-2 py-1 bg-background/50 rounded-full">
                    {columnTasks.length}
                </span>
            </div>

            <SortableContext
                id={col.id}
                items={columnTasks.map(t => t.id)}
                strategy={verticalListSortingStrategy}
            >
                <div className="flex-1 space-y-3 overflow-y-auto min-h-[100px]">
                    {columnTasks.map(task => (
                        <SortableTaskCard
                            key={task.id}
                            task={task}
                            onDelete={onDelete}
                            onStatusChange={onStatusChange}
                        />
                    ))}
                    {columnTasks.length === 0 && (
                        <div className="text-center text-muted-foreground/30 py-10 text-[10px] font-black uppercase tracking-widest">
                            Nothing here
                        </div>
                    )}
                </div>
            </SortableContext>
        </div>
    );
}

function SortableTaskCard({ task, onDelete, onStatusChange }: { task: Task, onDelete: (id: string) => void, onStatusChange: (id: string, status: string) => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none border-none outline-none">
            <TaskCardContent task={task} onDelete={onDelete} onStatusChange={onStatusChange} />
        </div>
    );
}

function TaskCardContent({ task, onDelete, onStatusChange, isOverlay }: { task: Task, onDelete: (id: string) => void, onStatusChange: (id: string, status: string) => void, isOverlay?: boolean }) {
    const priorityColors = {
        low: "text-blue-500 bg-blue-500/10",
        medium: "text-yellow-500 bg-yellow-500/10",
        high: "text-red-500 bg-red-500/10"
    };

    return (
        <div className={`bg-card border border-border p-4 rounded-2xl group hover:border-primary/30 transition-all ${isOverlay ? 'shadow-2xl ring-2 ring-primary/20' : 'hover:shadow-lg hover:shadow-primary/5'}`}>
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-black text-foreground text-sm tracking-tight truncate flex-1 pr-2">{task.title}</h3>
                <div className="relative flex gap-2">
                    {!isOverlay && (
                        <button onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); onDelete(task.id); }} className="text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity border-none outline-none p-1">
                            <Trash className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {task.description && (
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2 font-medium leading-relaxed">{task.description}</p>
            )}

            <div className="flex items-center justify-between mt-2">
                <div className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md flex items-center gap-1 tracking-wider ${priorityColors[task.priority as keyof typeof priorityColors] || "text-muted-foreground bg-secondary"}`}>
                    <AlertCircle className="w-3 h-3" />
                    {task.priority || 'Medium'}
                </div>

                {!isOverlay ? (
                    <div className="flex gap-1" onPointerDown={(e) => e.stopPropagation()}>
                        {task.status !== 'done' && (
                            <button onClick={(e) => { e.stopPropagation(); onStatusChange(task.id, 'done'); }} title="Mark Done" className="p-1.5 hover:bg-green-500/20 rounded-lg text-muted-foreground hover:text-green-500 transition-colors border-none outline-none">
                                <CheckCircle className="w-4 h-4" />
                            </button>
                        )}
                        {task.status === 'todo' && (
                            <button onClick={(e) => { e.stopPropagation(); onStatusChange(task.id, 'in_progress'); }} title="Start" className="p-1.5 hover:bg-primary/20 rounded-lg text-muted-foreground hover:text-primary transition-colors border-none outline-none">
                                <Clock className="w-4 h-4" />
                            </button>
                        )}
                        <div className="text-muted-foreground/30 group-hover:text-muted-foreground transition-colors ml-1 cursor-grab active:cursor-grabbing p-1.5">
                            <GripVertical className="w-4 h-4" />
                        </div>
                    </div>
                ) : (
                    <div className="text-muted-foreground/30 p-1.5">
                        <GripVertical className="w-4 h-4" />
                    </div>
                )}
            </div>
        </div>
    );
}
