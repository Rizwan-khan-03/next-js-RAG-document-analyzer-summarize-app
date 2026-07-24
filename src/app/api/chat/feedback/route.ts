import { NextRequest, NextResponse } from "next/server";
import { ChatService } from "@/lib/chat/chat.service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      messageId?: string;
      feedback?: "LIKE" | "DISLIKE" | null;
    };

    const { messageId, feedback } = body;

    if (!messageId) {
      return NextResponse.json(
        { error: "messageId is required" },
        { status: 400 }
      );
    }

    const normalizedFeedback: "LIKE" | "DISLIKE" | null =
      feedback === "LIKE" || feedback === "DISLIKE"
        ? feedback
        : null;

    const updatedMessage = await ChatService.updateMessageFeedback(
      messageId,
      normalizedFeedback
    );

    return NextResponse.json(updatedMessage);
  } catch (error) {
    console.error("Failed to update chat feedback", error);

    return NextResponse.json(
      { error: "Failed to update chat feedback" },
      { status: 500 }
    );
  }
}
