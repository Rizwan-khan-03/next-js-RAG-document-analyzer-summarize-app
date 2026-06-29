import { NextResponse } from "next/server";
import { AIService } from "@/lib/ai/ai.service";
import { DocumentService } from "@/lib/services/document.service";

export  async function POST(req: Request) {
  try {
    const body = await req.json();

    const { documentId, question } = body;

    const documentText =
      await DocumentService.getDocumentText(documentId);

    const result =
      await AIService.askQuestion(
        documentText,
        question
      );

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Chat failed" },
      { status: 500 }
    );
  }
}