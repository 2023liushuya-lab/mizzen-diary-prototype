export type Locale = "zh" | "en";
export type Theme = "light" | "dark";
export type StudyTab = "outline" | "records" | "analysis";
export type Limit = { kind: "unlimited" } | { kind: "limited"; count: number };
export interface DiaryConfig {
  start: string;
  end: string;
  allowLate: boolean;
  daily: Limit;
  total: Limit;
  minInterval: number;
  push: boolean;
  reminderHours: number;
}
export interface Brief {
  audience: string;
  days: number;
  frequency: "daily" | "unlimited";
  goal: string;
  mode: "standard" | "explore";
}
export type Rule =
  { kind: "always" } | { kind: "equals" | "atLeast"; count: number };
export interface Question {
  id: string;
  title: string;
  prompt: string;
  rule: Rule;
}
export interface DiaryRecord {
  id: string;
  participantId: string;
  name: string;
  order: number;
  tags: string[];
  startedAt: string;
  duration: number;
  quality: "high" | "medium";
  quote: string;
  summary?: string;
  answers: { questionId: string; text: string }[];
}
export interface Message {
  id: string;
  question: string;
  skill: number | null;
}
export type Modal =
  | {
      kind:
        | "publish"
        | "share"
        | "remind"
        | "preview"
        | "import"
        | "notes"
        | "column";
    }
  | { kind: "record"; id: string; questionId?: string }
  | null;
export interface Study {
  title: string;
  externalTitle?: string;
  brief: Brief;
  config: DiaryConfig;
  questions: Question[];
  published: boolean;
  publishedConfig: DiaryConfig | null;
  savedAt: string | null;
  dirty: boolean;
}

export interface DiaryParticipant {
  id: string;
  name: string;
}
export interface ParticipantRecordGroup {
  participant: DiaryParticipant;
  replies: DiaryRecord[];
  tags: string[];
  latest: DiaryRecord | null;
  highQualityCount: number;
  averageDuration: number | null;
}
export type ParticipantResponseStatus = "all" | "responded" | "pending";
