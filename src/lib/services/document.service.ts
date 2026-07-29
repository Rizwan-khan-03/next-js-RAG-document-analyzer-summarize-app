import { prisma } from "@/lib/prisma/client";
import { EmbeddingService } from "@/lib/ai/embedding.service";
export class DocumentService {
  static async getAllDocuments() {
    return prisma.document.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async getDocument(id: string) {
    return prisma.document.findUnique({
      where: {
        id,
      },
    });
  }

  static async getDocumentText(id: string) {
    const document = await prisma.document.findUnique({
      where: {
        id,
      },
      select: {
        extractedText: true,
      },
    });

    return document?.extractedText ?? "";
  }

  static async updateSummary(
    id: string,
    summary: string
  ) {
    return prisma.document.update({
      where: {
        id,
      },
      data: {
        summary,
      },
    });
  }

  static async updateStatus(
    id: string,
    status: string
  ) {
    return prisma.document.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
  }
  static async updateAIData(
  id: string,
  summary: string,
  keywords: string[]
) {
  return prisma.document.update({
    where: {
      id,
    },
    data: {
      summary,
      keywords: keywords.join(", "),
    },
  });
}
static async saveChunks(
  documentId: string,
  chunks: string[]
) {
  await prisma.documentChunk.deleteMany({
    where: {
      documentId,
    },
  });

  for (let index = 0; index < chunks.length; index++) {

    const content = chunks[index];

    const embedding =
      await EmbeddingService.generateEmbedding(content);

    await prisma.$executeRawUnsafe(
      `
      INSERT INTO "DocumentChunk"
      (
        "documentId",
        "chunkIndex",
        "pageNumber",
        "content",
        "embedding"
      )
      VALUES
      (
        $1,
        $2,
        $3,
        $4,
        $5::vector
      )
      `,
      documentId,
      index,
      0,
      content,
      `[${embedding.join(",")}]`
    );
  }
}
}
