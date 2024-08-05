import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import QueryString from "qs";
import { kanjiMaster } from "@/constants/kanji.master";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function stringifyParams(params: Record<string, any>) {
  return QueryString.stringify(params, {
    arrayFormat: "indices",
    allowDots: true,
  });
}

export function convertWordToHanViet(lexeme: string): string {
  const kanjis = extractKanji(lexeme);
  let hanviet = "";

  for (const kanji of kanjis) {
    const hv = kanjiMaster.find((item) => item.kanji === kanji);
    if (hv) {
      hanviet += `${hv.hanviet} `;
    }
  }

  if (hanviet.length > 0) {
    return hanviet.slice(0, -1);
  }

  return hanviet;
}

function extractKanji(word: string): string[] {
  // Regex để tìm chữ Hán
  const kanjiRegex = /[\u4e00-\u9faf]/g;

  const kanjiArray = word.match(kanjiRegex);

  return kanjiArray || [];
}
