import { SearchService } from "@/lib/vector/search.service";
// import { gemini } from "@/lib/ai/gemini";
import { openrouter } from "@/lib/ai/openrouter";
import { prisma } from "@/lib/prisma/client";

type ChatHistoryMessage = {
  role: "user" | "assistant";
  text: string;
};

type WorkspaceSource = {
  documentId: string;
  documentTitle: string;
  pageNumber: number;
  similarity: number;
  content: string;
};

export class RagService {
  static async askQuestion(
    documentId: string,
    question: string,
    history: ChatHistoryMessage[] = []
  ) {
    // Step 1: Retrieve most relevant chunks
    const chunks = await SearchService.searchSimilarChunks(
      documentId,
      question,
      3
    );

    if (chunks.length === 0) {
      return {
        answer: "I couldn't find any relevant information in this document.",
        sources: [],
      };
    }

    // Step 2: Build context
    const context = chunks
      .map((chunk) => chunk.content)
      .join("\n\n-----------------------\n\n");

    // Step 3: Ask Gemini
    const prompt = `
You are an AI Document Assistant.

Answer ONLY using the context below.

If the answer cannot be found, reply:

"I couldn't find that information in the document."

=========================
CONTEXT
=========================

${context}

=========================
QUESTION
=========================

${question}
`;
    console.log("Creating OpenRouter stream...");
    const chatMessages = [
      {
        role: "system",
        content:
          "You are an expert AI document assistant. Answer ONLY using the supplied context. If the answer is not present, reply: I couldn't find that information in the document.",
      },

      ...history.map((m) => ({
        role: m.role,
        content: m.text,
      })),

      {
        role: "user",
        content: prompt,
      },
    ];
    const stream = await openrouter.chat.completions.create({
      model: "openai/gpt-oss-20b:free",
      stream: true,
      messages: chatMessages,
      temperature: 0.2,
    });
    console.log("Stream created successfully");

    return {
      stream,
      sources: chunks.map((chunk) => ({
        pageNumber: chunk.pageNumber,
        similarity: Number(chunk.similarity.toFixed(2)),
        content: chunk.content,
      })),
    };
  }

  static async askWorkspaceQuestion(
    workspaceId: string,
    question: string,
    history: ChatHistoryMessage[] = []
  ) {
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        documents: {
          include: { document: { select: { id: true, fileName: true } } },
        },
      },
    });

    if (!workspace) {
      throw new Error("Workspace not found.");
    }

    const documentNames = new Map(
      workspace.documents.map(({ document }) => [document.id, document.fileName])
    );
    const chunks = await SearchService.searchSimilarChunksForDocuments(
      [...documentNames.keys()],
      question,
      6
    );

    if (chunks.length === 0) {
      return {
        answer: "I couldn't find any relevant information in this workspace.",
        sources: [] as WorkspaceSource[],
      };
    }

    const sources: WorkspaceSource[] = chunks.flatMap((chunk) => {
      const documentId = chunk.documentId;
      const documentTitle = documentId ? documentNames.get(documentId) : undefined;
      if (!documentId || !documentTitle) return [];

      return [{
        documentId,
        documentTitle,
        pageNumber: chunk.pageNumber,
        similarity: Number(chunk.similarity.toFixed(2)),
        content: chunk.content,
      }];
    });
    const context = sources
      .map((source) => `[Source: ${source.documentTitle}, page ${source.pageNumber}]\n${source.content}`)
      .join("\n\n-----------------------\n\n");
    const prompt = `
You are an AI Workspace Assistant. Answer ONLY using the workspace context below.
When useful, identify the source document by name. If the answer cannot be found, reply: "I couldn't find that information in this workspace."

=========================
WORKSPACE CONTEXT
=========================

${context}

=========================
QUESTION
=========================

${question}
`;
    const stream = await openrouter.chat.completions.create({
      model: "openai/gpt-oss-20b:free",
      stream: true,
      messages: [
        {
          role: "system",
          content: "You are an expert AI workspace assistant. Answer only from the supplied workspace context.",
        },
        ...history.map((message) => ({ role: message.role, content: message.text })),
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
    });

    return { stream, sources };
  }
}
