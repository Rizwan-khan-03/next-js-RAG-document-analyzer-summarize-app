import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};


export const prisma =
  globalForPrisma.prisma ?? new PrismaClient();
prisma.workspace.findMany();
prisma.workspaceDocument.findMany();
prisma.document.findMany();
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}