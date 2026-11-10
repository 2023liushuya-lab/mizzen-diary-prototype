"use client";
import { useState } from "react";
import { NativeOutline } from "./native-outline";
import { Check, MessageSquare, PenTool, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { useTranslation } from "@/hooks/use-translation";
import { useDiaryStore } from "@/stores/diary-store";
import { cn } from "@/lib/utils";
import { DiaryConfigPanel } from "./diary-config";
export function OutlinePage() {
  const t = useTranslation();
  const study = useDiaryStore((s) => s.study);
  const save = useDiaryStore((s) => s.save);
  const updateParticipantDescription = useDiaryStore(
    (s) => s.updateParticipantDescription,
  );
  const [panel, setPanel] = useState<"chat" | "settings" | "outline">(
    "settings",
  );
  const [chatDraft, setChatDraft] = useState("");
  return (
    <div className="flex min-h-[calc(100dvh-76px)]">
      <nav className="hidden w-14 shrink-0 flex-col items-center gap-3 border-r border-border bg-gray-50 pt-3 lg:flex">
        <Button
          variant="ghost"
          size="icon"
          className={panel === "chat" ? "bg-indigo-100 text-primary" : ""}
          title={t("chat")}
          onClick={() => setPanel("chat")}
        >
          <MessageSquare />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={panel === "outline" ? "bg-indigo-100 text-primary" : ""}
          title={t("outline")}
          onClick={() => setPanel("outline")}
        >
          <PenTool />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={panel === "settings" ? "bg-indigo-100 text-primary" : ""}
          title={t("settings")}
          onClick={() => setPanel("settings")}
        >
          <Settings />
        </Button>
      </nav>
      <div
        className={cn(
          "grid min-w-0 flex-1",
          panel !== "settings" &&
            "lg:grid-cols-[minmax(380px,34%)_minmax(0,1fr)]",
        )}
      >
        <aside
          className={cn(
            "bg-card p-5 xl:p-6",
            panel === "settings"
              ? "mx-auto w-full max-w-2xl sm:py-10"
              : "border-r border-border",
          )}
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {t(
                panel === "settings"
                  ? "settings"
                  : panel === "outline"
                    ? "outline"
                    : "chat",
              )}
            </h2>
            <div className="flex lg:hidden">
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  setPanel(panel === "settings" ? "outline" : "settings")
                }
              >
                {t(panel === "settings" ? "outline" : "settings")}
              </Button>
            </div>
          </div>
          {panel === "chat" ? (
            <div className="flex h-[calc(100%-3.5rem)] flex-col justify-between gap-4">
              <div className="rounded-xl border border-border bg-surface p-4 text-sm leading-6 text-muted-foreground">
                {t("aiChatGuideHint")}
              </div>
              <form
                className="space-y-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!chatDraft.trim()) return;
                  setChatDraft("");
                  save();
                }}
              >
                <Input
                  value={chatDraft}
                  onChange={(e) => setChatDraft(e.target.value)}
                  placeholder={t("aiChatInputPlaceholder")}
                  aria-label={t("chat")}
                />
                <p className="text-xs text-placeholder">{t("aiCaution")}</p>
              </form>
            </div>
          ) : panel === "outline" ? (
            <div className="space-y-2">
              {study.questions.map((q) => (
                <button
                  key={q.id}
                  className="flex w-full items-start gap-3 rounded-lg border border-transparent px-3 py-3 text-left transition-colors hover:border-border hover:bg-surface"
                  onClick={() => document.getElementById(q.id)?.focus()}
                >
                  <span className="mt-0.5 rounded bg-indigo-50 px-1.5 py-0.5 text-xs font-medium text-primary">
                    {q.id}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-foreground">
                      {q.title}
                    </span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {q.rule.kind === "always"
                        ? t("everyTime")
                        : `${t(q.rule.kind)} ${q.rule.count}`}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-5">
              <section
                className="space-y-3"
                aria-label={t("participantDescription")}
              >
                <h3 className="text-base font-medium">{study.title}</h3>
                <div>
                  <label
                    htmlFor="participant-description"
                    className="text-sm font-medium"
                  >
                    {t("participantDescription")}
                    <span className="ml-2 text-xs font-normal text-placeholder">
                      {t("optionalField")}
                    </span>
                  </label>
                  <Textarea
                    id="participant-description"
                    aria-label={t("participantDescription")}
                    className="mt-2 resize-y"
                    rows={3}
                    placeholder={t("participantDescriptionPlaceholder")}
                    value={study.participantDescription ?? ""}
                    onChange={(e) =>
                      updateParticipantDescription(e.target.value)
                    }
                  />
                  <p className="mt-1.5 text-xs leading-5 text-muted-foreground">
                    {t("participantDescriptionHint")}
                  </p>
                </div>
              </section>
              <DiaryConfigPanel />
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => save()}>
                  <Check />
                  {t("save")}
                </Button>
              </div>
            </div>
          )}
        </aside>
        {panel !== "settings" && <NativeOutline />}
      </div>
    </div>
  );
}
