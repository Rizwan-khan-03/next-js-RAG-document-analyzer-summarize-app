import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  const { workspaceId } = await params;
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    select: { id: true },
  });

  if (!workspace) {
    return NextResponse.json({ error: "Workspace not found." }, { status: 404 });
  }

  await prisma.workspace.delete({ where: { id: workspaceId } });
  return new NextResponse(null, { status: 204 });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  const { workspaceId } = await params;
  const body = await request.json().catch(() => null) as { title?: unknown } | null;
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  if (!title) return NextResponse.json({ error: "A workspace title is required." }, { status: 400 });

  try {
    const workspace = await prisma.workspace.update({ where: { id: workspaceId }, data: { title } });
    return NextResponse.json({ id: workspace.id, title: workspace.title });
  } catch {
    return NextResponse.json({ error: "Workspace not found." }, { status: 404 });
  }
}
