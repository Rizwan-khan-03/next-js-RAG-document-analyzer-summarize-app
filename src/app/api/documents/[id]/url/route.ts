import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { supabase } from "@/lib/supabase/supabase";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const document = await prisma.document.findUnique({
      where: { id },
      select: {
        filePath: true,
      },
    });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    console.log("Storage path:", document.filePath);

    const { data, error } = await supabase.storage
      .from("documents")
      .createSignedUrl(document.filePath, 60 * 60);

    if (error || !data?.signedUrl) {
      console.error("SIGNED URL ERROR:", error);

      return NextResponse.json(
        { error: "Failed to create signed URL" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: data.signedUrl,
    });
  } catch (error) {
    console.error("DOCUMENT URL ERROR:", error);

    return NextResponse.json(
      { error: "Failed to generate PDF URL" },
      { status: 500 }
    );
  }
}