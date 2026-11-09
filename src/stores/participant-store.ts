"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
export type ParticipantScenario =
  | "first"
  | "return"
  | "makeup"
  | "missed"
  | "waiting"
  | "lastday"
  | "ended"
  | "identity";
export type TaskStatus =
  "locked" | "available" | "inprogress" | "makeup" | "submitted" | "missed";
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
  status: TaskStatus;
  step: number;
  answers: TaskAnswers;
  draft: string;
  useHistory?: boolean;
};
const emptyAnswers = (): TaskAnswers => ({
  used: "",
  product: "产品 A",
  context: "",
  experience: "",
  score: 0,
  followup: "",
});
export function taskTitle(day: number) {
  return day === 1
    ? "首次使用与习惯"
    : day === 14
      ? "总结与产品比较"
      : `第 ${day} 天使用体验`;
}
export function taskDate(day: number) {
  const d = new Date(Date.UTC(2026, 10, 8 + day));
  return `${d.getUTCMonth() + 1} 月 ${d.getUTCDate()} 日`;
}
function seed(scenario: ParticipantScenario) {
  const currentDay =
    scenario === "first" ? 1 : ["lastday", "ended"].includes(scenario) ? 15 : 3;
  const tasks: ParticipantTask[] = Array.from({ length: 14 }, (_, i) => {
    const day = i + 1;
    let status: TaskStatus =
      day < currentDay
        ? "submitted"
        : day === currentDay
          ? "available"
          : "locked";
    if (scenario === "makeup" && day === 2) status = "makeup";
    if (scenario === "missed" && day === 1) status = "missed";
    if (scenario === "waiting" && day === 3) status = "submitted";
    if (scenario === "return" && day === 3) status = "inprogress";
    if (scenario === "lastday" && day === 14) status = "makeup";
    if (scenario === "ended" && [6, 9, 14].includes(day)) status = "missed";
    const answers =
      status === "submitted"
        ? {
            used: "yes",
            product: "产品 A",
            context: "在家，安静环境",
            experience: "晚饭后拍小票记账，操作比较顺畅。",
            score: 4,
            followup: "目前的操作能满足日常记账需要。",
          }
        : emptyAnswers();
    if (status === "inprogress")
      Object.assign(answers, {
        used: "yes",
        product: "产品 A",
        context: "通勤地铁上",
        experience: "分类入口不好找，这次花了更久。",
      });
    return {
      day,
      status,
      step: status === "submitted" ? 4 : status === "inprogress" ? 2 : 0,
      answers,
      draft: "",
    };
  });
  return {
    scenario,
    currentDay,
    joined: scenario !== "first",
    identityKnown: scenario !== "identity",
    selectedDay: scenario === "lastday" ? 14 : 3,
    tasks,
  };
}
interface ParticipantState {
  scenario: ParticipantScenario;
  currentDay: number;
  joined: boolean;
  identityKnown: boolean;
  selectedDay: number;
  tasks: ParticipantTask[];
  chooseScenario: (scenario: ParticipantScenario) => void;
  join: () => void;
  restore: () => void;
  selectTask: (day: number) => void;
  edit: (day: number, patch: Partial<TaskAnswers>) => void;
  saveDraft: (day: number, draft: string) => void;
  next: (day: number) => void;
  back: (day: number) => void;
  submit: (day: number) => void;
  allowHistory: (day: number, value: boolean) => void;
  expire: () => void;
}
export const canAnswer = (task: ParticipantTask) =>
  ["available", "inprogress", "makeup"].includes(task.status);
export const useParticipantStore = create<ParticipantState>()(
  persist(
    (set) => ({
      ...seed("first"),
      chooseScenario: (scenario) => set(seed(scenario)),
      join: () => set({ joined: true, identityKnown: true, selectedDay: 1 }),
      restore: () => set({ identityKnown: true }),
      selectTask: (selectedDay) =>
        set((s) => ({
          selectedDay,
          tasks: s.tasks.map((t) =>
            t.day === selectedDay && t.status === "available"
              ? { ...t, status: "inprogress" }
              : t,
          ),
        })),
      edit: (day, patch) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.day === day && canAnswer(t)
              ? { ...t, answers: { ...t.answers, ...patch } }
              : t,
          ),
        })),
      saveDraft: (day, draft) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.day === day && canAnswer(t) ? { ...t, draft } : t,
          ),
        })),
      next: (day) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.day === day && canAnswer(t)
              ? { ...t, step: Math.min(4, t.step + 1), draft: "" }
              : t,
          ),
        })),
      back: (day) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.day === day && canAnswer(t)
              ? { ...t, step: Math.max(0, t.step - 1) }
              : t,
          ),
        })),
      submit: (day) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.day === day && canAnswer(t) && t.step === 4
              ? { ...t, status: "submitted", draft: "" }
              : t,
          ),
        })),
      allowHistory: (day, value) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.day === day && canAnswer(t) ? { ...t, useHistory: value } : t,
          ),
        })),
      expire: () =>
        set((s) => ({
          scenario: s.currentDay >= 15 ? "ended" : "missed",
          currentDay: s.currentDay + 1,
          tasks: s.tasks.map((t) =>
            t.status === "makeup"
              ? { ...t, status: "missed" }
              : ["available", "inprogress"].includes(t.status)
                ? { ...t, status: "makeup" }
                : t.status === "locked" && t.day === s.currentDay + 1
                  ? { ...t, status: "available" }
                  : t,
          ),
        })),
    }),
    { name: "mizzen-diary-participant-demo-v1", skipHydration: true },
  ),
);
