import { RagService } from "@/lib/ai/rag.service";

export async function POST(req: Request) {
  const { documentId, question } = await req.json();

  const { stream, sources } =
    await RagService.askQuestion(
      documentId,
      question
    );

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {

      for await (const chunk of stream as any) {

        const text =
          chunk.choices?.[0]?.delta?.content;

        if (text) {
          controller.enqueue(
            encoder.encode(text)
          );
        }
      }

      controller.enqueue(
        encoder.encode(
          "\n__SOURCES__" +
          JSON.stringify(sources)
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
}