import { prisma } from "@/lib/prisma/client";
import { createId } from "@paralleldrive/cuid2";

export class VectorService {
  static async insertChunk(
    documentId: string,
    chunkIndex: number,
    pageNumber: number,
    content: string,
    embedding: number[]
  ) {
    try {
      const id = createId();

      const vector = `[${embedding.join(",")}]`;

      await prisma.$executeRawUnsafe(
        `
        INSERT INTO "DocumentChunk"
        (
          "id",
          "documentId",
          "chunkIndex",
          "pageNumber",
          "content",
          "embedding"
        )
        VALUES ($1,$2,$3,$4,$5,$6::vector)
        `,
        id,
        documentId,
        chunkIndex,
        pageNumber,
        content,
        vector
      );

      console.log(`✅ Chunk ${chunkIndex} saved`);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}