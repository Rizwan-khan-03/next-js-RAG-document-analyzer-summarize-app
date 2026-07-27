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
