"use client";
import { useState } from "react";
import { NativeOutline } from "./native-outline";
import { Check, MessageSquare, PenTool, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { useTranslation } from "@/hooks/use-translation";
import { useDiaryStore } from "@/stores/diary-store";
import type { Limit } from "@/types/diary";
import { cn } from "@/lib/utils";
function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      role="switch"
      aria-label={label}
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-5 w-9 shrink-0 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring",
        checked ? "bg-primary" : "bg-gray-300",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 size-4 rounded-full bg-white transition-transform",
          checked && "translate-x-4",
        )}
      />
    </button>
  );
}
function LimitRow({
  label,
  value,
  daily,
  onChange,
}: {
  label: string;
  value: Limit;
  daily?: boolean;
  onChange: (v: Limit) => void;
}) {
  const t = useTranslation();
  const selection =
    value.kind === "unlimited"
      ? "unlimited"
      : daily && value.count === 1
        ? "one"
        : "custom";
  return (
    <div className="grid grid-cols-[1fr_minmax(0,180px)] items-start gap-3 border-t border-dashed border-indigo-200/70 py-3">
      <label className="pt-1.5 text-gray-600 dark:text-gray-300">{label}</label>
      <div className="space-y-2">
        <Select
          className="h-8 w-full px-2 text-xs"
          aria-label={label}
          value={selection}
          onChange={(e) =>
            onChange(
              e.target.value === "unlimited"
                ? { kind: "unlimited" }
                : {
                    kind: "limited",
                    count: e.target.value === "one" ? 1 : daily ? 2 : 14,
                  },
            )
          }
        >
          <option value="unlimited">
            {t(daily ? "unlimitedDaily" : "unlimited")}
          </option>
          {daily && <option value="one">{t("onceDaily")}</option>}
          <option value="custom">
            {t(daily ? "customDaily" : "customTotal")}
          </option>
        </Select>
        {selection === "custom" && value.kind === "limited" && (
          <Input
            className="h-8 text-xs"
            aria-label={label + " " + t("times")}
            type="number"
            min={daily ? 2 : 1}
            value={value.count}
            onChange={(e) =>
              onChange({ kind: "limited", count: Number(e.target.value) })
            }
          />
        )}
      </div>
    </div>
  );
}
export function OutlinePage() {
  const t = useTranslation();
  const study = useDiaryStore((s) => s.study);
  const update = useDiaryStore((s) => s.updateConfig);
  const updateBrief = useDiaryStore((s) => s.updateBrief);
  const save = useDiaryStore((s) => s.save);
  const [panel, setPanel] = useState<"settings" | "outline">("settings");
  const c = study.config;
  return (
    <div className="flex min-h-[calc(100dvh-76px)]">
      <nav className="hidden w-14 shrink-0 flex-col items-center gap-3 border-r border-border bg-gray-50 pt-3 lg:flex">
        <Button
          variant="ghost"
          size="icon"
          title={t("chat")}
          onClick={() => setPanel("outline")}
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
      <div className="grid min-w-0 flex-1 lg:grid-cols-[minmax(400px,36%)_minmax(0,1fr)]">
        <aside className="border-r border-border bg-card p-6 xl:p-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {t(panel === "settings" ? "settings" : "outline")}
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
          {panel === "outline" ? (
            <div className="space-y-3">
              {study.questions.map((q) => (
                <button
                  key={q.id}
                  className="flex w-full gap-3 rounded-md px-3 py-3 text-left hover:bg-surface"
                  onClick={() => document.getElementById(q.id)?.focus()}
                >
                  <span className="text-primary">{q.id}</span>
                  {q.title}
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">
                  {t("externalTitle")}
                </label>
                <Input
                  value={t("externalName")}
                  readOnly
                  aria-label={t("externalTitle")}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">
                    {t("mode")}
                  </label>
                  <Select
                    className="h-9 w-full text-xs"
                    aria-label={t("mode")}
                    value={study.brief.mode}
                    onChange={(e) =>
                      updateBrief({
                        mode: e.target.value as "standard" | "explore",
                      })
                    }
                  >
                    <option value="standard">{t("standard")}</option>
                    <option value="explore">{t("explore")}</option>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">
                    {t("language")}
                  </label>
                  <Input
                    className="h-9"
                    value={t("chinese")}
                    readOnly
                    aria-label={t("language")}
                  />
                </div>
              </div>
              <section className="rounded-xl border border-indigo-200 bg-indigo-50/25 dark:bg-indigo-950/20 px-5 py-4">
                <h3 className="mb-3 text-sm font-medium text-primary">
                  {t("diaryConfig")}
                </h3>
                <div className="border-t border-dashed border-indigo-200/70 py-3">
                  <label className="text-gray-600 dark:text-gray-300">
                    {t("dates")}
                  </label>
                  <div className="mt-2 flex gap-2">
                    <Input
                      className="h-8 text-xs"
                      type="date"
                      aria-label={t("start")}
                      value={c.start}
                      onChange={(e) => update({ start: e.target.value })}
                    />
                    <Input
                      className="h-8 text-xs"
                      type="date"
                      aria-label={t("end")}
                      value={c.end}
                      onChange={(e) => update({ end: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-dashed border-indigo-200/70 py-3">
                  <label className="text-gray-600 dark:text-gray-300">
                    {t("allowLate")}
                  </label>
                  <Toggle
                    label={t("allowLate")}
                    checked={c.allowLate}
                    onChange={(allowLate) => update({ allowLate })}
                  />
                </div>
                <LimitRow
                  label={t("dailyLimit")}
                  value={c.daily}
                  daily
                  onChange={(daily) => update({ daily })}
                />
                <LimitRow
                  label={t("totalLimit")}
                  value={c.total}
                  onChange={(total) => update({ total })}
                />
                <div className="grid grid-cols-[1fr_minmax(0,180px)] items-start gap-3 border-t border-dashed border-indigo-200/70 py-3">
                  <label className="pt-1.5 text-gray-600 dark:text-gray-300">
                    {t("minGap")}
                  </label>
                  <div>
                    <Select
                      className="h-8 w-full px-2 text-xs"
                      aria-label={t("minGap")}
                      value={c.minInterval === 0 ? "none" : "custom"}
                      onChange={(e) =>
                        update({
                          minInterval: e.target.value === "none" ? 0 : 4,
                        })
                      }
                    >
                      <option value="none">{t("noGap")}</option>
                      <option value="custom">{t("customGap")}</option>
                    </Select>
                    {c.minInterval !== 0 && (
                      <Input
                        className="mt-2 h-8 text-xs"
                        type="number"
                        min={1}
                        aria-label={t("minGap") + " " + t("hours")}
                        value={c.minInterval}
                        onChange={(e) =>
                          update({ minInterval: Number(e.target.value) })
                        }
                      />
                    )}
                  </div>
                </div>
                <div className="border-t border-dashed border-indigo-200/70 pt-3">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <label className="text-gray-600 dark:text-gray-300">
                      {t("appPush")}
                    </label>
                    <Toggle
                      label={t("appPush")}
                      checked={c.push}
                      onChange={(push) => update({ push })}
                    />
                  </div>
                  <Select
                    className="h-8 w-full text-xs"
                    aria-label={t("trigger")}
                    disabled={!c.push}
                    value={c.reminderHours}
                    onChange={(e) =>
                      update({ reminderHours: Number(e.target.value) })
                    }
                  >
                    {[24, 48, 72].map((n) => (
                      <option value={n} key={n}>
                        {t("afterHours", { n })}
                      </option>
                    ))}
                  </Select>
                </div>
              </section>
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => save()}>
                  <Check />
                  {t("save")}
                </Button>
              </div>
            </div>
          )}
        </aside>
        <NativeOutline />
      </div>
    </div>
  );
}
