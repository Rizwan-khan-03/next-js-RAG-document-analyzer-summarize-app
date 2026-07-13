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
  const pages = await extractPdfText(filePath);

  // Merge all pages for summary/keywords
  const fullText = pages
    .map((page) => page.text)
    .join("\n\n");

  // STEP 2
  const summary =
    await AIService.generateSummary(fullText);

  // STEP 3
  const keywords =
    await AIService.extractKeywords(fullText);

  // STEP 4
  await prisma.document.update({
    where: {
      id,
    },
    data: {
      extractedText: fullText,
      summary,
      keywords: keywords.join(", "),
      status: "PROCESSING",
    },
  });

  let globalChunkIndex = 0;

  // STEP 5
  for (const page of pages) {

    const chunks =
      ChunkService.splitIntoChunks(page.text);

    console.log(
      `Page ${page.pageNumber}: ${chunks.length} chunks`
    );

    // STEP 6
    for (const chunk of chunks) {

      console.log(
        `Embedding chunk ${globalChunkIndex + 1}`
      );

      const embedding =
        await EmbeddingService.generateEmbedding(
          chunk
        );

      try {
        await VectorService.insertChunk(
          id,
          globalChunkIndex,
          page.pageNumber,
          chunk,
          embedding
        );

        console.log(
          `✅ Successfully inserted chunk ${globalChunkIndex}`
        );
      } catch (err) {
        console.error(
          `❌ Failed inserting chunk ${globalChunkIndex}`
        );
        console.error(err);

        throw err;
      }

      globalChunkIndex++;
    }
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