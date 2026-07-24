import { createElement, Fragment, type ReactNode } from "react";

/** Renders text with every case-insensitive search match highlighted. */
export function highlightText(text: string, searchText: string): ReactNode {
  const query = searchText.trim();

  if (!query) return text;

  const pattern = new RegExp(`(${escapeRegExp(query)})`, "gi");
  return text.split(pattern).map((part, index) =>
    part.toLocaleLowerCase() === query.toLocaleLowerCase()
      ? createElement("mark", { key: index, className: "rounded bg-yellow-200 px-0.5 text-inherit" }, part)
      : createElement(Fragment, { key: index }, part)
  );
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
