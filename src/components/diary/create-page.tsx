"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ArrowUp,
  ChevronDown,
  Check,
  BookOpen,
  ChartNoAxesCombined,
  FileText,
  Sparkles,
  Upload,
  Users,
  User,
  Bell,
  X,
  Database,
  Settings,
  PanelLeftClose,
  ChevronsUpDown,
  ExternalLink,
  FileChartColumn,
} from "lucide-react";
import { Input, Select, Textarea } from "@/components/ui/input";
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
  const [collapsed, setCollapsed] = useState(false);
  const fill =
    "inline-block h-8 rounded-none border-0 border-b border-indigo-200 bg-transparent px-1 text-[14px] text-primary focus:ring-0 focus:border-primary";
  return (
    <>
      <aside
        className={cn(
          "fixed top-0 bottom-7 left-0 hidden flex-col border-r border-border bg-card lg:flex",
          collapsed ? "w-16" : "w-64",
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border px-4">
          <div className="flex min-w-0 items-center gap-3">
            <Brand />
            {!collapsed && (
              <>
                <div className="min-w-0">
                  <strong className="text-sm font-semibold">
                    {t("workspace")}
                  </strong>
                  <p className="text-xs text-muted-foreground">{t("admin")}</p>
                </div>
                <ChevronsUpDown className="size-3 text-placeholder" />
              </>
            )}
          </div>
          <button
            aria-label={t("workspaceName")}
            className={cn(
              "text-muted-foreground",
              collapsed && "absolute top-20 left-6",
            )}
            onClick={() => setCollapsed(!collapsed)}
          >
            <PanelLeftClose className="size-4" />
          </button>
        </div>
        {!collapsed && (
          <p className="flex h-10 items-center border-b border-border px-4 text-[11px] font-semibold text-muted-foreground">
            MIZZEN DEMO
          </p>
        )}
        <nav className={cn("space-y-1 p-3", collapsed && "mt-12")}>
          {(
            [
              [FileText, "projects"],
              [Users, "persona"],
              [ChartNoAxesCombined, "insights"],
              [User, "account"],
              [BookOpen, "glossary"],
              [Database, "knowledge"],
              [Sparkles, "skills"],
              [Bell, "notifications"],
              [Settings, "workspaceSettings"],
              [FileChartColumn, "reports"],
            ] as const
          ).map(([Icon, key], i) => (
            <div
              key={key}
              title={t(key)}
              className={cn(
                "flex h-9 items-center gap-3 rounded-xl px-3 text-sm",
                i === 0
                  ? "bg-surface text-foreground font-medium"
                  : "text-gray-600 dark:text-gray-300",
                i === 9 && "mt-3 rounded-none border-t border-border pt-3",
              )}
            >
              <Icon className="size-[18px] shrink-0" />
              {!collapsed && (
                <>
                  <span>{t(key)}</span>
                  {i === 2 && (
                    <ExternalLink className="-ml-2 size-3 text-placeholder" />
                  )}
                  {(i === 1 || i === 2) && (
                    <span className="ml-auto rounded-full bg-sky-100 px-1.5 text-[10px] font-medium text-sky-600">
                      {i === 1 ? "Demo" : "Beta"}
                    </span>
                  )}
                </>
              )}
            </div>
          ))}
        </nav>
        <div className="mt-auto flex h-20 shrink-0 items-center gap-3 border-t border-border px-5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-500">
            <User className="size-4" />
          </span>
          {!collapsed && (
            <div>
              <p className="text-xs font-medium">
                {t("researcher")} · {t("admin")}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("workspaceName")}
              </p>
            </div>
          )}
        </div>
      </aside>
      <main
        className={cn(
          "mb-7 min-h-[calc(100dvh-28px)] bg-card",
          collapsed ? "lg:ml-16" : "lg:ml-64",
        )}
      >
        <div className="flex h-16 items-center px-8">
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <ChevronLeft className="size-4" />
            {t("returnLabel")}
          </span>
        </div>
        <div className="mx-auto w-full max-w-4xl px-4 pt-8 pb-12 lg:px-0 lg:pt-12">
          <h1 className="mb-8 text-center text-2xl font-semibold leading-8">
            {t("homeTitle")}
          </h1>
          <section className="rounded-[20px] border border-border bg-card px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-primary/10">
            <div
              className={cn(
                "px-1 pt-1",
                diary ? "min-h-[148px]" : "min-h-[56px]",
              )}
            >
              {diary ? (
                <>
                  <button
                    className="mb-2 inline-flex items-center gap-2 rounded-md bg-indigo-50 px-2 py-1 text-xs text-indigo-600"
                    onClick={() => setDiary(false)}
                  >
                    {t("diaryStudy")}
                    <X className="size-3" />
                  </button>
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm leading-9">
                    <span>{t("invite")}</span>
                    <Input
                      className={cn(fill, "w-40")}
                      aria-label={t("audience")}
                      value={brief.audience}
                      onChange={(e) => update({ audience: e.target.value })}
                    />
                    <span>，{t("within")}</span>
                    <Input
                      className={cn(fill, "w-12")}
                      type="number"
                      min={1}
                      max={365}
                      aria-label={t("studyDays")}
                      value={brief.days}
                      onChange={(e) => update({ days: Number(e.target.value) })}
                    />
                    <span>{t("days")}</span>
                    <Select
                      className={cn(fill, "w-28")}
                      aria-label={t("frequency")}
                      value={brief.frequency}
                      onChange={(e) =>
                        update({
                          frequency: e.target.value as "daily" | "unlimited",
                        })
                      }
                    >
                      <option value="daily">{t("daily")}</option>
                      <option value="unlimited">{t("asNeeded")}</option>
                    </Select>
                    <span>{t("recordExperience")}</span>
                    <span className="inline-flex max-w-full items-baseline gap-1">
                      <Input
                        className={cn(fill, "w-56 max-w-full")}
                        aria-label={t("goal")}
                        value={brief.goal}
                        onChange={(e) => update({ goal: e.target.value })}
                      />
                      <span>。</span>
                    </span>
                  </div>
                </>
              ) : (
                <Textarea
                  aria-label={t("goal")}
                  rows={2}
                  className="min-h-[80px] resize-none border-0 p-0 focus:ring-0"
                  placeholder={t("regularPlaceholder")}
                  value={regular}
                  onChange={(e) => setRegular(e.target.value)}
                />
              )}
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
              <div
                className="flex flex-wrap items-center gap-2"
                data-testid="study-type-actions"
              >
                {(
                  [
                    ["regular", false],
                    ["diary", true],
                  ] as const
                ).map(([key, value]) => (
                  <button
                    key={key}
                    aria-pressed={diary === value}
                    className={cn(
                      "inline-flex h-8 items-center justify-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-colors",
                      diary === value
                        ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                        : "border-border bg-card text-gray-600 hover:bg-surface",
                    )}
                    onClick={() => setDiary(value)}
                  >
                    {t(key)}
                  </button>
                ))}
                <button
                  className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full border border-border bg-card px-3 text-xs font-medium text-gray-600 hover:bg-surface"
                  onClick={() => open({ kind: "import" })}
                >
                  <Upload className="size-3.5" />
                  {t("importOutline")}
                </button>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <details className="group relative" data-testid="mode-picker">
                  <summary
                    aria-label={t("mode")}
                    className="flex h-8 cursor-pointer list-none items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-gray-600 transition-colors hover:bg-surface [&::-webkit-details-marker]:hidden"
                  >
                    {t(brief.mode === "standard" ? "standard" : "explore")}
                    <ChevronDown className="size-3.5 text-gray-400 transition-transform group-open:rotate-180" />
                  </summary>
                  <div
                    className="absolute right-0 bottom-full z-30 mb-2 w-64 rounded-xl border border-border bg-card p-1.5 shadow-lg"
                    role="menu"
                    aria-label={t("mode")}
                  >
                    {(["standard", "explore"] as const).map((mode) => (
                      <button
                        key={mode}
                        role="menuitemradio"
                        aria-checked={brief.mode === mode}
                        className="flex w-full items-start gap-3 rounded-lg p-3 text-left hover:bg-surface"
                        onClick={(e) => {
                          update({ mode });
                          e.currentTarget
                            .closest("details")
                            ?.removeAttribute("open");
                        }}
                      >
                        <span className="mt-0.5 w-4 shrink-0 text-primary">
                          {brief.mode === mode && <Check className="size-4" />}
                        </span>
                        <span>
                          <span className="block text-sm font-medium text-foreground">
                            {t(mode)}
                          </span>
                          <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
                            {t(
                              mode === "standard"
                                ? "standardHint"
                                : "exploreHint",
                            )}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                </details>

                <button
                  aria-label={t("generate")}
                  className="flex size-9 items-center justify-center rounded-full bg-gray-900 text-white hover:bg-gray-800"
                  onClick={() => {
                    if (!diary) {
                      notify("regularNotice");
                      return;
                    }
                    if (create()) router.push("/study/outline");
                  }}
                >
                  <ArrowUp className="size-5" />
                </button>
              </div>
            </div>
          </section>
          <p className="mt-2 text-center text-xs text-placeholder">
            {t("aiCaution")}
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
