import { extractPdfText } from "@/lib/ingestion/pdf";
import { AIService } from "@/lib/ai/ai.service";
import { prisma } from "@/lib/prisma/client";

export async function processDocument(
  id: string,
  filePath: string
) {
  // Step 1: Extract text from PDF
  const extractedText = await extractPdfText(filePath);

  // Step 2: Generate summary
  const summary =
    await AIService.generateSummary(extractedText);

  // Step 3: Generate keywords
  const keywords =
    await AIService.extractKeywords(extractedText);

  // Step 4: Save everything
  return prisma.document.update({
    where: {
      id,
    },
    data: {
      extractedText,
      summary,
      keywords: keywords.join(", "),
      status: "PROCESSED",
    },
  });
}