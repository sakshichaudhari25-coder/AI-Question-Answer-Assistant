import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import cors from "cors"


dotenv.config();

const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(cors())
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.post("/ask", async (req, res) => {
    try {
        const question = req.body.question;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Answer this question in 1-5 short and simple sentences: ${question}`
        });

        const answer = response.text;

        res.json({
            answer: answer
        });

    } catch (error) {
        console.log("Gemini Error:", error.message);

        res.status(500).json({
            error: "Something went wrong"
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});