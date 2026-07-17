import DocumentWorkspace from "@/components/documents/DocumentWorkspace";

async function getDocument(id: string) {
  const res = await fetch(
    `http://localhost:3000/api/documents/${id}`,
    {
      cache: "no-store",
    }
  );

  return res.json();
}

export default async function DocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const { id } = await params;

  const document = await getDocument(id);

  return (
      <main className="h-screen  bg-gray-100 ">
      <DocumentWorkspace document={document} />
    </main>
  );
}