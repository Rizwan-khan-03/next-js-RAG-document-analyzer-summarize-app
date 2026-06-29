import { prisma } from "@/lib/prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  const totalDocuments = await prisma.document.count();

  const processedDocuments = await prisma.document.count({
    where: {
      status: "PROCESSED",
    },
  });

  const pendingDocuments = await prisma.document.count({
    where: {
      status: "UPLOADED",
    },
  });

  return NextResponse.json({
    totalDocuments,
    processedDocuments,
    pendingDocuments,
  });
}