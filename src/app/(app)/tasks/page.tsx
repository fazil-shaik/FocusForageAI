import { getTasks } from "./actions";
export const dynamic = "force-dynamic";
import { TaskBoard } from "@/components/TaskBoard";

export default async function TasksPage() {
    const tasks = await getTasks();

    return (
        <div className="h-[calc(100vh-100px)]">
            <TaskBoard initialTasks={tasks} />
        </div>
    );
}
