import { extractPdfText } from "@/lib/ingestion/pdf";
import { AIService } from "@/lib/ai/ai.service";
import { prisma } from "@/lib/prisma/client";

import { ChunkService } from "@/lib/ingestion/chunk.service";
import { EmbeddingService } from "@/lib/ai/embedding.service";
import { VectorService } from "@/lib/vector/vector.service";

export async function processDocument(
  id: string,
  filePath: string
) {
  const pages = await extractPdfText(filePath);

  const fullText = pages
    .map((page) => page.text)
    .join("\n\n");

  const summary =
    await AIService.generateSummary(fullText);

  const keywords =
    await AIService.extractKeywords(fullText);

  await prisma.document.update({
    where: { id },
    data: {
      extractedText: fullText,
      summary,
      keywords: keywords.join(", "),
      status: "PROCESSING",
    },
  });

  let globalChunkIndex = 0;

  for (const page of pages) {
    const chunks = ChunkService.splitIntoChunks(page.text);

    for (const chunk of chunks) {
      const embedding =
        await EmbeddingService.generateEmbedding(chunk);

      await VectorService.insertChunk(
        id,
        globalChunkIndex,
        page.pageNumber,
        chunk,
        embedding
      );

      globalChunkIndex++;
    }
  }

  return prisma.document.update({
    where: { id },
    data: {
      status: "PROCESSED",
    },
  });
}