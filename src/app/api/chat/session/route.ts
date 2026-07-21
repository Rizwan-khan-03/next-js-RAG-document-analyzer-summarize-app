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
export async function POST(req: NextRequest) {
    try {
        const { documentId } = await req.json();

        if (!documentId) {
            return NextResponse.json(
                { error: "documentId is required" },
                { status: 400 }
            );
        }

        const session =
            await ChatService.createSession(documentId);

        return NextResponse.json(session);
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Failed to create session" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const sessionId = req.nextUrl.searchParams.get("sessionId");

        if (!sessionId) {
            return NextResponse.json(
                { error: "sessionId is required" },
                { status: 400 }
            );
        }

        await ChatService.deleteSession(sessionId);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Failed to delete session" },
            { status: 500 }
        );
    }
}