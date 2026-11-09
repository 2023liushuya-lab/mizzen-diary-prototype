"use client";
import { useTranslation } from "@/hooks/use-translation";
import { useDiaryStore } from "@/stores/diary-store";
import type { Key } from "@/i18n/messages";
export function SourceRef({ id }: { id: string }) {
  const open = useDiaryStore((s) => s.open);
  return (
    <button
      className="mx-1 text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring"
      onClick={() => open({ kind: "record", id })}
    >
      [{id}]
    </button>
  );
}
const paragraphs: {
  title: Key;
  lines: { key: Key; refs: string[] }[];
  note: Key;
}[] = [
  {
    title: "a0title",
    lines: [
      { key: "a0p1", refs: ["R001", "R003", "R005"] },
      { key: "a0p2", refs: ["R002", "R006"] },
      { key: "a0p3", refs: ["R004", "R008"] },
    ],
    note: "a0note",
  },
  {
    title: "a1title",
    lines: [
      { key: "a1p1", refs: ["R001", "R003"] },
      { key: "a1p2", refs: ["R005"] },
    ],
    note: "a1note",
  },
  {
    title: "a2title",
    lines: [
      { key: "a2p1", refs: ["R001", "R005"] },
      { key: "a2p2", refs: ["R002", "R006", "R004", "R008"] },
    ],
    note: "a2note",
  },
];
export function AnalysisAnswer({ skill }: { skill: number | null }) {
  const t = useTranslation();
  if (skill === null) return <p>{t("notConnected")}</p>;
  if (skill < 3) {
    const a = paragraphs[skill];
    return (
      <div className="space-y-4">
        <p className="font-semibold">{t(a.title)}</p>
        {a.lines.map((p) => (
          <p key={p.key}>
            {t(p.key)}
            {p.refs.map((id) => (
              <SourceRef key={id} id={id} />
            ))}
          </p>
        ))}
        <p className="text-muted-foreground">{t(a.note)}</p>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <p className="font-semibold">{t("a3title")}</p>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[420px] text-left text-sm">
          <thead className="bg-surface text-muted-foreground">
            <tr>
              {(["scene", "friction", "evidence"] as const).map((k) => (
                <th key={k} className="px-4 py-3 font-medium">
                  {t(k)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(
              [
                {
                  scene: "commute",
                  friction: "categoryIssue",
                  refs: ["R002", "R006"],
                },
                { scene: "office", friction: "voiceIssue", refs: ["R004"] },
                {
                  scene: "receipt",
                  friction: "recognitionIssue",
                  refs: ["R001", "R003"],
                },
              ] as { scene: Key; friction: Key; refs: string[] }[]
            ).map((r) => (
              <tr key={r.scene} className="border-t border-border">
                <td className="px-4 py-3">{t(r.scene)}</td>
                <td className="px-4 py-3">{t(r.friction)}</td>
                <td className="px-4 py-3">
                  {r.refs.map((id) => (
                    <SourceRef key={id} id={id} />
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-muted-foreground">{t("a3note")}</p>
    </div>
  );
}
