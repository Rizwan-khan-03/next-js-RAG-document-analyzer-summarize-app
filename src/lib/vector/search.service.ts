import { prisma } from "@/lib/prisma/client";
import { EmbeddingService } from "@/lib/ai/embedding.service";

export class SearchService {
  static async searchSimilarChunks(
    documentId: string,
    question: string,
    limit = 3
  ) {
    // Create embedding for user's question
    const embedding =
      await EmbeddingService.generateEmbedding(question);

    return this.searchByEmbedding(embedding, question, limit, `"documentId" = $2`, [documentId]);
  }

  static async searchSimilarChunksForDocuments(
    documentIds: string[],
    question: string,
    limit = 6
  ) {
    if (documentIds.length === 0) return [];

    const embedding = await EmbeddingService.generateEmbedding(question);
    return this.searchByEmbedding(
      embedding,
      question,
      limit,
      `"documentId" = ANY($2::text[])`,
      [documentIds],
      true
    );
  }

  private static async searchByEmbedding(
    embedding: number[],
    question: string,
    limit: number,
    condition: string,
    conditionValues: unknown[],
    includeDocument = false
  ) {
    const vector = `[${embedding.join(",")}]`;
    const chunks = await prisma.$queryRawUnsafe<
      {
        content: string;
        chunkIndex: number;
        pageNumber: number;
        similarity: number;
        documentId?: string;
      }[]
    >(
        `
        SELECT
          content,
          "chunkIndex",
          "pageNumber",
          ${includeDocument ? `"documentId",` : ""}
          1 - (embedding <=> $1::vector) AS similarity
        FROM "DocumentChunk"
        WHERE ${condition}
        ORDER BY embedding <=> $1::vector
        LIMIT $${conditionValues.length + 2};
        `,
        vector,
        ...conditionValues,
        limit
      );

    console.log("Retrieved Chunks:", chunks);
    console.log("Retrieved Chunks Count:", chunks.length);

    console.log(
      chunks.map((c) => ({
        page: c.pageNumber,
        score: c.similarity,
        preview: c.content.substring(0, 100),
      }))
    );

    return chunks;
  }
}
