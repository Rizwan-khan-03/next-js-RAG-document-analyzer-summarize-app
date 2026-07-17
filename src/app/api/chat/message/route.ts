import { NextRequest, NextResponse } from "next/server";
import { ChatService } from "@/lib/chat/chat.service";

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId is required" },
        { status: 400 }
      );
    }

    const messages = await ChatService.getMessages(sessionId);

    return NextResponse.json(messages);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to load messages" },
      { status: 500 }
    );
  }
}