"use client";
import { useMemo } from "react";
import { useDiaryStore } from "@/stores/diary-store";
import { participantRoster, records } from "@/lib/fixtures";
import type {
  ParticipantRecordGroup,
  ParticipantResponseStatus,
} from "@/types/diary";
export function useParticipantRecords(status: ParticipantResponseStatus) {
  const search = useDiaryStore((s) => s.search);
  const groups = useMemo<ParticipantRecordGroup[]>(
    () =>
      participantRoster.map((participant) => {
        const replies = records
          .filter((r) => r.participantId === participant.id)
          .toSorted((a, b) => a.startedAt.localeCompare(b.startedAt));
        return {
          participant,
          replies,
          tags: [...new Set(replies.toReversed().flatMap((r) => r.tags))],
          latest: replies.at(-1) ?? null,
          highQualityCount: replies.filter((r) => r.quality === "high").length,
          averageDuration: replies.length
            ? replies.reduce((sum, r) => sum + r.duration, 0) / replies.length
            : null,
        };
      }),
    [],
  );
  const filtered = useMemo(
    () =>
      groups.filter((g) => {
        if (
          (status === "responded" && !g.replies.length) ||
          (status === "pending" && g.replies.length)
        )
          return false;
        const query = search.trim().toLowerCase();
        const searchable = [
          g.participant.id,
          g.participant.name,
          ...g.replies.map((r) => r.id),
          ...g.tags,
        ]
          .join(" ")
          .toLowerCase();
        return searchable.includes(query);
      }),
    [groups, status, search],
  );
  return { groups, filtered };
}
