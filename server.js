
import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import cors from "cors";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// Serve frontend files locally
app.use(express.static("public"));

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.post("/ask", async (req, res) => {
    try {
        const question = req.body.question;

        if (!question || !question.trim()) {
            return res.status(400).json({
                error: "Please enter a question."
            });
        }

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Answer this question in 1-5 short and simple sentences: ${question}`
        });

        res.json({
            answer: response.text
        });
    } catch (error) {
        console.error("Gemini Error:", error.message);

        res.status(500).json({
            error: "Something went wrong. Please try again."
        });
    }
});

// Run a local server; Vercel handles requests in production
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export default app;
