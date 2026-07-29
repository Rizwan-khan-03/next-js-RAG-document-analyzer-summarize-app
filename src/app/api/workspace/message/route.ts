import { NextRequest, NextResponse } from "next/server";
import { WorkspaceChatService } from "@/lib/chat/workspace-chat.service";

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("sessionId");
  if (!sessionId) return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
  try {
    return NextResponse.json(await WorkspaceChatService.getMessages(sessionId));
  } catch (error) {
    console.error("Failed to load workspace messages", error);
    return NextResponse.json({ error: "Failed to load workspace messages" }, { status: 500 });
  }
}
