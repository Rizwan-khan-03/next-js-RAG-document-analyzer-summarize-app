import ChatPanel from "@/components/chat/ChatPanel";
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
    <div className="p-8">
      <h1 className="text-3xl font-bold">
        {document?.fileName}
      </h1>

      <p className="mt-4">
        Status: {document?.status}
      </p>

      <p className="mt-2">
        Created:
        {" "}
        {new Date(
          document?.createdAt
        ).toLocaleString()}
      </p>

      <div className="mt-8">
        <h2 className="text-xl font-semibold">
          Extracted Text
        </h2>

        <pre className="mt-4 whitespace-pre-wrap border p-4 rounded">
          {document?.extractedText}
        </pre>
      </div>
      <ChatPanel documentId={document.id} />
    </div>
  );
}