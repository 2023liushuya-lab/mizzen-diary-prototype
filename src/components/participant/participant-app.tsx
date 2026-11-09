"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Clock3,
  MessageSquare,
  ShieldCheck,
  BookOpen,
} from "lucide-react";
import { Brand, Preferences } from "@/components/diary/shell";
import { Button } from "@/components/ui/button";
import { Select, Input, Textarea } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useDiaryStore } from "@/stores/diary-store";
import {
  useParticipantStore,
  canAnswer,
  taskTitle,
  taskDate,
  type ParticipantScenario,
  type ParticipantTask,
} from "@/stores/participant-store";
type Screen = "home" | "study" | "interview" | "join";
export function ParticipantApp({ screen }: { screen: Screen }) {
  const router = useRouter();
  const state = useParticipantStore();
  const locale = useDiaryStore((s) => s.locale);
  const say = (zh: string, en: string) => (locale === "zh" ? zh : en);
  const [ready, setReady] = useState(false);
  const [endedTab, setEndedTab] = useState(false);
  useEffect(() => {
    let alive = true;
    Promise.resolve(useParticipantStore.persist.rehydrate()).then(() => {
      if (alive) setReady(true);
    });
    return () => {
      alive = false;
    };
  }, []);
  const task =
    state.tasks.find((t) => t.day === state.selectedDay) ?? state.tasks[0];
  const completed = state.tasks.filter((t) => t.status === "submitted").length;
  const actionable = state.tasks.filter(canAnswer);
  const ended = state.currentDay > 14 && actionable.length === 0;
  const statusText = (t: ParticipantTask) =>
    ({
      locked: say("未开放", "Upcoming"),
      available: say("待完成", "To do"),
      inprogress: say("进行中", "In progress"),
      makeup: say("待补答", "Makeup available"),
      submitted: say("已提交", "Submitted"),
      missed: say("已错过", "Missed"),
    })[t.status];
  const openTask = (t: ParticipantTask) => {
    state.selectTask(t.day);
    router.push("/participant/interview");
  };
  const cardPrimary =
    actionable.find((t) => t.status === "makeup") ??
    actionable.find((t) => t.status === "inprogress") ??
    actionable[0];
  const taskName = (day: number) =>
    locale === "zh"
      ? taskTitle(day)
      : day === 1
        ? "First use and habits"
        : day === 14
          ? "Final reflection"
          : `Day ${day} experience`;
  const title = say(
    "记账 App · 14 天体验研究",
    "Bookkeeping app · 14-day diary",
  );
  const samples = [
    say(
      "分类入口不好找，这次比昨天花了更久。",
      "Finding the right category took longer today.",
    ),
    say(
      "操作和前几次差不多，饭后拍照记账很顺畅。",
      "The same as before: smooth receipt capture after dinner.",
    ),
  ];
  const followup =
    task.answers.used === "no"
      ? say(
          "这次没有使用，主要是没有遇到需要它的情况，还是有其他原因？不记得也可以直接说明。",
          "What kept you from using it? It is fine if you do not remember.",
        )
      : task.day === 1 || !task.useHistory
        ? say(
            "刚才提到的经历中，哪个步骤最影响你的感受？可以结合一个具体细节说说。",
            "Which step affected your experience most? A concrete detail would help.",
          )
        : task.answers.product !== "产品 A"
          ? say(
              "确认一下：这次评价的是产品 B，上次记录对应产品 A。它们在相同任务下有什么不同？不同产品的偏好不需要保持一致。",
              "This time you evaluated B; the earlier entry was about A. How did they differ for the same task?",
            )
          : task.answers.context.includes("通勤") ||
              task.answers.context.includes("办公室")
            ? say(
                "你第 1 天记录的是在家使用，这次是在通勤或工作场景。这些环境差异对操作有什么影响？",
                "Day 1 was at home; this time you used it while commuting or working. How did the setting affect the experience?",
              )
            : task.answers.score <= 2
              ? say(
                  "你第 1 天给产品 A 的满意度是 4 分，这次是 " +
                    task.answers.score +
                    " 分。今天有什么具体经历影响了评价？如果是环境或任务不同，也可以说明。",
                  "You rated product A 4/5 on day 1. What happened today that affected this rating? Different conditions may explain it.",
                )
              : say(
                  "回想第 1 天和这次的经历，哪些保持不变，哪些发生了变化？可以说一个小细节，没有新的变化也没关系。",
                  "Thinking about day 1 and today, what stayed the same and what changed? No change is also a valid answer.",
                );
  const labels = [
    say("最近使用", "Recent use"),
    say("使用经历", "Experience"),
    say("本次评价", "Rating"),
    say("补充了解", "Follow-up"),
    say("确认提交", "Review"),
  ];
  const advance = () => state.next(task.day);
  return (
    <div className="min-h-dvh bg-gray-50 dark:bg-background">
      <div className="border-b border-border bg-card px-4 py-3">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
          <div>
            <Link
              href="/study/recruit"
              className="text-xs text-muted-foreground hover:text-primary"
            >
              ← {say("返回研究员端", "Researcher view")}
            </Link>
            <p className="mt-1 text-sm font-medium">
              {say("C 端交互预览", "Participant preview")}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label
              className="text-xs text-muted-foreground"
              htmlFor="participant-scenario"
            >
              {say("演示场景", "Demo scenario")}
            </label>
            <Select
              id="participant-scenario"
              className="h-8 max-w-[220px] text-xs"
              value={state.scenario}
              onChange={(e) => {
                const v = e.target.value as ParticipantScenario;
                state.chooseScenario(v);
                setEndedTab(v === "ended");
                router.push(
                  v === "first" ? "/participant/join" : "/participant",
                );
              }}
            >
              {(
                [
                  ["first", "首次链接进入", "First entry"],
                  ["return", "再次打开 App · 续答", "Return and resume"],
                  ["makeup", "昨日待补答 + 今日待答", "Makeup and today"],
                  ["missed", "补答过期 · 后续仍可答", "Missed task"],
                  ["waiting", "今日完成 · 等待下一次", "Waiting"],
                  [
                    "lastday",
                    "研究结束 · 最后一天可补答",
                    "Final makeup window",
                  ],
                  ["ended", "研究已结束", "Study ended"],
                  ["identity", "无法确认参与身份", "Identity recovery"],
                ] as const
              ).map(([v, zh, en]) => (
                <option key={v} value={v}>
                  {say(zh, en)}
                </option>
              ))}
            </Select>
            <Preferences />
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-[440px] bg-card sm:my-7 sm:min-h-[740px] sm:rounded-2xl sm:border sm:border-border">
        <header className="flex h-16 items-center justify-between border-b border-border px-5">
          <div className="flex items-center gap-2.5">
            {screen !== "home" && (
              <button
                aria-label={say("返回", "Back")}
                onClick={() =>
                  router.push(
                    screen === "interview"
                      ? "/participant/study"
                      : "/participant",
                  )
                }
                className="rounded-md p-1 text-muted-foreground hover:bg-surface"
              >
                <ArrowLeft className="size-5" />
              </button>
            )}
            <Brand />
            <span className="text-base font-semibold">Mizzen</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {say("我的研究", "My studies")}
          </span>
        </header>
        {!ready ? (
          <p className="p-6 text-sm text-muted-foreground">
            {say("恢复进度中…", "Restoring progress…")}
          </p>
        ) : !state.identityKnown ? (
          <section className="px-6 py-12">
            <ShieldCheck className="mb-5 size-8 text-primary" />
            <h1 className="text-xl font-semibold">
              {say("找回你的参与记录", "Recover your participation")}
            </h1>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              {say(
                "请使用原来参与研究的账号。暂时无法确认身份，不会为你新建一份参与记录。",
                "Use the account you joined with. We will not create duplicate participation.",
              )}
            </p>
            <Button className="mt-6 w-full" onClick={() => state.restore()}>
              {say("恢复示例账号", "Restore demo account")}
            </Button>
            <p className="mt-3 text-xs leading-6 text-placeholder">
              {say(
                "这里仅模拟恢复结果，不提供真实登录或跨设备身份识别。",
                "Simulated recovery only; no real login or cross-device identification.",
              )}
            </p>
          </section>
        ) : screen === "join" ? (
          <section className="p-6">
            <span className="rounded-md bg-indigo-50 px-2 py-1 text-xs text-primary dark:bg-indigo-950">
              {say("日记法研究邀请", "Diary study invitation")}
            </span>
            <h1 className="mt-5 text-xl font-semibold leading-8">{title}</h1>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              {say(
                "记录每天真实的使用体验，了解操作习惯和感受的变化。每天约 5–8 分钟，通过同一个入口继续参与。",
                "Share real experiences each day, about 5–8 minutes per session, using one entry point.",
              )}
            </p>
            <div className="my-6 divide-y divide-border rounded-xl border border-border px-4 text-sm">
              <p className="py-3">
                {say(
                  "研究时间：11 月 9 日至 11 月 22 日",
                  "Study dates: Nov 9–22",
                )}
              </p>
              <p className="py-3">
                {say(
                  "参与要求：每天 1 次，共 14 次",
                  "Participation: 1 session daily, 14 total",
                )}
              </p>
              <p className="py-3">
                {say(
                  "当日漏答，可在次日 24 小时内补答",
                  "Missed daily tasks can be completed during the next day",
                )}
              </p>
            </div>
            <div className="mb-6 flex gap-2 text-xs leading-6 text-muted-foreground">
              <ShieldCheck className="mt-1 size-4 shrink-0" />
              {say(
                "确认参与后，研究会保存在 Mizzen App 的“我的研究”。本预览以示例账号 P001 演示。",
                "Joining adds this study to My studies. This preview uses demo account P001.",
              )}
            </div>
            <Button
              className="w-full"
              onClick={() => {
                if (!state.joined) state.join();
                router.push("/participant/study");
              }}
            >
              {state.joined
                ? say("返回我的研究", "Return to study")
                : say("确认参与", "Join study")}
            </Button>
            <p className="mt-3 text-center text-xs text-placeholder">
              {say(
                "仅查看邀请不会自动加入研究",
                "Viewing this invitation does not enroll you",
              )}
            </p>
          </section>
        ) : !state.joined ? (
          <section className="px-6 py-12">
            <BookOpen className="mb-5 size-8 text-muted-foreground" />
            <h1 className="text-xl font-semibold">
              {say("欢迎回来", "Welcome back")}
            </h1>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              {say(
                "确认参与邀请后，你的日记研究会显示在这里。",
                "Your diary studies appear here after you accept an invitation.",
              )}
            </p>
            <Button
              className="mt-6 w-full"
              onClick={() => router.push("/participant/join")}
            >
              {say("查看研究邀请", "View invitation")}
            </Button>
          </section>
        ) : screen === "home" ? (
          <section className="p-5">
            <h1 className="text-xl font-semibold">
              {say("我的研究", "My studies")}
            </h1>
            <div className="mt-5 flex gap-5 border-b border-border">
              <button
                className={cn(
                  "border-b-2 pb-3 text-sm",
                  !endedTab
                    ? "border-primary font-medium text-primary"
                    : "border-transparent text-muted-foreground",
                )}
                onClick={() => setEndedTab(false)}
              >
                {say("进行中", "Active")}
              </button>
              <button
                className={cn(
                  "border-b-2 pb-3 text-sm",
                  endedTab
                    ? "border-primary font-medium text-primary"
                    : "border-transparent text-muted-foreground",
                )}
                onClick={() => setEndedTab(true)}
              >
                {say("已结束", "Ended")}
              </button>
            </div>
            {ended === endedTab ? (
              <button
                className="mt-5 w-full rounded-xl border border-border p-4 text-left hover:bg-gray-50 dark:hover:bg-surface"
                onClick={() => router.push("/participant/study")}
                data-testid="participant-study-card"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-primary">
                    {say("日记法研究", "Diary study")}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {ended ? say("已结束", "Ended") : say("进行中", "Active")}
                  </span>
                </div>
                <h2 className="mt-3 text-base font-semibold leading-7">
                  {title}
                </h2>
                <p className="mt-2 text-xs text-muted-foreground">
                  {say(
                    `已完成 ${completed} / 14 次`,
                    `Completed ${completed} / 14 sessions`,
                  )}
                </p>
                <div className="mt-3 h-1 overflow-hidden rounded-full bg-surface">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${(completed / 14) * 100}%` }}
                  />
                </div>
                <div className="mt-5 border-t border-border pt-4">
                  <p className="text-sm font-medium">
                    {ended
                      ? say(
                          `已完成 ${completed} 次，错过 ${14 - completed} 次`,
                          `Completed ${completed}; missed ${14 - completed}`,
                        )
                      : cardPrimary?.status === "makeup"
                        ? say(
                            `第 ${cardPrimary.day} 天待补答`,
                            `Day ${cardPrimary.day} makeup available`,
                          )
                        : cardPrimary
                          ? say(
                              `第 ${cardPrimary.day} 天${cardPrimary.status === "inprogress" ? "进行中" : "待完成"}`,
                              `Day ${cardPrimary.day} ${statusText(cardPrimary)}`,
                            )
                          : say("今日已完成", "Today is complete")}
                  </p>
                  <p className="mt-2 text-xs leading-6 text-muted-foreground">
                    {ended
                      ? say(
                          "可查看已提交记录，无法继续作答",
                          "View submitted entries; answering is closed",
                        )
                      : cardPrimary?.status === "makeup"
                        ? say(
                            `补答截止：${taskDate(cardPrimary.day + 1)} 24:00${actionable.length > 1 ? "；今日还有 1 个待完成任务" : ""}`,
                            `Makeup deadline: ${taskDate(cardPrimary.day + 1)} 24:00`,
                          )
                        : cardPrimary
                          ? say(
                              "进度自动保存在当前设备，可随时回来继续",
                              "Progress is saved on this device",
                            )
                          : say(
                              `下次开放：${taskDate(state.currentDay + 1)} 00:00`,
                              `Next opens: ${taskDate(state.currentDay + 1)} 00:00`,
                            )}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    {ended
                      ? say("查看研究", "View study")
                      : cardPrimary?.status === "makeup"
                        ? say("去补答", "Make up task")
                        : cardPrimary?.status === "inprogress"
                          ? say("继续访谈", "Resume interview")
                          : cardPrimary
                            ? say("开始访谈", "Start interview")
                            : say("查看进度", "View progress")}
                    <ChevronRight className="size-4" />
                  </span>
                </div>
              </button>
            ) : (
              <p className="py-12 text-center text-sm text-muted-foreground">
                {endedTab
                  ? say("暂无已结束的研究", "No ended studies")
                  : say("暂无进行中的研究", "No active studies")}
              </p>
            )}
          </section>
        ) : screen === "study" ? (
          <section className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-primary">
                {say("日记法研究", "Diary study")}
              </span>
              <span className="text-xs text-muted-foreground">
                {ended
                  ? say("已结束", "Ended")
                  : state.currentDay > 14
                    ? say("补答期", "Makeup period")
                    : say(
                        `第 ${state.currentDay} / 14 天`,
                        `Day ${state.currentDay} / 14`,
                      )}
              </span>
            </div>
            <h1 className="mt-3 text-xl font-semibold leading-8">{title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {say(
                `已完成 ${completed} / 14 次`,
                `Completed ${completed} / 14 sessions`,
              )}
            </p>
            {state.tasks.some((t) => t.status === "makeup") && (
              <div className="mt-5 rounded-lg bg-indigo-50 p-3 text-xs leading-6 text-primary dark:bg-indigo-950">
                {state.currentDay > 14
                  ? say(
                      "研究日期已结束，最后一天仍在补答期内。",
                      "Study dates have ended, but the final task is still eligible for makeup.",
                    )
                  : say(
                      "昨天的任务可以补答，也可以先完成今天的任务，两者分别记录。",
                      "Yesterday’s makeup and today’s task are separate; either can be completed first.",
                    )}
              </div>
            )}
            <h2 className="mt-6 mb-2 text-sm font-semibold">
              {say("任务与记录", "Tasks and entries")}
            </h2>
            <div className="divide-y divide-border">
              {state.tasks.map((t) => (
                <div
                  key={t.day}
                  className="flex items-center gap-3 py-4"
                  data-testid="participant-task"
                  data-day={t.day}
                  data-status={t.status}
                >
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full text-xs",
                      t.status === "submitted"
                        ? "bg-indigo-50 text-primary dark:bg-indigo-950"
                        : "bg-surface text-muted-foreground",
                    )}
                  >
                    {t.status === "submitted" ? (
                      <Check className="size-4" />
                    ) : (
                      t.day
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{taskName(t.day)}</p>
                    <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                      {taskDate(t.day)} · {statusText(t)}
                      {t.status === "makeup"
                        ? say(
                            ` · 补答截止 ${taskDate(t.day + 1)} 24:00`,
                            ` · Until ${taskDate(t.day + 1)} 24:00`,
                          )
                        : t.status === "locked"
                          ? " · 00:00 " + say("开放", "opens")
                          : t.status === "missed"
                            ? say(" · 补答期限已过", " · Makeup window closed")
                            : ""}
                    </p>
                  </div>
                  {canAnswer(t) ? (
                    <Button
                      size="sm"
                      variant={t.status === "makeup" ? "outline" : "default"}
                      onClick={() => openTask(t)}
                    >
                      {t.status === "makeup"
                        ? t.step > 0
                          ? say("继续补答", "Resume")
                          : say("补答", "Make up")
                        : t.status === "inprogress"
                          ? say("继续", "Resume")
                          : say("开始", "Start")}
                    </Button>
                  ) : t.status === "submitted" ? (
                    <button
                      className="shrink-0 text-xs text-primary hover:underline"
                      onClick={() => openTask(t)}
                    >
                      {say("查看", "View")}
                    </button>
                  ) : (
                    <span className="shrink-0 text-xs text-placeholder">
                      {t.status === "locked"
                        ? say("未开放", "Upcoming")
                        : say("不可补答", "Closed")}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section className="p-5">
            <span className="text-xs text-primary">
              {taskDate(task.day)} ·{" "}
              {task.status === "makeup"
                ? say("补答昨日任务", "Makeup task")
                : say(`第 ${task.day} 次访谈`, `Session ${task.day}`)}
            </span>
            <h1 className="mt-2 text-lg font-semibold">{taskName(task.day)}</h1>
            {task.status === "submitted" ? (
              <>
                <div className="my-5 flex items-center gap-2 rounded-lg bg-indigo-50 p-3 text-sm text-primary dark:bg-indigo-950">
                  <Check className="size-4" />
                  {say(
                    "已提交，不会重复生成记录",
                    "Submitted; no duplicate entry",
                  )}
                </div>
                <div className="space-y-4 text-sm leading-7">
                  <p>
                    <span className="text-muted-foreground">
                      {say("使用情况：", "Usage: ")}
                    </span>
                    {task.answers.used === "no"
                      ? say("未使用", "Not used")
                      : say("有使用", "Used")}
                  </p>
                  {task.answers.used !== "no" && (
                    <>
                      <p>
                        {task.answers.product} · {task.answers.context}
                      </p>
                      <p>{task.answers.experience}</p>
                      <p>
                        {say("本次评价：", "Rating: ")}
                        {task.answers.score} / 5
                      </p>
                    </>
                  )}
                  <p>{task.answers.followup}</p>
                </div>
                <Button
                  className="mt-6 w-full"
                  variant="outline"
                  onClick={() => router.push("/participant/study")}
                >
                  {say("返回任务列表", "Back to tasks")}
                </Button>
              </>
            ) : !canAnswer(task) ? (
              <div className="py-8">
                <Clock3 className="mb-4 size-7 text-muted-foreground" />
                <h2 className="text-base font-semibold">
                  {task.status === "locked"
                    ? say("任务尚未开放", "Not open yet")
                    : say("补答期限已结束", "Makeup window closed")}
                </h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {say(
                    "已填写的内容仍保留，但当前不能继续或提交这次任务。你可以返回查看其他任务。",
                    "Your draft is retained, but this task cannot be continued or submitted. Check other tasks.",
                  )}
                </p>
                <Button
                  className="mt-5 w-full"
                  variant="outline"
                  onClick={() => router.push("/participant/study")}
                >
                  {say("查看其他任务", "View other tasks")}
                </Button>
              </div>
            ) : (
              <>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{labels[task.step]}</span>
                  <span>{task.step + 1} / 5</span>
                </div>
                <div className="mt-2 h-1 rounded-full bg-surface">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(task.step + 1) * 20}%` }}
                  />
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  {say(
                    "草稿自动保存在当前设备，退出后可继续",
                    "Draft saved on this device; you can return later",
                  )}
                </p>
                {task.step === 0 ? (
                  <div className="py-7">
                    <Question
                      text={say(
                        "最近一次任务期间，你有使用这个产品吗？",
                        "Did you use the product during this task period?",
                      )}
                    />
                    {[
                      ["yes", say("有使用", "Yes")],
                      ["no", say("没有使用", "No")],
                    ].map(([v, label]) => (
                      <button
                        key={v}
                        className={cn(
                          "mt-3 flex w-full items-center justify-between rounded-lg border p-4 text-left text-sm",
                          task.answers.used === v
                            ? "border-primary bg-indigo-50 text-primary dark:bg-indigo-950"
                            : "border-border",
                        )}
                        onClick={() => state.edit(task.day, { used: v })}
                      >
                        {label}
                        {task.answers.used === v && (
                          <Check className="size-4" />
                        )}
                      </button>
                    ))}
                  </div>
                ) : task.step === 1 ? (
                  <div className="space-y-4 py-7">
                    {task.answers.used === "no" ? (
                      <>
                        <Question
                          text={say(
                            "这段时间没有使用，也是一条有效记录。",
                            "Not using the product is also a valid observation.",
                          )}
                        />
                        <p className="text-sm leading-7 text-muted-foreground">
                          {say(
                            "无需回忆或编造使用经历，下一步会简单了解原因。",
                            "You do not need to invent an experience. We will ask a brief follow-up.",
                          )}
                        </p>
                      </>
                    ) : (
                      <>
                        <Question
                          text={say(
                            "聊聊最近一次使用经历。",
                            "Tell us about your latest use.",
                          )}
                        />
                        <label className="block text-xs text-muted-foreground">
                          {say("本次产品", "Product this time")}
                          <Select
                            className="mt-2 w-full"
                            aria-label={say("本次产品", "Product this time")}
                            value={task.answers.product}
                            onChange={(e) =>
                              state.edit(task.day, { product: e.target.value })
                            }
                          >
                            <option>产品 A</option>
                            <option>产品 B</option>
                          </Select>
                        </label>
                        <label className="block text-xs text-muted-foreground">
                          {say(
                            "当时在哪里、想完成什么？",
                            "Where were you and what were you trying to do?",
                          )}
                          <Input
                            className="mt-2"
                            aria-label={say("使用情境", "Context")}
                            placeholder={say(
                              "例如：通勤地铁上，记录一笔车费",
                              "For example: on the train, recording a fare",
                            )}
                            value={task.answers.context}
                            onChange={(e) =>
                              state.edit(task.day, { context: e.target.value })
                            }
                          />
                        </label>
                        <label className="block text-xs text-muted-foreground">
                          {say("发生了什么？", "What happened?")}
                          <Textarea
                            className="mt-2"
                            aria-label={say("使用经历", "Experience")}
                            rows={3}
                            value={task.answers.experience}
                            onChange={(e) =>
                              state.edit(task.day, {
                                experience: e.target.value,
                              })
                            }
                          />
                        </label>
                        <details className="text-xs text-muted-foreground">
                          <summary className="cursor-pointer">
                            {say("填入一段演示经历", "Use a sample experience")}
                          </summary>
                          <div className="mt-2 space-y-2">
                            {samples.map((s) => (
                              <button
                                key={s}
                                className="block text-left leading-6 text-primary"
                                onClick={() =>
                                  state.edit(task.day, {
                                    context:
                                      s.includes("顺畅") || s.includes("smooth")
                                        ? "在家，安静环境"
                                        : "在家，安静环境",
                                    experience: s,
                                  })
                                }
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </details>
                      </>
                    )}
                  </div>
                ) : task.step === 2 ? (
                  <div className="py-7">
                    {task.answers.used === "no" ? (
                      <>
                        <Question
                          text={say(
                            "本次没有使用，跳过体验评分。",
                            "No usage this time; the rating is skipped.",
                          )}
                        />
                        <p className="mt-3 text-sm leading-7 text-muted-foreground">
                          {say(
                            "不会把“未使用”记为 0 分或低质量回答。",
                            "Not using it will not be counted as a zero rating or low-quality response.",
                          )}
                        </p>
                      </>
                    ) : (
                      <>
                        <Question
                          text={say(
                            "这次使用，你的满意程度如何？",
                            "How satisfied were you with this use?",
                          )}
                        />
                        <div className="mt-5 flex gap-2">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <button
                              key={n}
                              aria-label={`${n} ${say("分", "points")}`}
                              className={cn(
                                "flex h-12 flex-1 items-center justify-center rounded-lg border text-base",
                                task.answers.score === n
                                  ? "border-primary bg-indigo-50 font-semibold text-primary dark:bg-indigo-950"
                                  : "border-border",
                              )}
                              onClick={() => state.edit(task.day, { score: n })}
                            >
                              {n}
                            </button>
                          ))}
                        </div>
                        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                          <span>{say("很不满意", "Very dissatisfied")}</span>
                          <span>{say("很满意", "Very satisfied")}</span>
                        </div>
                      </>
                    )}
                  </div>
                ) : task.step === 3 ? (
                  <div className="py-6">
                    <Question text={followup} />
                    {task.day > 1 &&
                      task.answers.used !== "no" &&
                      !task.useHistory && (
                        <div className="mt-4 rounded-lg border border-border p-3 text-xs leading-6 text-muted-foreground">
                          <p>
                            {say(
                              "可参考本研究第 1 天的产品 A 体验，对照本次变化。是否结合前次记录继续聊？",
                              "An earlier product A entry from day 1 is available. Would you like to compare it with today?",
                            )}
                          </p>
                          <button
                            className="mt-2 text-primary hover:underline"
                            onClick={() => state.allowHistory(task.day, true)}
                          >
                            {say("结合前次记录继续", "Use my earlier entry")}
                          </button>
                        </div>
                      )}
                    {task.day > 1 &&
                      task.answers.used !== "no" &&
                      task.useHistory && (
                        <details className="mt-4 rounded-lg bg-surface p-3 text-xs leading-6 text-muted-foreground">
                          <summary className="cursor-pointer">
                            {say(
                              "查看引用的历史记录",
                              "View the referenced entry",
                            )}
                          </summary>
                          <p className="mt-2">
                            {say(
                              "来源：本研究，第 1 天 · 产品 A · 满意度 4/5。情境：在家，安静环境。演示记录，不是真实访谈。",
                              "Source: this study, day 1, product A, 4/5, at home. This is a simulated entry.",
                            )}
                          </p>
                        </details>
                      )}
                    <Textarea
                      className="mt-5"
                      rows={4}
                      aria-label={say("补充回答", "Follow-up answer")}
                      placeholder={say(
                        "分享你的想法，也可以说没有变化或不记得",
                        "Share your thoughts; no change or not remembering is fine",
                      )}
                      value={task.draft || task.answers.followup}
                      onChange={(e) => {
                        state.edit(task.day, { followup: e.target.value });
                        state.saveDraft(task.day, e.target.value);
                      }}
                    />
                    <p className="mt-2 text-xs text-muted-foreground">
                      {say(
                        "不想补充可以跳过，不影响提交。",
                        "You can skip this without affecting submission.",
                      )}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 py-6 text-sm leading-7">
                    <Question text={say("确认本次记录", "Review your entry")} />
                    <p>
                      {taskDate(task.day)} ·{" "}
                      {task.answers.used === "no"
                        ? say("本次未使用", "Not used this time")
                        : `${task.answers.product} · ${task.answers.context}`}
                    </p>
                    {task.answers.used !== "no" && (
                      <>
                        <p>{task.answers.experience}</p>
                        <p>
                          {say("满意度：", "Satisfaction: ")}
                          {task.answers.score}/5
                        </p>
                      </>
                    )}
                    <p className="text-muted-foreground">
                      {task.answers.followup ||
                        say("未补充说明", "No additional explanation")}
                    </p>
                    <p className="rounded-lg bg-surface p-3 text-xs text-muted-foreground">
                      {say(
                        "提交后本次记录不可修改。你仍可在后续任务中补充或修正之前的说法。",
                        "This entry is read-only after submission; later tasks can clarify earlier statements.",
                      )}
                    </p>
                  </div>
                )}
                <div className="mt-2 flex gap-2">
                  {task.step > 0 && (
                    <Button
                      variant="outline"
                      onClick={() => state.back(task.day)}
                    >
                      {say("上一步", "Back")}
                    </Button>
                  )}
                  <Button
                    className="flex-1"
                    disabled={
                      task.step === 0
                        ? !task.answers.used
                        : task.step === 1 && task.answers.used !== "no"
                          ? !task.answers.context.trim() ||
                            !task.answers.experience.trim()
                          : task.step === 2 && task.answers.used !== "no"
                            ? !task.answers.score
                            : false
                    }
                    onClick={() =>
                      task.step === 4 ? state.submit(task.day) : advance()
                    }
                  >
                    {task.step === 4
                      ? say("提交本次记录", "Submit entry")
                      : task.step === 3 && !task.answers.followup.trim()
                        ? say("跳过并继续", "Skip and continue")
                        : say("继续", "Continue")}
                    <ArrowRight />
                  </Button>
                </div>
                <button
                  className="mt-5 block w-full py-2 text-center text-xs text-muted-foreground hover:text-primary"
                  onClick={() => router.push("/participant/study")}
                >
                  {say("稍后继续，返回任务列表", "Save and return to tasks")}
                </button>
              </>
            )}
          </section>
        )}
        <div className="px-5 py-5 text-center text-[10px] leading-5 text-placeholder">
          {say(
            "交互原型 · 示例账号与任务 · 追问为规则驱动演示",
            "Prototype · demo account and tasks · rule-based follow-ups",
          )}
        </div>
      </div>
      <div className="mx-auto max-w-[440px] px-5 pb-6 text-xs leading-6 text-muted-foreground">
        {say("演示时钟：", "Demo clock: ")}
        {`${taskDate(state.currentDay)} 12:00`}
        {state.tasks.some((t) => t.status === "makeup") && (
          <button
            className="mt-2 block text-primary hover:underline"
            onClick={() => state.expire()}
          >
            {say("推进到补答截止后", "Advance past makeup deadline")}
          </button>
        )}
        <p className="mt-2">
          {say(
            "场景切换仅重置 C 端演示进度；不会修改研究员端配置。账号关联、App 唤起及跨设备同步均未接入。",
            "Scenario changes reset only participant demo data. Account linking, app opening and cross-device sync are not connected.",
          )}
        </p>
      </div>
    </div>
  );
}
function Question({ text }: { text: string }) {
  return (
    <div className="flex gap-2">
      <MessageSquare className="mt-1 size-4 shrink-0 text-primary" />
      <h2 className="text-sm font-medium leading-7">{text}</h2>
    </div>
  );
}
