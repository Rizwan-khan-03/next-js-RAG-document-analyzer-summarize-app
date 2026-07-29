import { NextRequest, NextResponse } from "next/server";
import { WorkspaceChatService } from "@/lib/chat/workspace-chat.service";

export async function GET(request: NextRequest) {
  const workspaceId = request.nextUrl.searchParams.get("workspaceId");
  if (!workspaceId) return NextResponse.json({ error: "workspaceId is required" }, { status: 400 });
  try {
    return NextResponse.json(await WorkspaceChatService.getSessions(workspaceId));
  } catch (error) {
    console.error("Failed to load workspace sessions", error);
    return NextResponse.json({ error: "Failed to load workspace sessions" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null) as { workspaceId?: unknown } | null;
  if (typeof body?.workspaceId !== "string" || !body.workspaceId) {
    return NextResponse.json({ error: "workspaceId is required" }, { status: 400 });
  }
  try {
    return NextResponse.json(await WorkspaceChatService.createSession(body.workspaceId));
  } catch (error) {
    console.error("Failed to create workspace session", error);
    return NextResponse.json({ error: "Failed to create workspace session" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("sessionId");
  if (!sessionId) return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
  try {
    await WorkspaceChatService.deleteSession(sessionId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete workspace session", error);
    return NextResponse.json({ error: "Failed to delete workspace session" }, { status: 500 });
  }
}
