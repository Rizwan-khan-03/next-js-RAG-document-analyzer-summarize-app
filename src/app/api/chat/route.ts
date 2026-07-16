import { RagService } from "@/lib/ai/rag.service";
import { ChatService } from "@/lib/chat/chat.service";

export async function POST(req: Request) {
  try {
    const {
      documentId,
      question,
      history = [],
    } = await req.json();

    console.log("Document ID:", documentId);

    const session = await ChatService.getOrCreateSession(documentId);

    console.log("Session:", session);

    await ChatService.saveMessage({
      sessionId: session.id,
      role: "user",
      content: question,
    });

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
            controller.enqueue(encoder.encode(text));
          }
        }

        await ChatService.saveMessage({
          sessionId: session.id,
          role: "assistant",
          content: fullAnswer,
          sources,
        });

        controller.enqueue(
          encoder.encode(
            "\n__SOURCES__" + JSON.stringify(sources)
          )
        );

        controller.close();
      },
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