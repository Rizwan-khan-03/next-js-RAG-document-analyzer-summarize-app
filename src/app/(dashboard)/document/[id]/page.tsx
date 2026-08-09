import { prisma } from "@/lib/prisma/client";
import { notFound } from "next/navigation";

import { getDocumentSignedUrl } from "@/lib/supabase/document-url";

import DocumentWorkspace from "@/components/documents/DocumentWorkspace";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function DocumentPage({
  params,
}: PageProps) {

  const { id } = await params;

  const document = await prisma.document.findUnique({
    where: {
      id,
    },
  });

  if (!document) {
    notFound();
  }

  // Generate signed URL on server
  const signedUrl = await getDocumentSignedUrl(
    document.filePath
  );

  return (
    <DocumentWorkspace
      document={{
        ...document,
        fileUrl: signedUrl,
      }}
    />
  );
}