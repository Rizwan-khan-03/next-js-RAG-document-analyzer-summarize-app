"use client";

interface Props {
  value: string;
  onChange: (value: string) => void;
  total: number;
  current: number;
  onNext: () => void;
  onPrev: () => void;
  onClear: () => void;
}

export default function SearchBar({
  value,
  onChange,
  total,
  current,
  onNext,
  onPrev,
  onClear,
}: Props) {
  return (
    <div className="flex items-center gap-2 border-b bg-white p-3">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search conversation..."
        className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500"
      />

      {value && (
        <>
          <span className="text-xs text-gray-500">
            {total === 0 ? "0" : current + 1}/{total}
          </span>

          <button onClick={onPrev}>↑</button>

          <button onClick={onNext}>↓</button>

          <button onClick={onClear}>✕</button>
        </>
      )}
    </div>
  );
}