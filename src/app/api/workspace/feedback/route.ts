import { NextRequest, NextResponse } from "next/server";
import { WorkspaceChatService } from "@/lib/chat/workspace-chat.service";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null) as { messageId?: unknown; feedback?: unknown } | null;
  if (typeof body?.messageId !== "string" || !body.messageId) {
    return NextResponse.json({ error: "messageId is required" }, { status: 400 });
  }
  const feedback = body.feedback === "LIKE" || body.feedback === "DISLIKE" ? body.feedback : null;
  try {
    return NextResponse.json(await WorkspaceChatService.updateMessageFeedback(body.messageId, feedback));
  } catch (error) {
    console.error("Failed to update workspace feedback", error);
    return NextResponse.json({ error: "Failed to update workspace feedback" }, { status: 500 });
  }
}
