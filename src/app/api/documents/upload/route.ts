import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";
import { processDocument } from "@/lib/ingestion/processDocument";
import { supabase } from "@/lib/supabase/supabase";

export async function POST(req: Request) {
  try {
    const data = await req.formData();

    const file = data.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileName = `${Date.now()}-${file.name}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(fileName, buffer, {
        contentType: file.type || "application/pdf",
        upsert: false,
      });

    if (uploadError) {
      console.error("SUPABASE UPLOAD ERROR:", uploadError);
      throw uploadError;
    }

    // IMPORTANT:
    // Store only the Storage path in DB.
    // Do NOT store public URL.
    const document = await prisma.document.create({
      data: {
        fileName: file.name,
        filePath: fileName,
        status: "PROCESSING",
      },
    });

    // Process directly using the storage path.
    await processDocument(document.id, fileName);

    const processedDocument = await prisma.document.findUnique({
      where: {
        id: document.id,
      },
    });

    return NextResponse.json({
      success: true,
      document: processedDocument,
    });
  } catch (error) {
    console.error("DOCUMENT UPLOAD ERROR:", error);

    return NextResponse.json(
      {
        error: "Upload failed",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET() {
  try {
    const documents = await prisma.document.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error("DOCUMENT GET ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch documents",
      },
      {
        status: 500,
      }
    );
  }
}