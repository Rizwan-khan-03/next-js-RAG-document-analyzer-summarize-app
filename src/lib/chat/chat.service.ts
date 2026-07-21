import { prisma } from "@/lib/prisma/client";

export class ChatService {
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
        return prisma.chatMessage.findMany({
            where: {
                sessionId,
            },
            orderBy: {
                createdAt: "asc",
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