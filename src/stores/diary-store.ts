"use client";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Key } from "@/i18n/messages";
import { initialStudy } from "@/lib/fixtures";
import { configError, dateAfter } from "@/lib/diary-rules";
import type {
  Brief,
  DiaryConfig,
  Locale,
  Message,
  Modal,
  Question,
  Study,
  Theme,
} from "@/types/diary";
interface DiaryState {
  study: Study;
  locale: Locale;
  theme: Theme;
  modal: Modal;
  toast: Key | null;
  search: string;
  tags: string[];
  messages: Message[];
  updateBrief: (patch: Partial<Brief>) => void;
  createStudy: () => boolean;
  updateTitle: (title: string) => void;
  updateConfig: (patch: Partial<DiaryConfig>) => void;
  updateQuestion: (id: string, patch: Partial<Question>) => void;
  importQuestions: (text: string) => boolean;
  save: () => boolean;
  publish: () => boolean;
  setLocale: (locale: Locale) => void;
  toggleTheme: () => void;
  open: (modal: Modal) => void;
  notify: (key: Key | null) => void;
  setSearch: (search: string) => void;
  toggleTag: (tag: string) => void;
  clearFilters: () => void;
  ask: (question: string, skill: number | null) => void;
  clearChat: () => void;
}
export const useDiaryStore = create<DiaryState>()(
  persist(
    (set, get) => ({
      study: structuredClone(initialStudy),
      locale: "zh",
      theme: "light",
      modal: null,
      toast: null,
      search: "",
      tags: [],
      messages: [],
      updateBrief: (patch) =>
        set((s) => ({
          study: {
            ...s.study,
            brief: { ...s.study.brief, ...patch },
            dirty: true,
          },
        })),
      createStudy: () => {
        const { study } = get();
        if (!study.config.start) {
          set({ toast: "dateError" });
          return false;
        }
        if (
          !Number.isInteger(study.brief.days) ||
          study.brief.days < 1 ||
          study.brief.days > 365
        ) {
          set({ toast: "daysError" });
          return false;
        }
        set({
          study: {
            ...study,
            config: {
              ...study.config,
              end: dateAfter(study.config.start, study.brief.days),
              daily:
                study.brief.frequency === "daily"
                  ? { kind: "limited", count: 1 }
                  : { kind: "unlimited" },
              total: { kind: "limited", count: study.brief.days },
            },
            dirty: true,
          },
          toast: "sampleLoaded",
        });
        return true;
      },
      updateTitle: (title) =>
        set((s) => ({ study: { ...s.study, title, dirty: true } })),
      updateConfig: (patch) =>
        set((s) => ({
          study: {
            ...s.study,
            config: { ...s.study.config, ...patch },
            dirty: true,
          },
        })),
      updateQuestion: (id, patch) =>
        set((s) => ({
          study: {
            ...s.study,
            questions: s.study.questions.map((q) =>
              q.id === id ? { ...q, ...patch } : q,
            ),
            dirty: true,
          },
        })),
      importQuestions: (text) => {
        const lines = text
          .split("\n")
          .map((t) => t.trim())
          .filter(Boolean);
        if (!lines.length) {
          set({ toast: "importEmpty" });
          return false;
        }
        set((s) => ({
          study: {
            ...s.study,
            questions: lines.map((title, i) => ({
              id: `Q${i + 1}`,
              title,
              prompt: "",
              rule: { kind: "always" },
            })),
            dirty: true,
          },
          modal: null,
          toast: "imported",
        }));
        return true;
      },
      save: () => {
        const error = configError(get().study.config);
        if (error) {
          set({ toast: error });
          return false;
        }
        set((s) => ({
          study: {
            ...s.study,
            savedAt: new Date().toISOString(),
            dirty: false,
          },
          toast: "saved",
        }));
        return true;
      },
      publish: () => {
        if (!get().save()) return false;
        set((s) => ({
          study: {
            ...s.study,
            published: true,
            publishedConfig: structuredClone(s.study.config),
          },
          modal: { kind: "share" },
          toast: "published",
        }));
        return true;
      },
      setLocale: (locale) => set({ locale }),
      toggleTheme: () =>
        set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),
      open: (modal) => set({ modal }),
      notify: (toast) => set({ toast }),
      setSearch: (search) => set({ search }),
      toggleTag: (tag) =>
        set((s) => ({
          tags: s.tags.includes(tag)
            ? s.tags.filter((t) => t !== tag)
            : [...s.tags, tag],
        })),
      clearFilters: () => set({ search: "", tags: [] }),
      ask: (question, skill) =>
        set((s) => ({
          messages: [
            ...s.messages,
            { id: crypto.randomUUID(), question, skill },
          ],
        })),
      clearChat: () => set({ messages: [] }),
    }),
    {
      name: "mizzen-diary-next-v1",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s) => ({
        study: s.study,
        locale: s.locale,
        theme: s.theme,
        messages: s.messages,
      }),
    },
  ),
);
