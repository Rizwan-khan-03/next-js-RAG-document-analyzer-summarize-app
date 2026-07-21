import { RagService } from "@/lib/ai/rag.service";
import { ChatService } from "@/lib/chat/chat.service";

export async function POST(req: Request) {
  try {
    const {
      documentId,
      sessionId,
      question,
      history = [],
    } = await req.json();

    if (!sessionId) {
      return Response.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    console.log("Document ID:", documentId);
    console.log("Session ID:", sessionId);

    // Save User Message
    await ChatService.saveMessage({
      sessionId,
      role: "user",
      content: question,
    });

    const title = question.length > 40
      ? question.slice(0, 40) + "..."
      : question;

    await ChatService.updateSessionTitleIfNeeded(sessionId, title);

    let fullAnswer = "";

    const { stream, sources } =
      await RagService.askQuestion(
        documentId,
        question,
        history
      );

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream as any) {
          const text =
            chunk.choices?.[0]?.delta?.content;

          if (text) {
            fullAnswer += text;
            controller.enqueue(
              encoder.encode(text)
            );
          }
        }

        // Save Assistant Message
        await ChatService.saveMessage({
          sessionId,
          role: "assistant",
          content: fullAnswer,
          sources,
        });

        controller.enqueue(
          encoder.encode(
            "\n__SOURCES__" +
            JSON.stringify(sources)
          )
        );

        controller.close();
      },
    });
    console.log("Saved user message to session:", sessionId);
    console.log("Saved assistant message to session:", sessionId);
    console.log("=== API RECEIVED ===");
    console.log({
      documentId,
      sessionId,
      question,
    });
    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (err) {
    console.error("CHAT API ERROR");
    console.error(err);

    return Response.json(
      { error: String(err) },
      { status: 500 }
    );
  }
}