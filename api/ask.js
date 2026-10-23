
import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {
        const { question } = req.body || {};

        if (!question || !question.trim()) {
            return res.status(400).json({
                error: "Please enter a question."
            });
        }

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Answer this question in 1-5 short and simple sentences: ${question}`
        });

        return res.status(200).json({
            answer: response.text
        });

    } catch (error) {
        console.error("Gemini API error:", error.message);

        return res.status(500).json({
            error: "Gemini se answer nahi mila. Vercel logs check karo."
        });
    }
}
