import type { CSSProperties } from "react";

export type IconName =
  | "spark"
  | "arrow"
  | "network"
  | "grid"
  | "book"
  | "shield"
  | "chevron"
  | "check"
  | "plus"
  | "search"
  | "close"
  | "heart"
  | "message";
const paths: Record<IconName, string> = {
  spark: "m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z",
  arrow: "M4 12h16m-6-6 6 6-6 6",
  network:
    "M9 5a3 3 0 1 0 6 0 3 3 0 0 0-6 0ZM2 19a3 3 0 1 0 6 0 3 3 0 0 0-6 0Zm14 0a3 3 0 1 0 6 0 3 3 0 0 0-6 0ZM10 8l-4 8m8-8 4 8M8 19h8",
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  book: "M12 5v16m0-16C8 2 4 3 2 4v15c3-1 7-1 10 2 3-3 7-3 10-2V4c-2-1-6-2-10 1Z",
  shield: "m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Zm-4 9 3 3 5-6",
  chevron: "m9 5 7 7-7 7",
  check: "m5 12 4 4L19 6",
  plus: "M12 5v14M5 12h14",
  search: "M21 21l-5-5M3 10a7 7 0 1 0 14 0 7 7 0 0 0-14 0Z",
  close: "m6 6 12 12M6 18 18 6",
  heart: "M3 12h4l3-7 4 14 3-7h4",
  message: "M4 4h16v12H9l-5 4V4Z",
};
export default function Icon({
  name,
  className = "",
  style,
}: {
  name: IconName;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      aria-hidden="true"
      className={`icon ${className}`}
      style={style}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={paths[name]} />
    </svg>
  );
}
