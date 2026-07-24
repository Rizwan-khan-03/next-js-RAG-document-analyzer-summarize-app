"use client";

interface ResponseToolbarProps {
  messageId: string;
  content: string;
  loading: boolean;
  feedback: "LIKE" | "DISLIKE" | null;
  copied: boolean;
  onCopy: () => void;
  onRegenerate: () => void;
  onFeedback: (type: "LIKE" | "DISLIKE") => void;
  onShare: () => void;
  onExport: (format: "md" | "txt") => void;
}

export default function ResponseToolbar({
  messageId,
  content,
  loading,
  feedback,
  copied,
  onCopy,
  onRegenerate,
  onFeedback,
  onShare,
  onExport,
}: ResponseToolbarProps) {
  const actions = [
    {
      key: "copy",
      label: copied ? "✓ Copied" : "📋 Copy",
      onClick: onCopy,
      disabled: false,
    },
    {
      key: "regenerate",
      label: "🔄 Regenerate",
      onClick: onRegenerate,
      disabled: !content || loading,
    },
    {
      key: "like",
      label: "👍 Helpful",
      onClick: () => onFeedback("LIKE"),
      disabled: false,
      active: feedback === "LIKE",
      activeClassName: "border-blue-400 bg-blue-50 text-blue-700",
    },
    {
      key: "dislike",
      label: "👎 Not Helpful",
      onClick: () => onFeedback("DISLIKE"),
      disabled: false,
      active: feedback === "DISLIKE",
      activeClassName: "border-amber-400 bg-amber-50 text-amber-700",
    },
    {
      key: "share",
      label: "📤 Share",
      onClick: onShare,
      disabled: false,
    },
    {
      key: "export-md",
      label: "📥 Export .md",
      onClick: () => onExport("md"),
      disabled: false,
    },
    {
      key: "export-txt",
      label: "📥 Export .txt",
      onClick: () => onExport("txt"),
      disabled: false,
    },
  ];

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-200/80 pt-3" aria-label={`Toolbar for message ${messageId}`}>
      {actions.map((action) => (
        <button
          key={action.key}
          type="button"
          onClick={action.onClick}
          disabled={action.disabled}
          className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 ${action.active ? action.activeClassName : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"}`}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
