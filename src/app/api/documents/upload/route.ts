import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";
import { prisma } from "@/lib/prisma/client";
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

        // Physical path on disk
        const diskPath = path.join(
            process.cwd(),
            "public",
            "uploads",
            file.name
        );

        await writeFile(diskPath, buffer);

        // URL that browser can access
        const publicPath = `/uploads/${file.name}`;

        const document = await prisma.document.create({
            data: {
                fileName: file.name,
                filePath: publicPath,
                status: "PROCESSING",
            },
        });

        await processDocument(
            document.id,
            diskPath // <-- use disk path for extraction
        );

        const processedDocument =
            await prisma.document.findUnique({
                where: {
                    id: document.id,
                },
            });

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