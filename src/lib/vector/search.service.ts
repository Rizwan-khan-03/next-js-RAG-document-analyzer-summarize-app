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

    const vector = `[${embedding.join(",")}]`;

    // Search similar chunks
    const chunks =
      await prisma.$queryRawUnsafe<
        {
          content: string;
          chunkIndex: number;
          pageNumber: number;
          similarity: number;
        }[]
      >(
        `
        SELECT
          content,
          "chunkIndex",
          "pageNumber",
          1 - (embedding <=> $1::vector) AS similarity
        FROM "DocumentChunk"
        WHERE "documentId" = $2
        ORDER BY embedding <=> $1::vector
        LIMIT $3;
        `,
        vector,
        documentId,
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