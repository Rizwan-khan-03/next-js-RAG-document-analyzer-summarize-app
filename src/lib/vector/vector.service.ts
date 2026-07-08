import { prisma } from "@/lib/prisma/client";

export class VectorService {
  static async insertChunk(
    documentId: string,
    chunkIndex: number,
    content: string,
    embedding: number[]
  ) {
    const vector = `[${embedding.join(",")}]`;

    await prisma.$executeRawUnsafe(
      `
      INSERT INTO "DocumentChunk"
      ("documentId","chunkIndex","content","embedding")
      VALUES ($1,$2,$3,$4::vector)
      `,
      documentId,
      chunkIndex,
      content,
      vector
    );
  }
}