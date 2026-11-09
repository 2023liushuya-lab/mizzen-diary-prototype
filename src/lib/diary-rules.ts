import { initialStudy } from "@/lib/fixtures";
import type { DiaryConfig, DiaryRecord, Question } from "@/types/diary";
export function configError(c: DiaryConfig): "dateError" | "limitError" | null {
  if (!c.start || !c.end || c.end < c.start) return "dateError";
  for (const limit of [c.daily, c.total])
    if (
      limit.kind === "limited" &&
      (!Number.isInteger(limit.count) || limit.count < 1)
    )
      return "limitError";
  if (
    !Number.isFinite(c.minInterval) ||
    c.minInterval < 0 ||
    !Number.isFinite(c.reminderHours) ||
    c.reminderHours < 1
  )
    return "limitError";
  return null;
}
export function visibleQuestions(questions: Question[], order: number) {
  return questions.filter(
    (q) =>
      q.rule.kind === "always" ||
      (q.rule.kind === "equals" && order === q.rule.count) ||
      (q.rule.kind === "atLeast" && order >= q.rule.count),
  );
}
export function filterRecords(
  records: DiaryRecord[],
  search: string,
  tags: string[],
) {
  const s = search.toLowerCase().trim();
  return records.filter(
    (r) =>
      [r.id, r.participantId, r.name, ...r.tags]
        .join(" ")
        .toLowerCase()
        .includes(s) &&
      tags.every((tag) => tag === `order:${r.order}` || r.tags.includes(tag)),
  );
}
export function formatDuration(seconds: number) {
  const n = Math.round(seconds);
  return `${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}`;
}
export function dateAfter(start: string, days: number) {
  const date = new Date(`${start}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days - 1);
  return date.toISOString().slice(0, 10);
}
export function downloadRecords(rows: DiaryRecord[], headers: string[]) {
  const csv =
    "\uFEFF" +
    [
      [
        ...headers,
        ...initialStudy.questions.map((q) => `${q.id} · ${q.title}`),
      ],
      ...rows.map((r) => [
        r.id,
        r.participantId,
        r.order,
        r.startedAt,
        formatDuration(r.duration),
        r.quality,
        r.summary ?? "",
        ...initialStudy.questions.map(
          (q) => r.answers.find((a) => a.questionId === q.id)?.text ?? "",
        ),
      ]),
    ]
      .map((row) =>
        row.map((v) => '"' + String(v).replaceAll('"', '""') + '"').join(","),
      )
      .join("\r\n");
  const url = URL.createObjectURL(
    new Blob([csv], { type: "text/csv;charset=utf-8" }),
  );
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "mizzen-diary-demo.csv";
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
