import { NextResponse } from "next/server";
import { ChatService } from "@/lib/chat/chat.service";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ documentId: string }> }
) {
  const { documentId } = await params;

  const session =
    await ChatService.getOrCreateSession(documentId);

  const messages =
    await ChatService.getMessages(session.id);

  return NextResponse.json(messages);
}