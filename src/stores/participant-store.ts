"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useDiaryStore } from "./diary-store";
import type { DiaryConfig } from "@/types/diary";
export type ParticipantScenario =
  | "first"
  | "configured"
  | "return"
  | "multiple"
  | "dailyLimit"
  | "interval"
  | "total"
  | "notstarted"
  | "ended"
  | "identity";
export type TaskAnswers = {
  used: string;
  product: string;
  context: string;
  experience: string;
  score: number;
  followup: string;
};
export type ParticipantTask = {
  day: number;
  status: "inprogress" | "submitted";
  step: number;
  answers: TaskAnswers;
  draft: string;
  useHistory?: boolean;
  startedAt: number;
  submittedAt?: number;
};
const HOUR = 3600000;
export const emptyAnswers = (): TaskAnswers => ({
  used: "",
  product: "产品 A",
  context: "",
  experience: "",
  score: 0,
  followup: "",
});
export function dayKey(time: number) {
  return new Date(time + 8 * HOUR).toISOString().slice(0, 10);
}
export function displayTime(time: number) {
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(time);
}
export type EntryDecision = {
  reason:
    | "allowed"
    | "resume"
    | "notstarted"
    | "ended"
    | "total"
    | "daily"
    | "interval"
    | "invalid";
  allowed: boolean;
  nextAt?: number;
  today: number;
  completed: number;
};
export function entryDecision(
  config: DiaryConfig,
  sessions: ParticipantTask[],
  now: number,
): EntryDecision {
  const completed = sessions.filter((t) => t.status === "submitted");
  const today = completed.filter(
    (t) => dayKey(t.submittedAt ?? t.startedAt) === dayKey(now),
  ).length;
  const result = { today, completed: completed.length };
  const start = Date.parse(`${config.start}T00:00:00+08:00`),
    end = Date.parse(`${config.end}T23:59:59.999+08:00`);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start)
    return { ...result, reason: "invalid", allowed: false };
  if (now < start)
    return { ...result, reason: "notstarted", allowed: false, nextAt: start };
  if (now > end) return { ...result, reason: "ended", allowed: false };
  if (sessions.some((t) => t.status === "inprogress"))
    return { ...result, reason: "resume", allowed: true };
  if (config.total.kind === "limited" && completed.length >= config.total.count)
    return { ...result, reason: "total", allowed: false };
  const lastStart = completed.reduce((v, t) => Math.max(v, t.startedAt), 0);
  const intervalAt = lastStart ? lastStart + config.minInterval * HOUR : 0;
  if (config.daily.kind === "limited" && today >= config.daily.count) {
    const tomorrow = Date.parse(`${dayKey(now)}T00:00:00+08:00`) + 24 * HOUR;
    const next = Math.max(tomorrow, intervalAt);
    return {
      ...result,
      reason: "daily",
      allowed: false,
      ...(next <= end ? { nextAt: next } : {}),
    };
  }
  if (intervalAt > now)
    return {
      ...result,
      reason: "interval",
      allowed: false,
      ...(intervalAt <= end ? { nextAt: intervalAt } : {}),
    };
  return { ...result, reason: "allowed", allowed: true };
}
const demoConfig: DiaryConfig = {
  start: "2026-11-09",
  end: "2026-11-22",
  allowLate: false,
  daily: { kind: "limited", count: 3 },
  total: { kind: "limited", count: 10 },
  minInterval: 0,
  push: false,
  reminderHours: 24,
};
export function freshSession(order: number, now: number): ParticipantTask {
  return {
    day: order,
    status: "inprogress",
    step: 0,
    answers: emptyAnswers(),
    draft: "",
    startedAt: now,
  };
}
function seed(scenario: ParticipantScenario) {
  const configured = ["first", "configured", "return"].includes(scenario);
  const override: DiaryConfig | null = configured
    ? null
    : structuredClone(demoConfig);
  let now = Date.parse("2026-11-11T12:00:00+08:00");
  let count =
    scenario === "first" || scenario === "notstarted"
      ? 0
      : scenario === "dailyLimit" || scenario === "total"
        ? 3
        : 1;
  if (scenario === "first" || scenario === "configured") {
    const c = useDiaryStore.getState().study.config;
    const n = Date.parse(`${c.start}T12:00:00+08:00`);
    if (Number.isFinite(n)) now = n;
    count = 0;
  }
  if (scenario === "notstarted") now = Date.parse("2026-11-08T12:00:00+08:00");
  if (scenario === "ended") now = Date.parse("2026-11-23T12:00:00+08:00");
  if (override && scenario === "interval") override.minInterval = 4;
  if (override && scenario === "total")
    override.total = { kind: "limited", count: 3 };
  const tasks: ParticipantTask[] = Array.from({ length: count }, (_, i) => ({
    ...freshSession(i + 1, now - (count - i + 1) * HOUR),
    status: "submitted",
    step: 4,
    submittedAt: now - (count - i + 1) * HOUR + 10 * 60000,
    answers: {
      used: "yes",
      product: "产品 A",
      context: "在家，安静环境",
      experience: "饭后拍小票记账，操作比较顺畅。",
      score: 4,
      followup: "目前能满足日常记账需要。",
    },
  }));
  if (scenario === "return") {
    for (const t of tasks) {
      t.startedAt -= 24 * HOUR;
      if (t.submittedAt) t.submittedAt -= 24 * HOUR;
    }
  }
  if (scenario === "return") {
    const t = freshSession(count + 1, now - HOUR);
    t.step = 2;
    t.answers = {
      ...emptyAnswers(),
      used: "yes",
      context: "通勤地铁上",
      experience: "分类入口不好找，这次花了更久。",
    };
    tasks.push(t);
  }
  return {
    scenario,
    now,
    override,
    joined: scenario !== "first",
    identityKnown: scenario !== "identity",
    selectedDay: tasks.at(-1)?.day ?? 0,
    tasks,
  };
}
interface ParticipantState {
  scenario: ParticipantScenario;
  now: number;
  override: DiaryConfig | null;
  joined: boolean;
  identityKnown: boolean;
  selectedDay: number;
  tasks: ParticipantTask[];
  chooseScenario: (s: ParticipantScenario) => void;
  join: () => void;
  restore: () => void;
  begin: () => boolean;
  selectTask: (day: number) => void;
  edit: (day: number, patch: Partial<TaskAnswers>) => void;
  saveDraft: (day: number, draft: string) => void;
  next: (day: number) => void;
  back: (day: number) => void;
  submit: (day: number) => void;
  allowHistory: (day: number, value: boolean) => void;
  advanceClock: (hours: number) => void;
}
const configFor = (s: ParticipantState) =>
  s.override ?? useDiaryStore.getState().study.config;
