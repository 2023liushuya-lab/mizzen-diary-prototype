"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUp, ChevronDown, Check, Upload } from "lucide-react";
import { Textarea } from "@/components/ui/input";
import { useTranslation } from "@/hooks/use-translation";
import { useDiaryStore } from "@/stores/diary-store";
import { Brand, Footer } from "./shell";
import { cn } from "@/lib/utils";

export function CreatePage() {
  const t = useTranslation();
  const router = useRouter();
  const brief = useDiaryStore((s) => s.study.brief);
  const update = useDiaryStore((s) => s.updateBrief);
  const create = useDiaryStore((s) => s.createStudy);
  const open = useDiaryStore((s) => s.open);
  const notify = useDiaryStore((s) => s.notify);
  const [diary, setDiary] = useState(true);
  const [regular, setRegular] = useState("");
  const [diaryPrompt, setDiaryPrompt] = useState("");
  const modePickerRef = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const closeOutside = (event: MouseEvent) => {
      if (
        modePickerRef.current?.open &&
        !modePickerRef.current.contains(event.target as Node)
      )
        modePickerRef.current.removeAttribute("open");
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape")
        modePickerRef.current?.removeAttribute("open");
    };
    document.addEventListener("mousedown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);
  return (
    <>
      <header className="flex h-[52px] items-center justify-between border-b border-border bg-card px-6">
        <div className="flex items-center gap-3">
          <Brand />
          <span className="text-sm font-medium">Mizzen Insight</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {t("newResearchProject")}
        </span>
      </header>
      <main className="create-canvas mb-7 min-h-[calc(100dvh-80px)] px-4 pt-12 pb-32 sm:pt-16">
        <div className="mx-auto w-full max-w-[720px]">
          <h1 className="mb-8 text-center text-[28px] leading-10 font-semibold tracking-tight">
            {t("launchPrefix")}
            <span className="text-primary">{t("depthInterview")}</span>
            {t("launchSuffix")}
          </h1>
          <section
            className="rounded-[20px] border border-border bg-card shadow-[0_8px_28px_rgba(17,24,39,0.04)]"
            aria-label={t("createBrief")}
          >
            <div className="flex min-h-14 flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3">
              <div
                className="inline-flex items-center gap-1 rounded-lg bg-surface p-1"
                data-testid="study-type-actions"
                aria-label={t("researchType")}
              >
                {(
                  [
                    ["regular", false],
                    ["diary", true],
                  ] as const
                ).map(([key, value]) => (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={diary === value}
                    data-testid={
                      diary && value ? "diary-type-label" : undefined
                    }
                    className={cn(
                      "inline-flex h-7 items-center justify-center gap-1.5 rounded-md px-3 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                      diary === value
                        ? "bg-card text-primary shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                    onClick={() => setDiary(value)}
                  >
                    {t(key)}
                  </button>
                ))}
              </div>
              <span
                className="text-[11px] text-muted-foreground"
                data-testid="study-type-hint"
              >
                {t(diary ? "repeatLinkHint" : "singleInterviewHint")}
              </span>
            </div>
            <div className="px-5 pt-4 pb-3">
              <Textarea
                aria-label={t("goal")}
                rows={3}
                className="min-h-[112px] resize-none border-0 bg-transparent p-0 text-[15px] leading-8 shadow-none focus:ring-0"
                placeholder={t(
                  diary ? "optionalDiaryPrompt" : "regularPlaceholder",
                )}
                value={diary ? diaryPrompt : regular}
                onChange={(e) =>
                  diary
                    ? setDiaryPrompt(e.target.value)
                    : setRegular(e.target.value)
                }
              />
              <div className="mt-5 flex items-center justify-between gap-3 pb-1">
                <button
                  className="flex h-8 items-center justify-center gap-1.5 rounded-md px-1 text-xs text-muted-foreground hover:bg-surface hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={t("importOutline")}
                  onClick={() => open({ kind: "import" })}
                >
                  <Upload className="size-3.5" />
                  {t("importOutline")}
                </button>
                <div className="flex items-center gap-2.5">
                  <details
                    ref={modePickerRef}
                    className="group relative"
                    data-testid="mode-picker"
                  >
                    <summary
                      aria-label={t("mode")}
                      className="flex min-h-8 cursor-pointer list-none items-center gap-1 rounded-full border border-border bg-gray-50 px-3.5 text-xs dark:bg-gray-800 [&::-webkit-details-marker]:hidden"
                    >
                      <strong className="font-semibold">
                        {t(brief.mode === "standard" ? "standard" : "explore")}
                      </strong>
                      <ChevronDown className="size-3 text-placeholder transition-transform group-open:rotate-180" />
                    </summary>
                    <div
                      className="absolute top-full right-0 z-30 mt-2 w-[250px] rounded-xl border border-border bg-card p-2 shadow-[0_8px_24px_rgba(17,24,39,0.06)]"
                      role="menu"
                      aria-label={t("mode")}
                    >
                      {(["standard", "explore"] as const).map((mode) => (
                        <button
                          key={mode}
                          role="menuitemradio"
                          aria-checked={brief.mode === mode}
                          className={cn(
                            "flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left hover:bg-surface",
                            brief.mode === mode &&
                              "bg-indigo-50 dark:bg-indigo-950",
                          )}
                          onClick={(e) => {
                            update({ mode });
                            e.currentTarget
                              .closest("details")
                              ?.removeAttribute("open");
                          }}
                        >
                          <span>
                            <span
                              className={cn(
                                "flex items-center gap-1 text-xs",
                                brief.mode === mode && "text-primary",
                              )}
                            >
                              {t(mode)}
                            </span>
                            <span className="mt-0.5 block text-[11px] leading-4 text-muted-foreground">
                              {t(
                                mode === "standard"
                                  ? "standardHint"
                                  : "exploreHint",
                              )}
                            </span>
                          </span>
                          {brief.mode === mode && (
                            <Check className="size-4 shrink-0 text-primary" />
                          )}
                        </button>
                      ))}
                    </div>
                  </details>
                  <button
                    aria-label={t("generate")}
                    className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-white hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    onClick={() => {
                      if (!diary) {
                        notify("regularNotice");
                        return;
                      }
                      if (diaryPrompt.trim())
                        update({ goal: diaryPrompt.trim() });
                      if (create()) router.push("/study/outline");
                    }}
                  >
                    <ArrowUp className="size-5" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
