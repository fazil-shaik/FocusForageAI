import { generateContent } from "./ai";

export async function generateDeepWorkPlan(tasks: string[], availableTime: string, energyLevel: string) {
    const prompt = `
    You are an expert productivity coach and deep work scheduler.
    
    User Input:
    - Tasks: ${tasks.join(", ")}
    - Available Time: ${availableTime}
    - Current Energy Level: ${energyLevel}

    Goal: Create a rigid, optimized deep work schedule for this user.
    
    Rules:
    1. Break down large tasks into 25-50 minute chunks.
    2. Assign "Deep Work" blocks to high-cognitive tasks.
    3. Assign "Shallow Work" or breaks when energy is low.
    4. Prioritize tasks based on implied urgency or complexity.
    5. Output strictly in JSON format.

    JSON Structure:
    {
      "schedule": [
        {
          "time": "Start - End",
          "activity": "Task Name",
          "type": "Deep Work" | "Shallow Work" | "Break",
          "notes": "Specific advice or focus tip"
        }
      ],
      "summary": "Brief motivational summary of the plan."
    }
  `;

    try {
        const response = await generateContent(prompt);
        // clean up potential markdown code blocks
        const cleaned = response.replace(/```json/g, "").replace(/```/g, "");
        return JSON.parse(cleaned);
    } catch (error) {
        console.error("AI Planner Error:", error);
        throw new Error("Failed to generate plan");
    }
}
