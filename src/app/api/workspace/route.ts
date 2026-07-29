import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma/client";

const workspaceInclude = {
  documents: {
    include: {
      document: true,
    },
    orderBy: {
      createdAt: "asc" as const,
    },
  },
} satisfies Prisma.WorkspaceInclude;

type WorkspaceWithDocuments = Prisma.WorkspaceGetPayload<{
  include: typeof workspaceInclude;
}>;

function serializeWorkspace(workspace: WorkspaceWithDocuments) {
  return {
    id: workspace.id,
    title: workspace.title,
    documents: workspace.documents.map(({ document }) => ({
      id: document.id,
      title: document.fileName,
      pages: 0,
      fileUrl: document.filePath,
    })),
  };
}

export async function GET() {
  const workspaces = await prisma.workspace.findMany({
    include: workspaceInclude,
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(workspaces.map(serializeWorkspace));
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const title = typeof body?.title === "string" ? body.title.trim() : "";

  if (!title) {
    return NextResponse.json({ error: "A workspace title is required." }, { status: 400 });
  }

  const workspace = await prisma.workspace.create({
    data: { title },
    include: workspaceInclude,
  });

  return NextResponse.json(serializeWorkspace(workspace), { status: 201 });
}
