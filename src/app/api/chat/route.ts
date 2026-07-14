import { RagService } from "@/lib/ai/rag.service";

export async function POST(req: Request) {
  try {
    const { documentId, question } = await req.json();

    if (!documentId || !question) {
      return new Response("Missing documentId or question", {
        status: 400,
      });
    }

    const { stream, sources } =
      await RagService.askQuestion(
        documentId,
        question
      );

    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          // First send the sources
          controller.enqueue(
            encoder.encode(
              `__SOURCES__${JSON.stringify(sources)}\n`
            )
          );

          // Then stream the AI response
          for await (const chunk of stream as any) {
            const text =
              chunk.choices?.[0]?.delta?.content ?? "";

            if (text) {
              controller.enqueue(
                encoder.encode(text)
              );
            }
          }

          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error(error);

    return new Response("Internal Server Error", {
      status: 500,
    });
  }
}