export const canAnswer = (task: ParticipantTask) =>
  task.status === "inprogress";
const permitted = (s: ParticipantState) =>
  s.joined &&
  s.identityKnown &&
  entryDecision(configFor(s), s.tasks, s.now).allowed;
export const useParticipantStore = create<ParticipantState>()(
  persist(
    (set, get) => ({
      ...seed("configured"),
      chooseScenario: (scenario) => set(seed(scenario)),
      join: () => set({ joined: true, identityKnown: true }),
      restore: () => set({ identityKnown: true }),
      begin: () => {
        const s = get();
        if (!permitted(s)) return false;
        const pending = s.tasks.find(canAnswer);
        if (pending) {
          set({ selectedDay: pending.day });
          return true;
        }
        const day = Math.max(0, ...s.tasks.map((t) => t.day)) + 1;
        set({
          selectedDay: day,
          tasks: [...s.tasks, freshSession(day, s.now)],
        });
        return true;
      },
      selectTask: (selectedDay) =>
        set((s) =>
          s.tasks.some((t) => t.day === selectedDay && t.status === "submitted")
            ? { selectedDay }
            : {},
        ),
      edit: (day, patch) =>
        set((s) =>
          permitted(s)
            ? {
                tasks: s.tasks.map((t) =>
                  t.day === day && canAnswer(t)
                    ? { ...t, answers: { ...t.answers, ...patch } }
                    : t,
                ),
              }
            : {},
        ),
      saveDraft: (day, draft) =>
        set((s) =>
          permitted(s)
            ? {
                tasks: s.tasks.map((t) =>
                  t.day === day && canAnswer(t) ? { ...t, draft } : t,
                ),
              }
            : {},
        ),
      next: (day) =>
        set((s) =>
          permitted(s)
            ? {
                tasks: s.tasks.map((t) =>
                  t.day === day && canAnswer(t)
                    ? { ...t, step: Math.min(4, t.step + 1) }
                    : t,
                ),
              }
            : {},
        ),
      back: (day) =>
        set((s) =>
          permitted(s)
            ? {
                tasks: s.tasks.map((t) =>
                  t.day === day && canAnswer(t)
                    ? { ...t, step: Math.max(0, t.step - 1) }
                    : t,
                ),
              }
            : {},
        ),
      submit: (day) =>
        set((s) => {
          if (!permitted(s)) return {};
          return {
            tasks: s.tasks.map((t) =>
              t.day === day &&
              canAnswer(t) &&
              t.step === 4 &&
              (t.answers.used === "no" ||
                (t.answers.used === "yes" &&
                  t.answers.context.trim() &&
                  t.answers.experience.trim() &&
                  t.answers.score >= 1 &&
                  t.answers.score <= 5))
                ? { ...t, status: "submitted", submittedAt: s.now, draft: "" }
                : t,
            ),
          };
        }),
      allowHistory: (day, value) =>
        set((s) =>
          permitted(s)
            ? {
                tasks: s.tasks.map((t) =>
                  t.day === day && canAnswer(t)
                    ? { ...t, useHistory: value }
                    : t,
                ),
              }
            : {},
        ),
      advanceClock: (hours) =>
        set((s) => ({ now: s.now + Math.max(0, hours) * HOUR })),
    }),
    { name: "mizzen-diary-participant-entry-v2", skipHydration: true },
  ),
);
