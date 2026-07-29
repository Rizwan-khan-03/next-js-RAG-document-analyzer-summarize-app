import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  const { workspaceId } = await params;
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    include: {
      documents: {
        include: { document: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!workspace) {
    return NextResponse.json({ error: "Workspace not found." }, { status: 404 });
  }

  return NextResponse.json(workspace.documents.map(({ document }) => ({
    id: document.id,
    title: document.fileName,
    pages: 0,
    fileUrl: document.filePath,
  })));
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  const { workspaceId } = await params;
  const body = await request.json().catch(() => null);
  const documentId = typeof body?.documentId === "string" ? body.documentId : "";

  if (!documentId) {
    return NextResponse.json({ error: "A documentId is required." }, { status: 400 });
  }

  const [workspace, document] = await Promise.all([
    prisma.workspace.findUnique({ where: { id: workspaceId }, select: { id: true } }),
    prisma.document.findUnique({ where: { id: documentId }, select: { id: true } }),
  ]);

  if (!workspace || !document) {
    return NextResponse.json({ error: "Workspace or document not found." }, { status: 404 });
  }

  try {
    await prisma.workspaceDocument.create({ data: { workspaceId, documentId } });
  } catch (error: unknown) {
    if (typeof error === "object" && error && "code" in error && error.code === "P2002") {
      return NextResponse.json({ error: "Document is already in this workspace." }, { status: 409 });
    }
    throw error;
  }

  return NextResponse.json({ id: documentId }, { status: 201 });
}
