"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Input, Select } from "@/components/ui/input";
import { useDiaryStore } from "@/stores/diary-store";
import { useTranslation } from "@/hooks/use-translation";
import { cn } from "@/lib/utils";
import type { Limit } from "@/types/diary";
const control = "h-7 w-auto max-w-full rounded-md px-2 text-xs";
const row =
  "flex min-h-11 flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-dashed border-indigo-200/70 py-2.5";
function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      role="switch"
      aria-label={label}
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-[18px] w-8 shrink-0 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        checked ? "bg-primary" : "bg-gray-300 dark:bg-gray-600",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 size-3.5 rounded-full bg-white transition-transform",
          checked && "translate-x-3.5",
        )}
      />
    </button>
  );
}
function LimitRow({
  label,
  value,
  daily = false,
  onChange,
}: {
  label: string;
  value: Limit;
  daily?: boolean;
  onChange: (value: Limit) => void;
}) {
  const t = useTranslation();
  const [custom, setCustom] = useState(false);
  const options = daily ? [1, 2, 3, 5] : [1, 3, 5, 10, 14, 30];
  const selected =
    value.kind === "unlimited"
      ? "unlimited"
      : custom || !options.includes(value.count)
        ? "custom"
        : String(value.count);
  return (
    <div className={row}>
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex max-w-full flex-wrap items-center justify-end gap-1.5">
        <Select
          className={control}
          aria-label={label}
          value={selected}
          onChange={(e) => {
            const v = e.target.value;
            setCustom(v === "custom");
            onChange(
              v === "unlimited"
                ? { kind: "unlimited" }
                : {
                    kind: "limited",
                    count:
                      v === "custom"
                        ? value.kind === "limited"
                          ? value.count
                          : daily
                            ? 2
                            : 14
                        : Number(v),
                  },
            );
          }}
        >
          <option value="unlimited">
            {t(daily ? "unlimitedDaily" : "unlimited")}
          </option>
          {options.map((n) => (
            <option value={n} key={n}>
              {t(daily ? "dailyTimesCompact" : "maxTimesCompact", { n })}
            </option>
          ))}
          <option value="custom">{t("customCountCompact")}</option>
        </Select>
        {selected === "custom" && value.kind === "limited" && (
          <>
            <Input
              type="number"
              min={1}
              className={cn(control, "w-14 tabular-nums")}
              aria-label={`${label} ${t("times")}`}
              value={value.count}
              onChange={(e) =>
                onChange({ kind: "limited", count: Number(e.target.value) })
              }
            />
            <span className="text-xs text-muted-foreground">{t("times")}</span>
          </>
        )}
      </div>
    </div>
  );
}
export function DiaryConfigPanel() {
  const t = useTranslation();
  const c = useDiaryStore((s) => s.study.config);
  const update = useDiaryStore((s) => s.updateConfig);
  const [customGap, setCustomGap] = useState(false);
  const gaps = [0, 1, 4, 12, 24, 48];
  return (
    <section
      className="rounded-xl border border-indigo-200 bg-indigo-50/20 px-4 pt-3 pb-1 dark:border-indigo-900 dark:bg-indigo-950/20"
      aria-label={t("diaryConfig")}
    >
      <div className="pb-3">
        <h3 className="text-sm font-medium text-primary">{t("diaryConfig")}</h3>
        <p className="mt-1 text-[11px] text-muted-foreground">
          {t("repeatLinkHint")}
        </p>
      </div>
      <div className={row}>
        <span className="text-xs text-muted-foreground">{t("dates")}</span>
        <details className="group relative max-w-full">
          <summary
            aria-label={t("dates")}
            className="flex h-7 cursor-pointer list-none items-center gap-1 rounded-md border border-border bg-card px-2 text-[11px] tabular-nums [&::-webkit-details-marker]:hidden"
          >
            {c.start}
            <span className="text-placeholder">{t("rangeTo")}</span>
            {c.end}
            <ChevronDown className="size-3 text-placeholder" />
          </summary>
          <div className="absolute top-full right-0 z-30 mt-2 w-[264px] max-w-[calc(100vw-72px)] rounded-lg border border-border bg-card p-3 shadow-md">
            <label
              className="mb-1 block text-xs text-muted-foreground"
              htmlFor="diary-start"
            >
              {t("start")}
            </label>
            <Input
              id="diary-start"
              type="date"
              className="h-8 text-xs"
              aria-label={t("start")}
              value={c.start}
              onChange={(e) => update({ start: e.target.value })}
            />
            <label
              className="mt-3 mb-1 block text-xs text-muted-foreground"
              htmlFor="diary-end"
            >
              {t("end")}
            </label>
            <Input
              id="diary-end"
              type="date"
              min={c.start}
              className="h-8 text-xs"
              aria-label={t("end")}
              value={c.end}
              onChange={(e) => update({ end: e.target.value })}
            />
            <button
              type="button"
              className="mt-3 block w-full rounded-md bg-primary py-1.5 text-xs text-white focus-visible:ring-2 focus-visible:ring-ring"
              onClick={(e) =>
                e.currentTarget.closest("details")?.removeAttribute("open")
              }
            >
              {t("dateDone")}
            </button>
          </div>
        </details>
      </div>
      <LimitRow
        label={t("dailyLimit")}
        value={c.daily}
        daily
        onChange={(daily) => update({ daily })}
      />
      <div className={row} data-testid="makeup-rule">
        <div className="min-w-0 flex-1">
          <span className="text-xs text-muted-foreground">
            {t("allowLate")}
          </span>
          <p
            id="makeup-rule-description"
            className="mt-1 text-[11px] leading-5 text-placeholder"
          >
            {t("makeupHint")}
          </p>
        </div>
        <Toggle
          label={t("allowLate")}
          checked={c.allowLate}
          onChange={(allowLate) => update({ allowLate })}
        />
      </div>
      <LimitRow
        label={t("totalLimit")}
        value={c.total}
        onChange={(total) => update({ total })}
      />
      <div className={row}>
        <span className="text-xs text-muted-foreground">{t("minGap")}</span>
        <div className="flex max-w-full items-center gap-1.5">
          <Select
            className={control}
            aria-label={t("minGap")}
            value={
              customGap || !gaps.includes(c.minInterval)
                ? "custom"
                : String(c.minInterval)
            }
            onChange={(e) => {
              const v = e.target.value;
              setCustomGap(v === "custom");
              update({
                minInterval:
                  v === "custom" ? Math.max(1, c.minInterval) : Number(v),
              });
            }}
          >
            {gaps.map((n) => (
              <option value={n} key={n}>
                {n === 0 ? t("noGap") : t("hoursCompact", { n })}
              </option>
            ))}
            <option value="custom">{t("customGap")}</option>
          </Select>
          {(customGap || !gaps.includes(c.minInterval)) && (
            <>
              <Input
                type="number"
                min={1}
                className={cn(control, "w-14 tabular-nums")}
                aria-label={`${t("minGap")} ${t("hours")}`}
                value={c.minInterval}
                onChange={(e) =>
                  update({ minInterval: Number(e.target.value) })
                }
              />
              <span className="text-xs text-muted-foreground">
                {t("hours")}
              </span>
            </>
          )}
        </div>
      </div>
      <div className={row}>
        <span className="text-xs text-muted-foreground">
          {t("appPushCompact")}
        </span>
        <div className="flex max-w-full items-center gap-2">
          <Select
            className={cn(control, "max-w-[144px]")}
            disabled={!c.push}
            aria-label={t("trigger")}
            value={c.reminderHours}
            onChange={(e) => update({ reminderHours: Number(e.target.value) })}
          >
            {[24, 48, 72].map((n) => (
              <option key={n} value={n}>
                {t("reminderCompact", { n })}
              </option>
            ))}
          </Select>
          <Toggle
            label={t("appPush")}
            checked={c.push}
            onChange={(push) => update({ push })}
          />
        </div>
      </div>
    </section>
  );
}
