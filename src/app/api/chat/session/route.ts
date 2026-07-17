import { NextRequest, NextResponse } from "next/server";
import { ChatService } from "@/lib/chat/chat.service";

export async function GET(req: NextRequest) {
  try {
    const documentId = req.nextUrl.searchParams.get("documentId");

    if (!documentId) {
      return NextResponse.json(
        { error: "documentId is required" },
        { status: 400 }
      );
    }

    const sessions = await ChatService.getSessions(documentId);

    return NextResponse.json(sessions);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to load sessions" },
      { status: 500 }
    );
  }
}