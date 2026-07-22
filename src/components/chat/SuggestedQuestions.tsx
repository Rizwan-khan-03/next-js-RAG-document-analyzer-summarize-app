interface SuggestedQuestion {
  id: string;
  title: string;
  prompt: string;
}

interface SuggestedQuestionsProps {
  suggestions: SuggestedQuestion[];
  onSelect: (prompt: string) => void;
}

export default function SuggestedQuestions({
  suggestions,
  onSelect,
}: SuggestedQuestionsProps) {
  return (
    <div className="rounded-2xl border border-slate-700/80 bg-slate-900/70 p-4 shadow-sm shadow-black/20">
      <div className="mb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
          Suggested Questions
        </p>
        <p className="mt-1 text-sm text-slate-300">
          Start with one of these prompts to explore the document quickly.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.id}
            onClick={() => onSelect(suggestion.prompt)}
            className="rounded-xl border border-slate-700 bg-slate-800/70 p-3 text-left transition duration-200 hover:-translate-y-0.5 hover:border-sky-500 hover:bg-slate-800"
          >
            <div className="text-sm font-semibold text-white">{suggestion.title}</div>
            <div className="mt-2 text-sm text-slate-400">{suggestion.prompt}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
