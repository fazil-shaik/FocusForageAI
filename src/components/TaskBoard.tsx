"use client";

import { useState, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, MoreVertical, Trash, CheckCircle, Clock, AlertCircle, PlayCircle, GripVertical } from "lucide-react";
import { createTask, updateTaskStatus, deleteTask } from "@/app/(app)/tasks/actions";
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
    arrayMove,
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
                distance: 5, // Prevent accidental drags
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleCreate = async (formData: FormData) => {
        setIsCreateOpen(false);
        await createTask(formData);
        window.location.reload();
    };

    const handleStatusChange = async (taskId: string, newStatus: string) => {
        if (newStatus === 'done') {
            setTasks(prev => prev.filter(t => t.id !== taskId));
        } else {
            setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
        }
        await updateTaskStatus(taskId, newStatus);
    };

    const handleDelete = async (taskId: string) => {
        setTasks(prev => prev.filter(t => t.id !== taskId));
        await deleteTask(taskId);
    };

    // --- Drag and Drop Logic ---

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

        // Move task to the new container visually during drag
        setTasks((prev) => {
            const activeItems = prev.filter(t => (t.status || "todo") === activeContainer);
            const overItems = prev.filter(t => (t.status || "todo") === overContainer);

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

        const activeContainer = findContainer(activeId);
        const overContainer = findContainer(overId);

        if (activeContainer !== overContainer) {
            // Moved to a different column
            if (overContainer === 'done') {
                setTasks(prev => prev.filter(t => t.id !== activeId));
            } else {
                setTasks((prev) => prev.map(t => t.id === activeId ? { ...t, status: overContainer } : t));
            }
            await updateTaskStatus(activeId, overContainer);
        } else {
            // Reordered within same column (not persisted yet in DB as we don't have order field)
            // But we can reorder locally for UI consistency if we used arrayMove
            // For now, since we filter tasks by status, reordering only happens visually if we change the array order.
            // A truly robust implementation needs 'order' field in DB.
        }
    };

    const dropAnimation: DropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: {
                    opacity: '0.5',
                },
            },
        }),
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-foreground">Task Flow</h1>
                <button
                    onClick={() => setIsCreateOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors font-medium shadow-md"
                >
                    <Plus className="w-4 h-4" /> New Task
                </button>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full overflow-x-auto pb-10">
                    {COLUMNS.map(col => (
                        <DroppableColumn key={col.id} col={col} tasks={tasks} onDelete={handleDelete} onStatusChange={handleStatusChange} />
                    ))}
                </div>

                <DragOverlay dropAnimation={dropAnimation}>
                    {activeId ? (
                        <TaskCardOverlay task={tasks.find(t => t.id === activeId)!} />
                    ) : null}
                </DragOverlay>
            </DndContext>

            {/* Create Task Modal - Same as before */}
            {isCreateOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-card border border-border p-8 rounded-3xl w-full max-w-md shadow-2xl"
                    >
                        <h2 className="text-xl font-bold mb-4 text-foreground">Create New Task</h2>
                        <form action={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm text-foreground font-bold mb-1">Title</label>
                                <input name="title" required className="w-full bg-input border border-transparent rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none text-foreground" placeholder="What needs to be done?" />
                            </div>
                            <div>
                                <label className="block text-sm text-foreground font-bold mb-1">Description</label>
                                <textarea name="description" className="w-full bg-input border border-transparent rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none text-foreground" rows={3} placeholder="Add details..." />
                            </div>
                            <div>
                                <label className="block text-sm text-foreground font-bold mb-1">Priority</label>
                                <select name="priority" className="w-full bg-input border border-transparent rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none text-foreground">
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setIsCreateOpen(false)} className="px-4 py-2 text-muted-foreground hover:text-foreground">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-primary hover:opacity-90 text-primary-foreground rounded-full font-bold shadow-lg">Create Task</button>
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
        <div ref={setNodeRef} className="flex flex-col h-full min-h-[500px] bg-card/50 rounded-3xl p-4 border border-border backdrop-blur-sm">
            <div className={`flex items-center justify-between p-3 rounded-2xl mb-4 border ${col.color}`}>
                <span className="font-semibold">{col.title}</span>
                <span className="text-xs font-bold px-2 py-1 bg-background/50 rounded-full">
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
                        <div className="text-center text-muted-foreground py-10 text-sm italic">
                            Drop here
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
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none">
            <TaskCardContent task={task} onDelete={onDelete} onStatusChange={onStatusChange} />
        </div>
    );
}

function TaskCardOverlay({ task }: { task: Task }) {
    return (
        <div className="opacity-90 rotate-2 scale-105 shadow-2xl cursor-grabbing">
            <TaskCardContent task={task} onDelete={() => { }} onStatusChange={() => { }} isOverlay />
        </div>
    );
}

function TaskCardContent({ task, onDelete, onStatusChange, isOverlay }: { task: Task, onDelete: (id: string) => void, onStatusChange: (id: string, status: string) => void, isOverlay?: boolean }) {
    const priorityColors = {
        low: "text-blue-500",
        medium: "text-yellow-500",
        high: "text-red-500"
    };

    return (
        <div className={`bg-card border border-border p-4 rounded-2xl group hover:border-primary/30 transition-all ${isOverlay ? 'shadow-2xl ring-2 ring-primary/20' : 'hover:shadow-lg'}`}>
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-foreground text-sm">{task.title}</h3>
                <div className="relative flex gap-2">
                    {!isOverlay && (
                        <button onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); onDelete(task.id); }} className="text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {task.description && (
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{task.description}</p>
            )}

            <div className="flex items-center justify-between mt-2">
                <div className={`text-[10px] font-bold uppercase flex items-center gap-1 ${priorityColors[task.priority as keyof typeof priorityColors] || "text-muted-foreground"}`}>
                    <AlertCircle className="w-3 h-3" />
                    {task.priority || 'Medium'}
                </div>

                {!isOverlay ? (
                    <div className="flex gap-1" onPointerDown={(e) => e.stopPropagation()}>
                        {/* Quick Actions restored */}
                        {task.status !== 'done' && (
                            <button onClick={(e) => { e.stopPropagation(); onStatusChange(task.id, 'done'); }} title="Mark Done" className="p-1 hover:bg-green-500/20 rounded text-muted-foreground hover:text-green-500">
                                <CheckCircle className="w-4 h-4" />
                            </button>
                        )}
                        {task.status === 'todo' && (
                            <button onClick={(e) => { e.stopPropagation(); onStatusChange(task.id, 'in_progress'); }} title="Start" className="p-1 hover:bg-primary/20 rounded text-muted-foreground hover:text-primary">
                                <Clock className="w-4 h-4" />
                            </button>
                        )}
                        <div className="text-muted-foreground/30 group-hover:text-muted-foreground transition-colors ml-1 cursor-grab active:cursor-grabbing">
                            <GripVertical className="w-4 h-4" />
                        </div>
                    </div>
                ) : (
                    <div className="text-muted-foreground/30">
                        <GripVertical className="w-4 h-4" />
                    </div>
                )}
            </div>
        </div>
    );
}
