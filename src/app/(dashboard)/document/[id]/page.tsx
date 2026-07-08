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
  <div className="max-w-6xl mx-auto p-8 space-y-6">
    {/* Document Header */}
    <div className="bg-white rounded-lg shadow border p-6">
      <h1 className="text-3xl font-bold">
        {document?.fileName}
      </h1>

      <div className="mt-4 flex gap-8 text-gray-600">
        <p>
          <span className="font-semibold">Status:</span>{" "}
          <span
            className={`font-medium ${
              document?.status === "PROCESSED"
                ? "text-green-600"
                : "text-yellow-600"
            }`}
          >
            {document?.status}
          </span>
        </p>

        <p>
          <span className="font-semibold">
            Uploaded:
          </span>{" "}
          {new Date(
            document?.createdAt
          ).toLocaleString()}
        </p>
      </div>
    </div>

    {/* Summary */}
    <div className="bg-white rounded-lg shadow border p-6">
      <h2 className="text-xl font-semibold mb-4">
        📄 Summary
      </h2>

      <p className="whitespace-pre-wrap leading-7 text-gray-700">
        {document?.summary ||
          "Summary not generated yet."}
      </p>
    </div>

    {/* Keywords */}
    <div className="bg-white rounded-lg shadow border p-6">
      <h2 className="text-xl font-semibold mb-4">
        🏷 Keywords
      </h2>

      <div className="flex flex-wrap gap-3">
        {document?.keywords ? (
          document.keywords
            .split(",")
            .map((keyword: string) => (
              <span
                key={keyword}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
              >
                {keyword.trim()}
              </span>
            ))
        ) : (
          <p>No keywords available.</p>
        )}
      </div>
    </div>

    {/* Extracted Text */}
    <div className="bg-white rounded-lg shadow border p-6">
      <h2 className="text-xl font-semibold mb-4">
        📑 Extracted Text
      </h2>

      <pre className="whitespace-pre-wrap text-sm leading-7 bg-gray-50 p-4 rounded">
        {document?.extractedText}
      </pre>
    </div>

    {/* AI Chat */}
    <div className="bg-white rounded-lg shadow border p-6">
      <h2 className="text-xl font-semibold mb-4">
        🤖 Ask AI
      </h2>

      <ChatPanel documentId={document.id} />
    </div>
  </div>
);
}