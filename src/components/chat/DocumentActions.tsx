interface DocumentActionsProps {
  onAction: (prompt: string) => void;
}

const actions = [
  {
    id: "summarize",
    label: "📝 Summarize",
    prompt: "Summarize this document in concise bullet points.",
  },
  {
    id: "explain",
    label: "📌 Explain Simply",
    prompt: "Explain this document in simple language that anyone can understand.",
  },
  {
    id: "dates",
    label: "📅 Extract Dates",
    prompt: "Extract every important date from this document and explain why each date matters.",
  },
  {
    id: "finance",
    label: "💰 Extract Financial Values",
    prompt: "Extract every financial amount from this document in a table with description and value.",
  },
  {
    id: "people",
    label: "👤 Extract People",
    prompt: "List every person mentioned in this document along with their role.",
  },
  {
    id: "notes",
    label: "📋 Create Notes",
    prompt: "Generate clean study notes from this document with headings and bullet points.",
  },
  {
    id: "email",
    label: "📧 Draft Email",
    prompt: "Write a professional email summarizing this document.",
  },
  {
    id: "translate",
    label: "🌍 Translate",
    prompt: "Translate this entire document into simple English while preserving meaning.",
  },
];

export default function DocumentActions({ onAction }: DocumentActionsProps) {
  return (
    <div className="rounded-2xl border border-slate-700/80 bg-slate-900/70 p-4 shadow-sm shadow-black/20">
      <div className="mb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
          AI Actions
        </p>
        <p className="mt-1 text-sm text-slate-300">
          Run common document tasks with one click.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={() => onAction(action.prompt)}
            className="rounded-xl border border-slate-700 bg-slate-800/70 px-3 py-2 text-sm font-medium text-slate-200 transition duration-200 hover:-translate-y-0.5 hover:border-sky-500 hover:bg-slate-800"
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
