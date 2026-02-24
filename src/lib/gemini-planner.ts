import { generateDeepWorkPlan as orchestratePlan } from "./ai-orchestrator";

export async function generateDeepWorkPlan(userId: string, tasks: string[], availableTime: string, energyLevel: string, userPlan: string = "free") {
  return await orchestratePlan({
    userId,
    task_list: tasks.join(", "),
    available_time: availableTime,
    deadlines: "None specified",
    energy_level: energyLevel
  });
}
