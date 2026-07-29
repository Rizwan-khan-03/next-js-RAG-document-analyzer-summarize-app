import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ workspaceId: string; documentId: string }> }
) {
  const { workspaceId, documentId } = await params;
  const result = await prisma.workspaceDocument.deleteMany({
    where: { workspaceId, documentId },
  });

  if (!result.count) {
    return NextResponse.json({ error: "Workspace document not found." }, { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
}
