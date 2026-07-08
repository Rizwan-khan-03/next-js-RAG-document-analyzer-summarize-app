import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { SearchService } from "@/lib/vector/search.service";

export async function GET() {
  const document = await prisma.document.findFirst({
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!document) {
    return NextResponse.json({
      error: "No document found",
    });
  }

  const result =
    await SearchService.searchSimilarChunks(
      document.id,
      "What is this document about?"
    );

  return NextResponse.json(result);
}