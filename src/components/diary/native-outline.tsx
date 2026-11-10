"use client";
import {
  Clock,
  Globe,
  Play,
  Target,
  Mic,
  GripVertical,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { useDiaryStore } from "@/stores/diary-store";
import { useTranslation } from "@/hooks/use-translation";
export function NativeOutline() {
  const t = useTranslation();
  const study = useDiaryStore((s) => s.study);
  const updateTitle = useDiaryStore((s) => s.updateTitle);
  const updateQuestion = useDiaryStore((s) => s.updateQuestion);
  const open = useDiaryStore((s) => s.open);
  return (
    <div className="min-w-0 bg-card">
      <div className="flex h-11 items-center justify-between border-b border-border px-8">
        <span className="text-xs text-placeholder">1 / 1</span>
        <Button
          variant="outline"
          size="sm"
          aria-label={t("preview")}
          onClick={() => open({ kind: "preview" })}
        >
          <Play />
          {t("preview")}
        </Button>
      </div>
      <div className="space-y-6 px-6 py-6 xl:px-8">
        <div className="space-y-3">
          <Input
            className="h-auto border-0 bg-transparent p-0 text-[22px] font-semibold leading-8 focus:ring-0"
            aria-label={t("researchName")}
            value={study.title}
            onChange={(e) => updateTitle(e.target.value)}
          />
          {study.participantDescription?.trim() && (
            <p className="whitespace-pre-wrap break-words text-sm leading-7 text-muted-foreground">
              {study.participantDescription}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
              <Clock className="size-3" />
              {t("duration")}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
              <Globe className="size-3" />
              {t("chinese")}
            </span>
            <span className="rounded-md border border-indigo-200 bg-indigo-100 px-2.5 py-1 text-xs text-indigo-700">
              {t(study.brief.mode === "standard" ? "standard" : "explore")}
            </span>
            <span className="rounded-md border border-indigo-200 bg-indigo-100 px-2.5 py-1 text-xs text-indigo-700">
              {t("questionCount", { n: study.questions.length })}
            </span>
          </div>
        </div>
        <div className="space-y-4 border-l-2 border-indigo-300 pl-4">
          <div className="space-y-2">
            <h3 className="flex items-center gap-2 text-sm font-medium text-indigo-700">
              <Target className="size-4" />
              {t("researchBackground")}
            </h3>
            <p className="text-sm leading-6 text-gray-700 dark:text-gray-300">
              {t("backgroundText", {
                audience: study.brief.audience,
                goal: study.brief.goal,
              })}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="flex items-center gap-2 text-sm font-medium text-indigo-700">
              <Target className="size-4" />
              {t("researchGoal")}
            </h3>
            <p className="text-sm leading-6 text-gray-700 dark:text-gray-300">
              {t("goalText")}
            </p>
          </div>
        </div>
        <hr className="border-border" />
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 text-sm font-medium text-indigo-700">
            <Mic className="size-4" />
            {t("flow")}
          </h3>
          <div className="space-y-6 rounded-lg bg-indigo-50/30 p-4 dark:bg-indigo-950/20">
            <h3 className="flex items-center gap-2 text-sm font-medium text-indigo-800">
              <span className="flex size-6 items-center justify-center rounded-full bg-indigo-100 text-xs">
                1
              </span>
              {t("welcomeStep")}
            </h3>
            <p className="pl-10 text-sm leading-6">{t("welcome")}</p>
            <h3 className="flex items-center gap-2 text-sm font-medium text-indigo-800">
              <span className="flex size-6 items-center justify-center rounded-full bg-indigo-100 text-xs">
                2
              </span>
              {t("guideStep")}
            </h3>
            <div className="pl-4 sm:pl-8">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                <ChevronDown className="size-4 text-placeholder" />
                {t("experience")}
              </div>
              <p className="mb-5 pl-6 text-xs italic text-muted-foreground">
                {t("sectionGuide")}：{t("experienceHint")}
              </p>
              {study.questions.map((q, i) => (
                <div
                  key={q.id}
                  id={q.id}
                  tabIndex={-1}
                  className="mb-6 rounded-md outline-none focus:ring-2 focus:ring-ring"
                >
                  <div className="flex items-start gap-2">
                    <GripVertical className="mt-2 size-3.5 shrink-0 text-placeholder" />
                    <span className="pt-1.5 text-sm text-muted-foreground">
                      {i + 1}.
                    </span>
                    <Input
                      className="h-auto border-0 bg-transparent py-1 pl-1 font-medium focus:ring-0"
                      aria-label={q.id + " " + t("outline")}
                      value={q.title}
                      onChange={(e) =>
                        updateQuestion(q.id, { title: e.target.value })
                      }
                    />
                  </div>
                  <div className="mt-2 pl-9">
                    <Input
                      className="h-auto border-0 bg-transparent px-0 py-1 text-sm leading-6 text-gray-700 focus:ring-0 dark:text-gray-200"
                      aria-label={q.id + " prompt"}
                      placeholder={t("questionPromptPlaceholder")}
                      value={q.prompt}
                      onChange={(e) =>
                        updateQuestion(q.id, { prompt: e.target.value })
                      }
                    />
                  </div>
                  <p className="mt-3 pl-9 text-sm leading-6 text-gray-600 dark:text-gray-300">
                    <strong>{t("followUp")}：</strong>
                    {t("nativeGuideHint")}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 pl-9">
                    <span className="text-xs text-muted-foreground">
                      {t("showIf")}
                    </span>
                    <Select
                      className="h-7 border-border bg-card text-xs"
                      aria-label={q.id + " " + t("showIf")}
                      value={q.rule.kind}
                      onChange={(e) =>
                        updateQuestion(q.id, {
                          rule:
                            e.target.value === "always"
                              ? { kind: "always" }
                              : {
                                  kind: e.target.value as "equals" | "atLeast",
                                  count:
                                    q.rule.kind === "always" ? 1 : q.rule.count,
                                },
                        })
                      }
                    >
                      <option value="always">{t("everyTime")}</option>
                      <option value="equals">{t("equals")}</option>
                      <option value="atLeast">{t("atLeast")}</option>
                    </Select>
                    {q.rule.kind !== "always" && (
                      <Input
                        className="h-7 w-14 text-xs"
                        type="number"
                        min={1}
                        aria-label={q.id + " " + t("orderCount")}
                        value={q.rule.count}
                        onChange={(e) => {
                          if (q.rule.kind !== "always")
                            updateQuestion(q.id, {
                              rule: {
                                ...q.rule,
                                count: Math.max(1, Number(e.target.value)),
                              },
                            });
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
            <h3 className="flex items-center gap-2 text-sm font-medium text-indigo-800">
              <span className="flex size-6 items-center justify-center rounded-full bg-indigo-100 text-xs">
                3
              </span>
              {t("closingStep")}
            </h3>
            <p className="pl-10 text-sm leading-6">{t("ending")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
