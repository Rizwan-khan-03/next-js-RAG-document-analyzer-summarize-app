import { prisma } from "@/lib/prisma/client";

export type WorkspaceFeedbackType = "LIKE" | "DISLIKE";

export class WorkspaceChatService {
  static saveMessage(input: {
    sessionId: string;
    role: "user" | "assistant";
    content: string;
    sources?: object;
  }) {
    return prisma.workspaceChatMessage.create({ data: input });
  }

  static getMessages(sessionId: string) {
    return prisma.workspaceChatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: "asc" },
    });
  }

  static updateMessageContent(messageId: string, input: { content: string; sources?: object }) {
    return prisma.workspaceChatMessage.update({ where: { id: messageId }, data: input });
  }

  static updateMessageFeedback(messageId: string, feedback: WorkspaceFeedbackType | null) {
    return prisma.workspaceChatMessage.update({ where: { id: messageId }, data: { feedback } });
  }

  static async getSessions(workspaceId: string) {
    console.log(Object.keys(prisma));

    console.log(
      "workspaceChatSession =",
      (prisma as any).workspaceChatSession
    );

    return prisma.workspaceChatSession.findMany({
      where: { workspaceId },
      orderBy: {
        updatedAt: "desc",
      },
      select: {
        id: true,
        title: true,
        updatedAt: true,
      },
    });
  }

  static createSession(workspaceId: string) {
    return prisma.workspaceChatSession.create({ data: { workspaceId, title: "New Chat" } });
  }

  static updateSessionTitleIfNeeded(sessionId: string, title: string) {
    return prisma.workspaceChatSession.updateMany({
      where: { id: sessionId, title: "New Chat" },
      data: { title },
    });
  }

  static deleteSession(sessionId: string) {
    return prisma.workspaceChatSession.delete({ where: { id: sessionId } });
  }
}
