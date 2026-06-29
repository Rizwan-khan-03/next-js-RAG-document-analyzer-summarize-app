import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";
import { prisma } from "@/lib/prisma/client";
// import { extractPdfText } from "@/lib/ingestion/pdf";
import { processDocument } from "@/lib/ingestion/processDocument";
export async function POST(req: Request) {
    try {
        const data = await req.formData();

        const file = data.get("file") as File;

        if (!file) {
            return NextResponse.json(
                { error: "No file uploaded" },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const filePath = path.join(
            process.cwd(),
            "uploads",
            file.name
        );

        await writeFile(filePath, buffer);
        // const extractedText = await extractPdfText(filePath);
        // const extractedText = "TEST";
        const document = await prisma.document.create({
            data: {
                fileName: file.name,
                filePath,
                status: "PROCESSING",
            },
        });
        const processedDocument =
            await processDocument(
                document.id,
                filePath
            );

        return NextResponse.json({
            success: true,
            document: processedDocument,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { error: "Upload failed" },
            { status: 500 }
        );
    }
}


export async function GET() {
    const documents = await prisma.document.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });

    return NextResponse.json(documents);
}