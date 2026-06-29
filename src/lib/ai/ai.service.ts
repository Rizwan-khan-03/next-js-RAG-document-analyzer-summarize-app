export class AIService {
    static async askQuestion(
        documentText: string,
        question: string
    ) {
        // Temporary fake AI implementation

        if (!documentText) {
            return {
                answer: "This document has no extracted text.",
            };
        }

        const lowerQuestion = question.toLowerCase();
        const lowerText = documentText.toLowerCase();

        if (lowerQuestion.includes("skills")) {
            return {
                answer:
                    "I found possible technical skills in this document: React, TypeScript, JavaScript, Node.js.",
            };
        }

        if (lowerQuestion.includes("summary")) {
            return {
                answer:
                    documentText.substring(0, 300) + "...",
            };
        }

        if (lowerQuestion.includes("name")) {
            return {
                answer:
                    "The person's name appears near the beginning of the document.",
            };
        }

        return {
            answer:
                "AI provider is not connected yet. This is a mock response.",
        };
    }
    static async generateSummary(text: string) {
        if (!text) return "";

        return (
            text.substring(0, 250) +
            (text.length > 250 ? "..." : "")
        );
    }

    static async extractKeywords(text: string) {
        if (!text) return [];

        const words = text
            .replace(/[^\w\s]/g, "")
            .split(/\s+/)
            .filter((word) => word.length > 5);

        const uniqueWords = [...new Set(words)];

        return uniqueWords.slice(0, 8);
    }
}