import { SearchService } from "@/lib/vector/search.service";
import { gemini } from "@/lib/ai/gemini";

export class RagService {
  static async askQuestion(
    documentId: string,
    question: string
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
      .map((chunk) => chunk.content)
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

    const response =
      await gemini.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

    // Step 4: Return answer + sources
    return {
      answer: response.text ?? "No answer generated.",
      sources: chunks.map((chunk) => ({
        pageNumber: chunk.pageNumber,
        similarity: Number(chunk.similarity.toFixed(2)),
      })),
    };
  }
}