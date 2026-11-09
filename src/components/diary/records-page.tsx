"use client";
import { useState } from "react";
import { Download, Search, Sparkles, Radio, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/hooks/use-translation";
import { useParticipantRecords } from "@/hooks/use-participant-records";
import { useDiaryStore } from "@/stores/diary-store";
import { initialStudy, records } from "@/lib/fixtures";
import { downloadRecords, formatDuration } from "@/lib/diary-rules";
import type { Key } from "@/i18n/messages";
import { cn } from "@/lib/utils";
export function RecordsPage() {
  const t = useTranslation();
  const search = useDiaryStore((s) => s.search);
  const setSearch = useDiaryStore((s) => s.setSearch);
  const clear = useDiaryStore((s) => s.clearFilters);
  const open = useDiaryStore((s) => s.open);
  const notify = useDiaryStore((s) => s.notify);
  const [live, setLive] = useState(false);
  const { groups, filtered } = useParticipantRecords("all");
  const storeQuestions = useDiaryStore((s) => s.study.questions);
  const questions = storeQuestions.length
    ? storeQuestions
    : initialStudy.questions;
  const [collapsed, setCollapsed] = useState<number[]>([]);
  const orders = Array.from(
    { length: Math.max(4, ...records.map((r) => r.order)) },
    (_, i) => i + 1,
  );
  return (
    <div className="w-full bg-card">
      <div className="flex h-12 items-stretch justify-center gap-2 border-b border-border">
        <Button
          variant="ghost"
          className={cn(
            "h-full rounded-none border-b-2",
            !live ? "border-indigo-500 text-primary" : "border-transparent",
          )}
          onClick={() => setLive(false)}
        >
          <FileText />
          {t("replyList")}
        </Button>
        <Button
          variant="ghost"
          className={cn(
            "h-full rounded-none border-b-2",
            live ? "border-indigo-500 text-primary" : "border-transparent",
          )}
          onClick={() => setLive(true)}
        >
          {t("live")}
        </Button>
      </div>
      {live ? (
        <section className="flex min-h-80 flex-col items-center justify-center bg-card p-8 text-center">
          <Radio className="size-8 text-muted-foreground" />
          <h2 className="mt-4 text-base font-semibold">{t("noLive")}</h2>
          <p className="mt-2 text-muted-foreground">{t("liveHint")}</p>
          <Button
            variant="outline"
            className="mt-6"
            onClick={() => setLive(false)}
          >
            {t("replyList")}
          </Button>
        </section>
      ) : (
        <section className="px-6 pt-6 pb-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-baseline gap-3">
              <h2 className="text-base font-semibold">
                {t("interviewRecords")}
              </h2>
              <span className="text-xs text-muted-foreground">
                {t("peopleAndReplies", {
                  people: groups.length,
                  replies: records.length,
                })}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                onClick={() => open({ kind: "column" })}
              >
                <Sparkles />
                {t("aiColumn")}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  downloadRecords(
                    filtered.flatMap((g) => g.replies),
                    (
                      [
                        "replyId",
                        "participant",
                        "orderCount",
                        "startedAt",
                        "activeTime",
                        "qualityScore",
                        "sessionSummary",
                      ] as Key[]
                    ).map((k) => t(k)),
                  );
                  notify("peopleExported");
                }}
              >
                <Download />
                {t("export")}
              </Button>
            </div>
          </div>
          <div className="my-4 flex flex-wrap items-center gap-2">
            <div className="relative w-full sm:w-56">
              <Search className="pointer-events-none absolute top-2.5 left-3 size-4 text-muted-foreground" />
              <Input
                className="pl-9"
                aria-label={t("searchPeople")}
                placeholder={t("searchPeople")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {search && (
              <Button
                variant="link"
                size="sm"
                onClick={() => {
                  clear();
                }}
              >
                {t("clear")}
              </Button>
            )}
          </div>
          <div
            className="overflow-x-auto rounded-lg border border-border bg-card thin-scroll"
            data-testid="session-table-scroll"
          >
            <table
              className="w-full table-fixed text-left text-[13px]"
              style={{
                minWidth:
                  696 +
                  orders.reduce(
                    (sum, n) =>
                      sum +
                      250 +
                      (collapsed.includes(n) ? 0 : questions.length * 220),
                    0,
                  ),
              }}
            >
              <colgroup>
                <col style={{ width: 170 }} />
                <col style={{ width: 100 }} />
                <col style={{ width: 150 }} />
                <col style={{ width: 96 }} />
                <col style={{ width: 90 }} />
                <col style={{ width: 90 }} />
                {orders.flatMap((n) => [
                  <col key={`${n}-summary`} style={{ width: 250 }} />,
                  ...(!collapsed.includes(n)
                    ? questions.map((q) => (
                        <col key={`${n}-${q.id}`} style={{ width: 220 }} />
                      ))
                    : []),
                ])}
              </colgroup>
              <thead className="bg-gray-50 text-xs text-muted-foreground">
                <tr>
                  {(
                    [
                      "onlineUser",
                      "responseCount",
                      "startedAt",
                      "activeTime",
                      "status",
                      "qualityScore",
                    ] as Key[]
                  ).map((k, i) => (
                    <th
                      key={k}
                      rowSpan={2}
                      scope="col"
                      className={cn(
                        "border-r border-border px-4 py-3 font-medium whitespace-nowrap",
                        i === 0 && "sticky left-0 z-10 bg-gray-50",
                        i === 1 && "sticky left-[170px] z-10 bg-gray-50",
                      )}
                    >
                      {t(k)}
                    </th>
                  ))}
                  {orders.map((n) => (
                    <th
                      key={n}
                      colSpan={
                        1 + (collapsed.includes(n) ? 0 : questions.length)
                      }
                      scope="colgroup"
                      className="border-l border-border px-4 py-2.5 font-medium text-muted-foreground"
                      data-testid="session-column"
                      data-session-order={n}
                    >
                      <button
                        className="flex items-center gap-2 rounded px-1 py-0.5 text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                        aria-expanded={!collapsed.includes(n)}
                        aria-label={`${t(collapsed.includes(n) ? "expandSession" : "collapseSession")} ${t("order", { n })}`}
                        onClick={() =>
                          setCollapsed((prev) =>
                            prev.includes(n)
                              ? prev.filter((x) => x !== n)
                              : [...prev, n],
                          )
                        }
                      >
                        <span
                          aria-hidden="true"
                          className="text-sm leading-none"
                        >
                          {collapsed.includes(n) ? "+" : "−"}
                        </span>
                        <span>{t("order", { n })}</span>
                      </button>
                    </th>
                  ))}
                </tr>
                <tr className="border-t border-border">
                  {orders.flatMap((n) => [
                    <th
                      key={`${n}-summary`}
                      scope="col"
                      className="border-l border-border px-4 py-3 font-medium"
                    >
                      {t("sessionSummary")}
                    </th>,
                    ...(!collapsed.includes(n)
                      ? questions.map((q) => (
                          <th
                            key={`${n}-${q.id}`}
                            scope="col"
                            title={q.title}
                            className="border-l border-border px-4 py-3 font-medium"
                          >
                            <span className="line-clamp-2 leading-5">
                              {q.id} · {q.title}
                            </span>
                          </th>
                        ))
                      : []),
                  ])}
                </tr>
              </thead>
              <tbody>
                {filtered.map((g) => (
                  <tr
                    key={g.participant.id}
                    className="group border-t border-border"
                    data-testid="participant-row"
                    data-participant={g.participant.id}
                  >
                    <td className="sticky left-0 z-10 bg-card px-4 py-4 align-top font-medium whitespace-nowrap group-hover:bg-gray-50">
                      {g.participant.id} · {g.participant.name}
                    </td>
                    <td
                      className="sticky left-[170px] z-10 border-r border-border bg-card px-4 py-4 align-top tabular-nums group-hover:bg-gray-50"
                      data-testid="response-count"
                    >
                      {t("responseTimes", { n: g.replies.length })}
                    </td>
                    <td className="px-4 py-4 align-top text-xs tabular-nums">
                      {g.replies[0]?.startedAt ?? "—"}
                    </td>
                    <td className="px-4 py-4 align-top text-xs tabular-nums">
                      {g.replies.length
                        ? formatDuration(
                            g.replies.reduce((sum, r) => sum + r.duration, 0),
                          )
                        : "—"}
                    </td>
                    <td className="px-4 py-4 align-top">
                      <span className="text-xs text-muted-foreground">
                        {t(g.replies.length ? "hasResponses" : "noResponse")}
                      </span>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <span className="text-xs text-muted-foreground">
                        {g.latest
                          ? t(g.latest.quality === "high" ? "high" : "medium")
                          : "—"}
                      </span>
                    </td>
                    {orders.flatMap((n) => {
                      const r = g.replies.find((reply) => reply.order === n);
                      const summaryCellClass =
                        "border-l border-border px-4 py-3 align-top group-hover:bg-gray-50";
                      const cellClass =
                        "border-l border-border px-4 py-3 align-top group-hover:bg-gray-50";
                      return [
                        <td
                          key={`${n}-summary`}
                          data-testid="session-cell"
                          data-order={n}
                          className={summaryCellClass}
                        >
                          {r ? (
                            <button
                              className="w-full text-left outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
                              onClick={() => open({ kind: "record", id: r.id })}
                              aria-label={t("viewSession", {
                                name: g.participant.name,
                                n,
                              })}
                            >
                              <p className="line-clamp-3 text-[13px] leading-6">
                                {r.summary ?? t("noSessionSummary")}
                              </p>
                              <p className="mt-2 text-[11px] text-placeholder">
                                {r.startedAt}
                              </p>
                            </button>
                          ) : (
                            <span className="text-xs text-placeholder">
                              {t("noSessionRecord")}
                            </span>
                          )}
                        </td>,
                        ...(!collapsed.includes(n)
                          ? questions.map((q) => {
                              const answer = r?.answers.find(
                                (a) => a.questionId === q.id,
                              );
                              const asked =
                                q.rule.kind === "always" ||
                                (q.rule.kind === "equals" &&
                                  n === q.rule.count) ||
                                (q.rule.kind === "atLeast" &&
                                  n >= q.rule.count);
                              return (
                                <td
                                  key={`${n}-${q.id}`}
                                  data-testid="question-answer"
                                  data-order={n}
                                  data-question={q.id}
                                  className={cellClass}
                                >
                                  {answer && r ? (
                                    <button
                                      className="w-full text-left text-[13px] leading-6 outline-none hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
                                      title={answer.text}
                                      aria-label={`${t("viewSession", { name: g.participant.name, n })} · ${q.id}`}
                                      onClick={() =>
                                        open({
                                          kind: "record",
                                          id: r.id,
                                          questionId: q.id,
                                        })
                                      }
                                    >
                                      <span className="line-clamp-3">
                                        {answer.text}
                                      </span>
                                    </button>
                                  ) : (
                                    <span className="text-xs text-placeholder">
                                      {!r
                                        ? "—"
                                        : t(
                                            asked
                                              ? "noQuestionAnswer"
                                              : "notAsked",
                                          )}
                                    </span>
                                  )}
                                </td>
                              );
                            })
                          : []),
                      ];
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            {!filtered.length && (
              <div className="p-12 text-center text-muted-foreground">
                <p>{t("noPeople")}</p>
                <p className="mt-2 text-xs">{t("noRecordsHint")}</p>
              </div>
            )}
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {t("peopleShowing", { n: filtered.length, total: groups.length })}
            </span>
            <span>{t("pageOne")}</span>
          </div>
        </section>
      )}
    </div>
  );
}
