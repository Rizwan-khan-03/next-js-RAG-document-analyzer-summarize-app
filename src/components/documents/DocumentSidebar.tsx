interface Props {
  document: any;
}

export default function DocumentSidebar({
  document,
}: Props) {
  return (
    <div className="h-full min-h-0 overflow-y-auto space-y-6 p-1">

      {/* Header */}

      <div className="rounded-xl border shadow-sm p-5">
        <h6 className="text-sm font-bold break-all">
          {document.fileName}
        </h6>

        <div className="mt-1 space-y-2 text-sm">

          <div className="text-sm flex justify-between text-gray-600 font-semibold">
            <span className="text-sm">Status</span>

            <span
              className={
                document.status === "PROCESSED"
                  ? "text-green-600 font-semibold"
                  : "text-yellow-600 font-semibold"
              }
            >
              {document.status}
            </span>
          </div>

          <div className="flex justify-between text-green-600 font-semibold">
            <span>Uploaded</span>

            <span>
              {new Date(
                document.createdAt
              ).toLocaleDateString()}
            </span>
          </div>

        </div>
      </div>
      {/* Keywords */}

      <div className="rounded-xl border shadow-sm p-5">

        <h2 className="font-semibold text-lg mb-3">
          🏷 Keywords
        </h2>

        <div className="flex flex-wrap gap-2">

          {document.keywords
            ?.split(",")
            .map((k: string) => (
              <span
                key={k}
                className="bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-xs"
              >
                {k.trim()}
              </span>
            ))}

        </div>

      </div>

      {/* Summary */}

      <div className=" rounded-xl border shadow-sm p-5">
        <h2 className="font-semibold text-lg mb-3">
          📄 Summary
        </h2>

        <p className="text-sm leading-7 whitespace-pre-wrap">
          {document.summary ||
            "Summary not available"}
        </p>
      </div>

    </div>
  );
}