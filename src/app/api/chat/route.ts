import { NextResponse } from "next/server";
import { RagService } from "@/lib/ai/rag.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { documentId, question } = body;

    if (!documentId || !question) {
      return NextResponse.json(
        {
          error: "documentId and question are required.",
        },
        {
          status: 400,
        }
      );
    }

    const result = await RagService.askDocument(
      documentId,
      question
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("RAG Chat Error:", error);

    return NextResponse.json(
      {
        error: "Chat failed",
      },
      {
        status: 500,
      }
    );
  }
}