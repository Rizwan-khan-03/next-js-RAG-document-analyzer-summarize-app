import { gemini } from "./gemini";
export class AIService {
    // static async askQuestion(
    //     documentText: string,
    //     question: string
    // ) {
    //     // Temporary fake AI implementation

    //     if (!documentText) {
    //         return {
    //             answer: "This document has no extracted text.",
    //         };
    //     }

    //     const lowerQuestion = question.toLowerCase();
    //     const lowerText = documentText.toLowerCase();

    //     if (lowerQuestion.includes("skills")) {
    //         return {
    //             answer:
    //                 "I found possible technical skills in this document: React, TypeScript, JavaScript, Node.js.",
    //         };
    //     }

    //     if (lowerQuestion.includes("summary")) {
    //         return {
    //             answer:
    //                 documentText.substring(0, 300) + "...",
    //         };
    //     }

    //     if (lowerQuestion.includes("name")) {
    //         return {
    //             answer:
    //                 "The person's name appears near the beginning of the document.",
    //         };
    //     }

    //     return {
    //         answer:
    //             "AI provider is not connected yet. This is a mock response.",
    //     };
    // }
    static async askQuestion(
        documentText: string,
        question: string
    ) {
        if (!documentText) {
            return {
                answer: "This document has no extracted text.",
            };
        }

        const prompt = `
You are an AI Document Assistant.

Answer ONLY using the document below.

If the answer cannot be found in the document, say:
"I couldn't find that information in the document."

-----------------------
DOCUMENT
-----------------------

${documentText}

-----------------------
QUESTION
-----------------------

${question}
`;

        const response =
            await gemini.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
            });

        return {
            answer: response.text ?? "No response generated.",
        };
    }
    static async generateSummary(text: string) {
        if (!text) return "";

        const prompt = `
You are an AI assistant.

Summarize the following document in 5-8 concise sentences.

Focus on:
- Main topic
- Important information
- Key points

Document:

${text}
`;

        const response =
            await gemini.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
            });

        return response.text ?? "";
    }

    static async extractKeywords(text: string) {
        if (!text) return [];

        const prompt = `
Extract the 10 most important keywords from this document.

Rules:
- Return only keywords.
- Separate them with commas.
- Do not number them.
- Do not explain them.

Document:

${text}
`;

        const response =
            await gemini.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
            });

        return response.text
            ?.split(",")
            .map(k => k.trim())
            .filter(Boolean) ?? [];
    }
}   