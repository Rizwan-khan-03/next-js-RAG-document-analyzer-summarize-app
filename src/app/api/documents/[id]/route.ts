import { NextResponse } from "next/server";
import { DocumentService } from "@/lib/services/document.service";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const document =
    await DocumentService.getDocument(id);

  return NextResponse.json(document);
}