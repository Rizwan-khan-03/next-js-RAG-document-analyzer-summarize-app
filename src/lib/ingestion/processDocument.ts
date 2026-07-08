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
  // STEP 1
  const extractedText = await extractPdfText(filePath);

  // STEP 2
  const summary =
    await AIService.generateSummary(extractedText);

  // STEP 3
  const keywords =
    await AIService.extractKeywords(extractedText);

  // STEP 4
  await prisma.document.update({
    where: {
      id,
    },
    data: {
      extractedText,
      summary,
      keywords: keywords.join(", "),
      status: "PROCESSING",
    },
  });

  // STEP 5
  const chunks =
    ChunkService.splitIntoChunks(extractedText);

  console.log("Chunks:", chunks.length);

  // STEP 6
  for (let i = 0; i < chunks.length; i++) {
    console.log(`Embedding chunk ${i + 1}/${chunks.length}`);

    const embedding =
      await EmbeddingService.generateEmbedding(
        chunks[i]
      );

    await VectorService.insertChunk(
      id,
      i,
      chunks[i],
      embedding
    );
  }

  // STEP 7
  return prisma.document.update({
    where: {
      id,
    },
    data: {
      status: "PROCESSED",
    },
  });
}