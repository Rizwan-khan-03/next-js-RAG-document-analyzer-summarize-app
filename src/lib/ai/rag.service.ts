import { SearchService } from "@/lib/vector/search.service";
// import { gemini } from "@/lib/ai/gemini";
import { openrouter } from "@/lib/ai/openrouter";

export class RagService {
  static async askQuestion(
    documentId: string,
    question: string,
    history: any[] = []
  ) {
    // Step 1: Retrieve most relevant chunks
    const chunks = await SearchService.searchSimilarChunks(
      documentId,
      question,
      3
    );

    if (chunks.length === 0) {
      return {
        answer: "I couldn't find any relevant information in this document.",
        sources: [],
      };
    }

    // Step 2: Build context
    const context = chunks
      .map((chunk: any) => chunk.content)
      .join("\n\n-----------------------\n\n");

    // Step 3: Ask Gemini
    const prompt = `
You are an AI Document Assistant.

Answer ONLY using the context below.

If the answer cannot be found, reply:

"I couldn't find that information in the document."

=========================
CONTEXT
=========================

${context}

=========================
QUESTION
=========================

${question}
`;
    console.log("Creating OpenRouter stream...");
    const chatMessages = [
      {
        role: "system",
        content:
          "You are an expert AI document assistant. Answer ONLY using the supplied context. If the answer is not present, reply: I couldn't find that information in the document.",
      },

      ...history.map((m: any) => ({
        role: m.role,
        content: m.text,
      })),

      {
        role: "user",
        content: prompt,
      },
    ];
    const stream = await openrouter.chat.completions.create({
      model: "openai/gpt-oss-20b:free",
      stream: true,
      messages: chatMessages,
      temperature: 0.2,
    });
    console.log("Stream created successfully");

    return {
      stream,
      sources: chunks.map((chunk: any) => ({
        pageNumber: chunk.pageNumber,
        similarity: Number(chunk.similarity.toFixed(2)),
        content: chunk.content,
      })),
    };
  }
}