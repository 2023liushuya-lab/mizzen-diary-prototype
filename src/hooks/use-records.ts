"use client";
import { useMemo } from "react";
import { useDiaryStore } from "@/stores/diary-store";
import { records } from "@/lib/fixtures";
import { filterRecords } from "@/lib/diary-rules";
export function useRecords() {
  const search = useDiaryStore((s) => s.search);
  const tags = useDiaryStore((s) => s.tags);
  return useMemo(() => filterRecords(records, search, tags), [search, tags]);
}
