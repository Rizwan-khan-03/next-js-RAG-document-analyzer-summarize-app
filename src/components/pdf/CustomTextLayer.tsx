interface Props {
  text: string;
  highlight: string;
}

export default function CustomTextLayer({
  text,
  highlight,
}: Props) {
  if (!highlight) return <>{text}</>;

  const escaped = highlight.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );

  const regex = new RegExp(`(${escaped})`, "gi");

  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <mark
            key={i}
            className="bg-yellow-300 rounded px-1"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}