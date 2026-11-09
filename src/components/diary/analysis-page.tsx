"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowUp, Sparkles, Database, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/input";
import { useDiaryStore } from "@/stores/diary-store";
import { useTranslation } from "@/hooks/use-translation";
import { records, participants } from "@/lib/fixtures";
import { AnalysisAnswer } from "./analysis-answer";
import type { Key } from "@/i18n/messages";
import { cn } from "@/lib/utils";
export function AnalysisPage() {
  const t = useTranslation();
  const messages = useDiaryStore((s) => s.messages);
  const ask = useDiaryStore((s) => s.ask);
  const clear = useDiaryStore((s) => s.clearChat);
  const open = useDiaryStore((s) => s.open);
  const [input, setInput] = useState("");
  const [tab, setTab] = useState<"data" | "chat">("chat");
  const chatRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = chatRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, tab]);
  const submit = () => {
    if (input.trim()) {
      ask(input.trim(), null);
      setInput("");
    }
  };
  return (
    <div className="flex h-[calc(100dvh-76px)] min-h-[650px] flex-col">
      <div className="flex h-[42px] shrink-0 justify-center border-b border-border bg-card">
        {(
          [
            ["data", Database],
            ["chat", MessageSquare],
          ] as const
        ).map(([v, Icon]) => (
          <button
            key={v}
            onClick={() => setTab(v)}
            className={cn(
              "flex items-center gap-2 border-b-2 px-5 text-sm font-medium",
              tab === v
                ? "border-indigo-500 text-primary"
                : "border-transparent text-muted-foreground",
            )}
          >
            <Icon className="size-4" />
            {t(v)}
          </button>
        ))}
      </div>
      {tab === "data" ? (
        <div className="mx-auto w-full max-w-5xl overflow-y-auto px-6 py-8">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold">{t("sourceScope")}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("participantCount", { n: participants.length })}
              </p>
            </div>
            <Badge>{t("sourceCount", { n: records.length })}</Badge>
          </div>
          <div className="divide-y divide-border rounded-xl border border-border">
            {records.map((r) => (
              <button
                key={r.id}
                onClick={() => open({ kind: "record", id: r.id })}
                className="flex w-full flex-wrap items-center gap-4 px-5 py-4 text-left hover:bg-surface"
              >
                <span className="text-sm font-medium">
                  {r.participantId} · {r.name}
                </span>
                <Badge className="bg-indigo-50 text-primary">
                  {t("order", { n: r.order })}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {r.tags.join(" / ")}
                </span>
                <span className="ml-auto text-xs text-placeholder">
                  {r.startedAt}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <section className="mx-auto flex min-h-0 w-full max-w-[1120px] flex-1 flex-col px-4 pt-6 pb-4 md:px-6">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {t("currentStudy", { n: records.length })}
            </span>
            <Button
              size="sm"
              variant="ghost"
              disabled={!messages.length}
              onClick={clear}
            >
              {t("newChat")}
            </Button>
          </div>
          <div className="flex min-h-0 flex-1 flex-col rounded-2xl border border-border bg-card p-5 md:p-6">
            <div
              ref={chatRef}
              className="min-h-0 flex-1 space-y-6 overflow-y-auto thin-scroll"
              data-testid="chat-history"
            >
              {messages.length ? (
                messages.map((m) => (
                  <div key={m.id}>
                    <div className="mb-5 ml-auto w-fit max-w-[85%] rounded-2xl bg-surface px-4 py-3">
                      {m.question}
                    </div>
                    <div className="mb-3 flex items-center gap-2">
                      <Sparkles className="size-4 text-primary" />
                      <strong className="text-sm">Mizzen</strong>
                      <Badge>{t("exampleAnalysis")}</Badge>
                    </div>
                    <div
                      className="mb-6 max-w-[85ch] text-sm leading-7"
                      data-testid="analysis-answer"
                    >
                      <AnalysisAnswer skill={m.skill} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex h-full min-h-44 flex-col items-center justify-center py-10 text-center">
                  <Sparkles className="mb-4 size-6 text-gray-400" />
                  <h2 className="text-xl font-semibold">{t("chatTitle")}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t("chatHint")}
                  </p>
                </div>
              )}
            </div>
            <div className="mt-4 shrink-0">
              <div className="mb-3 flex flex-wrap gap-2">
                {[0, 1, 2, 3].map((i) => (
                  <button
                    key={i}
                    data-testid={`skill-${i}`}
                    onClick={() => ask(t(`skill${i}` as Key), i)}
                    className="rounded-full border border-indigo-200 bg-indigo-50/40 dark:bg-indigo-950/30 px-3 py-2 text-xs text-primary hover:bg-indigo-50"
                  >
                    {t(`skill${i}` as Key)}
                  </button>
                ))}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submit();
                }}
                className="rounded-xl border border-border bg-card p-3"
              >
                <Textarea
                  rows={2}
                  className="resize-none border-0 p-0 focus:ring-0"
                  aria-label={t("chatPlaceholder")}
                  placeholder={t("chatPlaceholder")}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" &&
                      !e.shiftKey &&
                      !e.nativeEvent.isComposing
                    ) {
                      e.preventDefault();
                      submit();
                    }
                  }}
                />
                <div className="mt-2 flex justify-end">
                  <Button
                    aria-label={t("send")}
                    size="icon"
                    type="submit"
                    className="size-8 rounded-full bg-gray-900 text-white hover:bg-gray-700"
                    disabled={!input.trim()}
                  >
                    <ArrowUp />
                  </Button>
                </div>
              </form>
            </div>
          </div>
          <p className="mt-2 text-center text-[11px] text-placeholder">
            {t("checkAI")}
          </p>
        </section>
      )}
    </div>
  );
}
