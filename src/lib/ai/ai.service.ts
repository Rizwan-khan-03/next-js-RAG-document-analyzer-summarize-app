import { openrouter } from "./openrouter";

export class AIService {
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

If the answer cannot be found, reply:

"I couldn't find that information in the document."

DOCUMENT:

${documentText}

QUESTION:

${question}
`;

        const completion =
            await openrouter.chat.completions.create({
                model: "openai/gpt-oss-20b:free",

                messages: [
                    {
                        role: "system",
                        content:
                            "Answer only using the supplied document.",
                    },
                    {
                        role: "user",
                        content: prompt,
                    },
                ],

                temperature: 0.2,
            });

        return {
            answer:
                completion.choices[0].message.content ??
                "No response generated.",
        };
    }

    static async generateSummary(text: string) {
        if (!text) return "";

        const completion =
            await openrouter.chat.completions.create({
                model: "openai/gpt-oss-20b:free",

                messages: [
                    {
                        role: "system",
                        content:
                            "You summarize documents professionally.",
                    },
                    {
                        role: "user",
                        content: `
Summarize this document in 5-8 concise sentences.

${text}
`,
                    },
                ],

                temperature: 0.3,
            });

        return completion.choices[0].message.content ?? "";
    }

    static async extractKeywords(text: string) {
        if (!text) return [];

        const completion =
            await openrouter.chat.completions.create({
                model: "openai/gpt-oss-20b:free",

                messages: [
                    {
                        role: "system",
                        content:
                            "Extract only keywords separated by commas.",
                    },
                    {
                        role: "user",
                        content: `
Extract the 10 most important keywords.

Return ONLY comma-separated keywords.

${text}
`,
                    },
                ],

                temperature: 0,
            });

        return (
            completion.choices[0].message.content
                ?.split(",")
                .map((k) => k.trim())
                .filter(Boolean) ?? []
        );
    }
}