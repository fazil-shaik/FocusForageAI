import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);

export const aiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function generateContent(prompt: string) {
    try {
        const result = await aiModel.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error generating content:", error);
        throw error;
    }
}
