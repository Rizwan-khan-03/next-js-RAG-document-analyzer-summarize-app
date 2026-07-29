import { RagService } from "@/lib/ai/rag.service";
import { WorkspaceChatService } from "@/lib/chat/workspace-chat.service";

type HistoryMessage = { role: "user" | "assistant"; text: string };

export async function POST(request: Request) {
  try {
    const body = await request.json() as {
      workspaceId?: unknown;
      sessionId?: unknown;
      question?: unknown;
      history?: unknown;
      replaceAssistantMessageId?: unknown;
    };
    const workspaceId = typeof body.workspaceId === "string" ? body.workspaceId : "";
    const sessionId = typeof body.sessionId === "string" ? body.sessionId : "";
    const question = typeof body.question === "string" ? body.question.trim() : "";
    const replaceAssistantMessageId = typeof body.replaceAssistantMessageId === "string"
      ? body.replaceAssistantMessageId
      : undefined;
    const history: HistoryMessage[] = Array.isArray(body.history)
      ? body.history.flatMap((message): HistoryMessage[] => {
        if (
          typeof message === "object" && message !== null &&
          "role" in message && "text" in message &&
          (message.role === "user" || message.role === "assistant") &&
          typeof message.text === "string"
        ) return [{ role: message.role, text: message.text }];
        return [];
      })
      : [];

    if (!workspaceId || !sessionId || !question) {
      return Response.json({ error: "workspaceId, sessionId, and question are required" }, { status: 400 });
    }

    if (!replaceAssistantMessageId) {
      await WorkspaceChatService.saveMessage({ sessionId, role: "user", content: question });
      await WorkspaceChatService.updateSessionTitleIfNeeded(
        sessionId,
        question.length > 40 ? `${question.slice(0, 40)}...` : question
      );
    }

    const result = await RagService.askWorkspaceQuestion(workspaceId, question, history);
    const encoder = new TextEncoder();
    let fullAnswer = "";
    const readable = new ReadableStream<Uint8Array>({
      async start(controller) {
        if ("answer" in result) {
          fullAnswer = result.answer ?? "";
          controller.enqueue(encoder.encode(fullAnswer));
        } else {
          for await (const chunk of result.stream) {
            const text = chunk.choices?.[0]?.delta?.content;
            if (text) {
              fullAnswer += text;
              controller.enqueue(encoder.encode(text));
            }
          }
        }

        if (replaceAssistantMessageId) {
          await WorkspaceChatService.updateMessageContent(replaceAssistantMessageId, {
            content: fullAnswer,
            sources: result.sources,
          });
        } else {
          await WorkspaceChatService.saveMessage({
            sessionId,
            role: "assistant",
            content: fullAnswer,
            sources: result.sources,
          });
        }
        controller.enqueue(encoder.encode(`\n__SOURCES__${JSON.stringify(result.sources)}`));
        controller.close();
      },
    });

    return new Response(readable, { headers: { "Content-Type": "text/plain" } });
  } catch (error) {
    console.error("WORKSPACE CHAT API ERROR", error);
    return Response.json({ error: "Failed to generate workspace response" }, { status: 500 });
  }
}
