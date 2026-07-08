import { NextResponse } from "next/server";
import { EmbeddingService } from "@/lib/ai/embedding.service";

export async function GET() {
  const embedding =
    await EmbeddingService.generateEmbedding(
      "React is a JavaScript library."
    );

  return NextResponse.json({
    dimensions: embedding.length,
    firstFive: embedding.slice(0, 5),
  });
}