import { gemini } from "./gemini";

export class EmbeddingService {
  static async generateEmbedding(
    text: string
  ): Promise<number[]> {
    const response =
      await gemini.models.embedContent({
        model: "gemini-embedding-001",
        contents: text,
      });
    console.log(response?.embeddings?.[0]?.values?.length ?? []);
    return response.embeddings?.[0]?.values ?? [];
  }
}
