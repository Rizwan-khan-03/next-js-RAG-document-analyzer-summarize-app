import { prisma } from "@/lib/prisma/client";
console.log("Prisma Keys:", Object.keys(prisma));
export class ChatService {
    // static async getOrCreateSession(documentId: string) {
    //     let session = await prisma.chatSession.findFirst({
    //         where: {
    //             documentId,
    //         },
    //         orderBy: {
    //             createdAt: "asc",
    //         },
    //     });

    //     if (!session) {
    //         session = await prisma.chatSession.create({
    //             data: {
    //                 documentId,
    //             },
    //         });
    //     }

    //     return session;
    // }
    static async getOrCreateSession(documentId: string) {
        console.log("Prisma Client:", prisma);

        console.log("chatSession:", prisma.chatSession);

        let session = await prisma.chatSession.findFirst({
            where: {
                documentId,
            },
        });

        console.log("Found:", session);

        if (!session) {
            session = await prisma.chatSession.create({
                data: {
                    documentId,
                },
            });
        }

        return session;
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
}