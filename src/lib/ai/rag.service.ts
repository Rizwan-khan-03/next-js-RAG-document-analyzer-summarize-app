import { SearchService } from "@/lib/vector/search.service";
import { gemini } from "./gemini";

export class RagService {
  static async askDocument(
    documentId: string,
    question: string
  ) {
    // Step 1: Retrieve relevant chunks
    const chunks = await SearchService.searchSimilarChunks(
      documentId,
      question,
      3
    );

    // Step 2: Build context
    const context = chunks
      .map((chunk) => chunk.content)
      .join("\n\n");

    // Step 3: Build prompt
    const prompt = `
You are an AI Document Assistant.

Answer ONLY using the context below.

If the answer cannot be found, say:

"I couldn't find that information in the document."

=========================
DOCUMENT CONTEXT
=========================

${context}

=========================
QUESTION
=========================

${question}
`;

    // Step 4: Ask Gemini
    const response = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    // Step 5: Return response
    return {
      answer: response.text ?? "No answer generated.",
      chunks,
    };
  }
}