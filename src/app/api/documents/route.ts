import { NextResponse } from "next/server";
import { DocumentService } from "@/lib/services/document.service";

export async function GET() {
  const documents =
    await DocumentService.getAllDocuments();

  return NextResponse.json(documents);
}