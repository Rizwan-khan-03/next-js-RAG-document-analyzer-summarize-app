import { prisma } from "@/lib/prisma/client";

export type FeedbackType = "LIKE" | "DISLIKE";

export class ChatService {
    static async ensureFeedbackColumn() {
        await prisma.$executeRawUnsafe(
            'ALTER TABLE "ChatMessage" ADD COLUMN IF NOT EXISTS "feedback" TEXT;'
        );
    }

    static async saveMessage({
        sessionId,
        role,
        content,
        sources,
    }: {
        sessionId: string;
        role: "user" | "assistant";
        content: string;
        sources?: any;
    }) {
        return prisma.chatMessage.create({
            data: {
                sessionId,
                role,
                content,
                sources,
            },
        });
    }

    static async getMessages(sessionId: string) {
        try {
            return await prisma.chatMessage.findMany({
                where: {
                    sessionId,
                },
                orderBy: {
                    createdAt: "asc",
                },
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);

            if (message.includes("feedback") && message.includes("does not exist")) {
                await this.ensureFeedbackColumn();

                return prisma.chatMessage.findMany({
                    where: {
                        sessionId,
                    },
                    orderBy: {
                        createdAt: "asc",
                    },
                });
            }

            throw error;
        }
    }

    static async updateMessageFeedback(messageId: string, feedback: FeedbackType | null) {
        try {
            return await prisma.chatMessage.update({
                where: {
                    id: messageId,
                },
                data: {
                    feedback,
                },
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);

            if (message.includes("feedback") && message.includes("does not exist")) {
                await this.ensureFeedbackColumn();

                return prisma.chatMessage.update({
                    where: {
                        id: messageId,
                    },
                    data: {
                        feedback,
                    },
                });
            }

            throw error;
        }
    }

    static async updateMessageContent(
        messageId: string,
        {
            content,
            sources,
        }: {
            content: string;
            sources?: any;
        }
    ) {
        return prisma.chatMessage.update({
            where: {
                id: messageId,
            },
            data: {
                content,
                sources,
            },
        });
    }
    static async getSessions(documentId: string) {
        return prisma.chatSession.findMany({
            where: {
                documentId,
            },
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
    static async createSession(documentId: string) {
        return prisma.chatSession.create({
            data: {
                documentId,
                title: "New Chat",
            },
        });
    }
    static async updateSessionTitleIfNeeded(
        sessionId: string,
        title: string
    ) {
        return prisma.chatSession.updateMany({
            where: {
                id: sessionId,
                title: "New Chat",
            },
            data: {
                title,
            },
        });
    }

    static async deleteSession(sessionId: string) {
        return prisma.chatSession.delete({
            where: {
                id: sessionId,
            },
        });
    }
}