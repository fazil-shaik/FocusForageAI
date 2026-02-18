import { getTasks } from "./actions";
import { TaskBoard } from "@/components/TaskBoard";

export default async function TasksPage() {
    const tasks = await getTasks();

    return (
        <div className="h-[calc(100vh-100px)]">
            <TaskBoard initialTasks={tasks} />
        </div>
    );
}
