"use client";
import { useCallback } from "react";
import { useDiaryStore } from "@/stores/diary-store";
import { zh, en, type Key } from "@/i18n/messages";
export function useTranslation() {
  const locale = useDiaryStore((s) => s.locale);
  return useCallback(
    (key: Key, values: Record<string, string | number> = {}) =>
      Object.entries(values).reduce(
        (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
        (locale === "zh" ? zh : en)[key] as string,
      ),
    [locale],
  );
}
