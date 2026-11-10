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
import { Input, Select, Textarea } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useDiaryStore } from "@/stores/diary-store";
import {
  useParticipantStore,
  entryDecision,
  displayTime,
  freshSession,
  canAnswer,
  type ParticipantScenario,
  type ParticipantTask,
} from "@/stores/participant-store";
type Screen = "home" | "study" | "interview" | "join" | "history";
export function ParticipantApp({ screen }: { screen: Screen }) {
  const router = useRouter();
  const state = useParticipantStore();
  const study = useDiaryStore((s) => s.study);
  const locale = useDiaryStore((s) => s.locale);
  const say = (zh: string, en: string) => (locale === "zh" ? zh : en);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let alive = true;
    Promise.resolve(useParticipantStore.persist.rehydrate()).then(() => {
      if (alive) setReady(true);
    });
    return () => {
      alive = false;
    };
  }, []);
  const config = state.override ?? study.config;
  const decision = entryDecision(config, state.tasks, state.now);
  const task =
    state.tasks.find((t) => t.day === state.selectedDay) ??
    freshSession(0, state.now);
  const reference = state.tasks.find(
    (t) =>
      t.status === "submitted" && t.day < task.day && t.answers.used === "yes",
  );
  const history = state.tasks
    .filter((t) => t.status === "submitted")
    .toReversed();
  const enter = () => {
    if (state.begin()) router.push("/participant/interview");
  };
  const view = (t: ParticipantTask) => {
    state.selectTask(t.day);
    router.push("/participant/interview");
  };
  const title = study.title;
  const ended = decision.reason === "ended" || decision.reason === "total";
  const entryTitle = {
    allowed: decision.completed
      ? say("可以开始新一次访谈", "Ready for another session")
      : say("可以开始访谈", "Ready to start"),
    resume: say("你有一次未完成的访谈", "You have an unfinished interview"),
    daily: say("今日参与次数已达上限", "Daily participation limit reached"),
    interval: say(
      "尚未满足最小参与间隔",
      "Please wait before your next session",
    ),
    total: say("已完成本研究的参与次数", "Study participation complete"),
    notstarted: say("研究尚未开始", "Study has not started"),
    ended: say("研究已结束", "Study has ended"),
    invalid: say("研究配置需要确认", "Study configuration needs review"),
  }[decision.reason];
  const entryHint =
    decision.reason === "resume"
      ? say(
          "继续上次进度，不会新增一次记录。",
          "Resume your saved progress without creating a new session.",
        )
      : decision.reason === "allowed"
        ? config.daily.kind === "limited"
          ? say(
              `今日已完成 ${decision.today} 次，还可参与 ${Math.max(0, config.daily.count - decision.today)} 次。`,
              `Completed ${decision.today} today; ${Math.max(0, config.daily.count - decision.today)} more allowed.`,
            )
          : say(
              `今日已完成 ${decision.today} 次，单日次数不限。`,
              `Completed ${decision.today} today; no daily limit.`,
            )
        : decision.nextAt
          ? say(
              `下次可参与时间：${displayTime(decision.nextAt)}。`,
              `Next available: ${displayTime(decision.nextAt)}.`,
            )
          : decision.reason === "total" || decision.reason === "ended"
            ? say(
                "可以回看已提交的参与记录，不能开始新的访谈。",
                "You can review submitted entries; new interviews are closed.",
              )
            : decision.reason === "invalid"
              ? say(
                  "请联系研究员确认起止时间。",
                  "Please contact the researcher to confirm study dates.",
                )
              : say(
                  "研究周期内已没有下一次可参与的时间。",
                  "No further eligible time remains within the study window.",
                );
  const primary =
    decision.reason === "resume"
      ? say("继续访谈", "Resume interview")
      : decision.completed
        ? say("开始新一次访谈", "Start another interview")
        : say("开始访谈", "Start interview");
  const limitSummary = say(
    `${config.daily.kind === "limited" ? `每天最多 ${config.daily.count} 次` : "单日次数不限"} · ${config.total.kind === "limited" ? `累计最多 ${config.total.count} 次` : "累计次数不限"}`,
    `${config.daily.kind === "limited" ? `Up to ${config.daily.count} per day` : "No daily limit"} · ${config.total.kind === "limited" ? `Up to ${config.total.count} total` : "No total limit"}`,
  );
  const entryCard = (
    <section
      className="rounded-xl border border-border p-4"
      data-testid="participant-study-card"
      data-decision={decision.reason}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-primary">
          {say("日记法研究", "Diary study")}
        </span>
        <span className="text-xs text-muted-foreground">
          {ended ? say("已结束", "Closed") : say("进行中", "Active")}
        </span>
      </div>
      <h2 className="mt-3 text-base font-semibold leading-7">{title}</h2>
      <p className="mt-2 text-xs leading-6 text-muted-foreground">
        {config.start} — {config.end}
        <br />
        {limitSummary}
      </p>
      <p className="mt-2 text-xs text-muted-foreground">
        {say(
          `累计完成 ${decision.completed} 次`,
          `${decision.completed} sessions completed`,
        )}
      </p>
      <div className="mt-4 border-t border-border pt-4" aria-live="polite">
        <h3 className="text-sm font-medium">{entryTitle}</h3>
        <p className="mt-2 text-xs leading-6 text-muted-foreground">
          {entryHint}
        </p>
        <Button
          className="mt-4 w-full"
          disabled={!decision.allowed}
          onClick={enter}
        >
          {decision.allowed
            ? primary
            : decision.reason === "interval"
              ? say("等待下一次开放", "Waiting")
              : decision.reason === "notstarted"
                ? say("尚未开放", "Not open yet")
                : say("暂不可参与", "Unavailable")}
          <ArrowRight />
        </Button>
      </div>
      <Link
        href="/participant/history"
        className="mt-4 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground hover:text-primary"
      >
        {say("参与记录", "Participation history")}
        <span className="flex items-center gap-1">
          {history.length}
          <ChevronRight className="size-4" />
        </span>
      </Link>
    </section>
  );
  const samples = [
    say(
      "分类入口不好找，这次花了更久。",
      "Finding the right category took longer this time.",
    ),
    say(
      "操作和前几次差不多，饭后拍照记账很顺畅。",
      "Receipt capture was smooth, like previous sessions.",
    ),
  ];
  const followup =
    task.answers.used === "no"
      ? say(
          "这次没有使用，主要是没有遇到需要它的情况，还是有其他原因？不记得也可以直接说明。",
          "What kept you from using it? It is fine if you do not remember.",
        )
      : !reference || !task.useHistory
        ? say(
            "刚才提到的经历中，哪个步骤最影响你的感受？可以说一个具体细节。",
            "Which step affected your experience most? A concrete detail would help.",
          )
        : task.answers.product !== reference.answers.product
          ? say(
              `这次评价的是${task.answers.product}，第 ${reference.day} 次记录对应${reference.answers.product}。它们在相同用途下有什么不同？`,
              `This entry concerns ${task.answers.product}, while session ${reference.day} concerned ${reference.answers.product}. How did they differ for the same purpose?`,
            )
          : task.answers.context !== reference.answers.context
            ? say(
                `第 ${reference.day} 次的使用情境是“${reference.answers.context}”，这次是“${task.answers.context}”。环境或用途的变化带来了什么影响？`,
                `Session ${reference.day} was in ${reference.answers.context}; this time it was ${task.answers.context}. How did the setting affect the experience?`,
              )
            : task.answers.score !== reference.answers.score
              ? say(
                  `第 ${reference.day} 次你给了 ${reference.answers.score} 分，这次是 ${task.answers.score} 分。有什么具体经历影响了评价？`,
                  `Session ${reference.day} was rated ${reference.answers.score}/5; this time ${task.answers.score}/5. What affected this rating?`,
                )
              : say(
                  "回想前次和这次的经历，哪些保持不变，哪些发生了变化？没有新变化也没关系。",
                  "What stayed the same or changed since the earlier entry? No change is also valid.",
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
                router.push(
                  v === "first" ? "/participant/join" : "/participant",
                );
              }}
            >
              {(
                [
                  ["first", "首次链接进入", "First entry"],
                  [
                    "configured",
                    "使用研究员当前配置",
                    "Researcher configuration",
                  ],
                  [
                    "multiple",
                    "一天多次 · 还可参与",
                    "Multiple sessions allowed",
                  ],
                  [
                    "return",
                    "有未完成访谈 · 继续",
                    "Resume unfinished interview",
                  ],
                  ["dailyLimit", "单日上限 · 明天再来", "Daily limit reached"],
                  ["interval", "最小间隔 · 等待", "Minimum interval"],
                  ["total", "累计次数已达上限", "Total limit reached"],
                  ["notstarted", "研究未开始", "Study not started"],
                  ["ended", "研究已结束", "Study ended"],
                  ["identity", "恢复参与身份", "Identity recovery"],
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
      <div
        className={cn(
          "mx-auto max-w-[440px] bg-card sm:my-7 sm:rounded-2xl sm:border sm:border-border",
          screen === "join" ? "sm:min-h-[400px]" : "sm:min-h-[700px]",
        )}
      >
        <header className="flex h-16 items-center justify-between border-b border-border px-5">
          <div className="flex items-center gap-2.5">
            {screen !== "home" && (
              <button
                aria-label={say("返回", "Back")}
                className="rounded-md p-1 text-muted-foreground hover:bg-surface"
                onClick={() => router.push("/participant")}
              >
                <ArrowLeft className="size-5" />
              </button>
            )}
            <Brand />
            <span className="text-base font-semibold">Mizzen</span>
          </div>
          {screen !== "join" && (
            <span className="text-xs text-muted-foreground">
              {say("我的研究", "My studies")}
            </span>
          )}
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
                "使用原参与账号恢复记录，不会另建一次参与身份。",
                "Use the account you joined with to restore your entries.",
              )}
            </p>
            <Button className="mt-6 w-full" onClick={() => state.restore()}>
              {say("恢复示例账号", "Restore demo account")}
            </Button>
          </section>
        ) : screen === "join" ? (
          <section className="px-6 pt-8 pb-6" data-testid="simple-invitation">
            <p className="text-xs font-medium text-primary">
              {say("日记法研究", "Diary study")}
            </p>
            <h1 className="mt-3 text-xl font-semibold leading-8">{title}</h1>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              {say(
                "聊聊你最近的使用体验。",
                "Tell us about your recent experience.",
              )}
            </p>
            <Button
              className="mt-7 w-full"
              onClick={() => {
                state.join();
                router.push("/participant/study");
              }}
            >
              {state.joined
                ? say("进入研究", "Open study")
                : say("开始参与", "Join study")}
            </Button>
            <details
              className="group mt-5 border-t border-border pt-4"
              data-testid="participation-details"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between text-xs text-muted-foreground [&::-webkit-details-marker]:hidden">
                {say("参与说明", "Participation details")}
                <ChevronRight className="size-3.5 transition-transform group-open:rotate-90" />
              </summary>
              <div className="mt-3 space-y-2 text-xs leading-6 text-muted-foreground">
                <p>
                  {config.start} — {config.end}
                </p>
                <p>{limitSummary}</p>
                <p>
                  {say(
                    "次数是参与上限，不要求每天答满；按北京时间自然日计算。",
                    "These are caps, not daily targets. Days follow Asia/Shanghai time.",
                  )}
                </p>
                <p>
                  {say(
                    "参与后可在 App“我的研究”中继续。",
                    "Continue later from My studies in the app.",
                  )}
                </p>
              </div>
            </details>
          </section>
        ) : !state.joined ? (
          <section className="px-6 py-12">
            <BookOpen className="mb-5 size-8 text-muted-foreground" />
            <h1 className="text-xl font-semibold">
              {say("欢迎回来", "Welcome back")}
            </h1>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              {say(
                "确认参与邀请后，研究会显示在这里。",
                "Your study appears after you accept the invitation.",
              )}
            </p>
            <Button
              className="mt-6 w-full"
              onClick={() => router.push("/participant/join")}
            >
              {say("查看研究邀请", "View invitation")}
            </Button>
          </section>
        ) : screen === "history" ? (
          <section className="p-5">
            <h1 className="text-xl font-semibold">
              {say("参与记录", "Participation history")}
            </h1>
            <p className="mt-2 text-xs text-muted-foreground">
              {say(
                "这里只展示已提交的访谈，不是待完成任务。",
                "Only submitted sessions appear here; this is not a task list.",
              )}
            </p>
            {history.length ? (
              <div className="mt-4 divide-y divide-border">
                {history.map((t) => (
                  <button
                    key={t.day}
                    className="flex w-full items-center justify-between gap-3 py-4 text-left"
                    data-testid="participation-record"
                    onClick={() => view(t)}
                  >
                    <span>
                      <span className="block text-sm font-medium">
                        {say(`第 ${t.day} 次访谈`, `Session ${t.day}`)}
                      </span>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {displayTime(t.submittedAt ?? t.startedAt)} ·{" "}
                        {say("已提交", "Submitted")}
                      </span>
                    </span>
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            ) : (
              <p className="py-10 text-sm text-muted-foreground">
                {say("暂时没有已提交记录。", "No submitted entries yet.")}
              </p>
            )}
          </section>
        ) : screen !== "interview" || task.day === 0 ? (
          <section className="space-y-5 p-5">
            <h1 className="text-xl font-semibold">
              {screen === "home"
                ? say("我的研究", "My studies")
                : say("参与研究", "Participate")}
            </h1>
            {entryCard}
            <p className="text-xs leading-6 text-muted-foreground">
              {say(
                "有未完成访谈时优先续答；提交后才计入每日与累计次数。次数未用完不算漏答。",
                "Unfinished interviews resume first. Completed submissions count toward daily and total caps; unused capacity is not a missed task.",
              )}
            </p>
          </section>
        ) : (
          <section className="p-5">
            <span className="text-xs text-primary">
              {displayTime(task.startedAt)} ·{" "}
              {say(`第 ${task.day} 次访谈`, `Session ${task.day}`)}
            </span>
            <h1 className="mt-2 text-lg font-semibold">
              {say("记录本次使用体验", "Record this experience")}
            </h1>
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
                  {say("返回研究", "Back to study")}
                </Button>
              </>
            ) : !canAnswer(task) || !decision.allowed ? (
              <div className="py-8">
                <Clock3 className="mb-4 size-7 text-muted-foreground" />
                <h2 className="font-semibold">{entryTitle}</h2>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {entryHint}
                </p>
                <p className="mt-3 text-xs text-muted-foreground">
                  {say(
                    "草稿保留，当前无法提交。",
                    "Your draft is kept; submission is unavailable.",
                  )}
                </p>
                <Button
                  className="mt-5 w-full"
                  variant="outline"
                  onClick={() => router.push("/participant/study")}
                >
                  {say("返回研究", "Back to study")}
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
                        "最近有使用这个产品吗？",
                        "Have you used the product since the previous entry?",
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
                    {Boolean(reference) &&
                      task.answers.used !== "no" &&
                      !task.useHistory && (
                        <div className="mt-4 rounded-lg border border-border p-3 text-xs leading-6 text-muted-foreground">
                          <p>
                            {say(
                              "可参考本研究前次已提交的体验记录，对照本次变化。是否结合前次记录继续聊？",
                              "An earlier submitted entry is available. Would you like to compare it with this experience?",
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
                    {Boolean(reference) &&
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
                              "来源：本研究前次已提交记录。以下为该次原始记录，演示数据。",
                              "Source: an earlier submitted session in this study. Simulated data.",
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
                      {displayTime(task.startedAt)} ·{" "}
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
                        "提交后本次记录不可修改。你仍可在后续访谈中补充或修正之前的说法。",
                        "This entry is read-only after submission; later sessions can clarify earlier statements.",
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
                  {say("稍后继续，返回研究", "Save and return to study")}
                </button>
              </>
            )}
          </section>
        )}
        {screen !== "join" && (
          <div className="px-5 py-5 text-center text-[10px] leading-5 text-placeholder">
            {say(
              "交互原型 · 示例账号 · 追问为规则演示",
              "Prototype · demo account · rule-based follow-ups",
            )}
          </div>
        )}
      </div>
      <div className="mx-auto max-w-[440px] px-5 pb-6 text-xs leading-6 text-muted-foreground">
        <p>
          {say("演示时间（北京时间）：", "Demo clock (Asia/Shanghai): ")}
          {displayTime(state.now)}
        </p>
        <div className="mt-2 flex flex-wrap gap-4">
          <button
            className="text-primary hover:underline"
            onClick={() => state.advanceClock(1)}
          >
            {say("推进 1 小时", "Advance 1 hour")}
          </button>
          <button
            className="text-primary hover:underline"
            onClick={() => state.advanceClock(24)}
          >
            {say("推进 1 天", "Advance 1 day")}
          </button>
        </div>
        <p className="mt-3">
          {state.override
            ? say(
                "当前使用场景演示规则，不修改研究员配置。",
                "Using scenario rules without changing researcher settings.",
              )
            : say(
                "当前使用研究员端的研究周期、每日次数、累计次数和最小间隔配置。",
                "Using researcher settings for dates, daily and total caps, and minimum interval.",
              )}
        </p>
        <p className="mt-2">
          {say(
            "仅本地模拟参与判断与草稿保存；未接入真实账号、App 唤起或服务端。",
            "Eligibility and drafts are simulated locally. Real accounts, app links and backend are not connected.",
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
