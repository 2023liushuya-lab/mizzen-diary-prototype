import type { DiaryRecord, Study } from "@/types/diary";
export const initialStudy: Study = {
  title: "AI 记账 App 连续使用研究",
  brief: {
    audience: "记账 App 新用户",
    days: 14,
    frequency: "daily",
    goal: "使用习惯与痛点的变化",
    mode: "standard",
  },
  config: {
    start: "2026-11-09",
    end: "2026-11-22",
    allowLate: false,
    daily: { kind: "limited", count: 1 },
    total: { kind: "limited", count: 14 },
    minInterval: 0,
    push: true,
    reminderHours: 24,
  },
  questions: [
    {
      id: "Q1",
      title: "第一次使用前，你通常如何记账？",
      prompt: "请回想过去一周，你一般在什么时候、用什么方式记账？",
      rule: { kind: "equals", count: 1 },
    },
    {
      id: "Q2",
      title: "聊聊你最近一次使用这个 App 的经历。",
      prompt: "当时在哪里？想完成什么？过程中有没有特别顺畅或不顺畅的地方？",
      rule: { kind: "always" },
    },
    {
      id: "Q3",
      title: "相比刚开始使用，现在有什么变化？",
      prompt:
        "有哪些操作更熟悉了？还有什么问题一直没有解决？请结合具体经历说一说。",
      rule: { kind: "atLeast", count: 3 },
    },
  ],
  published: false,
  publishedConfig: null,
  savedAt: null,
  dirty: false,
};
export const records: DiaryRecord[] = [
  {
    id: "R001",
    answers: [
      {
        questionId: "Q1",
        text: "之前用手机备忘录记账，周末再补到表格里，忙的时候容易忘。",
      },
      {
        questionId: "Q2",
        text: "午饭后在餐厅拍小票，连续拍了三次，还是有两个金额需要手动修改。",
      },
    ],
    summary: "小票识别不准，仍需手动修正金额。",
    participantId: "P001",
    name: "林女士",
    order: 1,
    tags: ["小票拍照", "识别卡点"],
    startedAt: "2026-11-09 09:32",
    duration: 504,
    quality: "high",
    quote: "拍了三次小票，还是有两个金额需要自己改。",
  },
  {
    id: "R002",
    answers: [
      {
        questionId: "Q1",
        text: "一直在微信里给自己发消费金额，月底才汇总，常常漏掉小额支出。",
      },
      {
        questionId: "Q2",
        text: "在地铁上想记一笔车费，但分类入口不好找，找分类花了不少时间。",
      },
    ],
    summary: "通勤时想快速记账，但分类入口难找。",
    participantId: "P002",
    name: "陈先生",
    order: 1,
    tags: ["手动记账", "通勤场景"],
    startedAt: "2026-11-09 10:18",
    duration: 472,
    quality: "high",
    quote: "地铁上想顺手记一下，找分类花了不少时间。",
  },
  {
    id: "R003",
    answers: [
      {
        questionId: "Q2",
        text: "早餐后拍了小票，学会先裁掉边缘，这次识别比第一次顺利，金额没有再改。",
      },
    ],
    summary: "学会裁切小票边缘后，识别更顺畅。",
    participantId: "P001",
    name: "林女士",
    order: 2,
    tags: ["小票拍照", "操作熟悉"],
    startedAt: "2026-11-10 09:45",
    duration: 398,
    quality: "high",
    quote: "今天知道怎么裁掉边缘了，识别比第一次顺利。",
  },
  {
    id: "R004",
    answers: [
      {
        questionId: "Q1",
        text: "以前直接看支付账单，没有每天记录的习惯，月底会大概看一下花费。",
      },
      {
        questionId: "Q2",
        text: "中午在办公室尝试语音记账，周围有同事不方便说话，最后改为手动输入。",
      },
    ],
    summary: "办公室不方便使用语音，改为手动输入。",
    participantId: "P003",
    name: "王女士",
    order: 1,
    tags: ["语音识别卡点"],
    startedAt: "2026-11-10 12:06",
    duration: 552,
    quality: "medium",
    quote: "办公室里不方便说话，最后还是手动输入的。",
  },
  {
    id: "R005",
    answers: [
      {
        questionId: "Q2",
        text: "午饭后顺手拍下小票，检查金额后直接保存，基本不用再想操作步骤。",
      },
      {
        questionId: "Q3",
        text: "从一开始反复拍照和修改金额，到现在知道怎么裁切，饭后会主动记一笔。",
      },
    ],
    summary: "已习惯饭后拍小票，操作步骤更熟悉。",
    participantId: "P001",
    name: "林女士",
    order: 3,
    tags: ["已养成习惯", "小票拍照"],
    startedAt: "2026-11-11 09:21",
    duration: 341,
    quality: "high",
    quote: "现在吃完饭就会拍一下，基本不用再想步骤。",
  },
  {
    id: "R006",
    answers: [
      {
        questionId: "Q2",
        text: "下班通勤时记了交通费，录入比之前快，但在交通和出行两个分类之间犹豫。",
      },
      {
        questionId: "Q3",
        text: "入口和录入操作熟悉了，分类含义仍分不清，希望能说明两类的区别。",
      },
    ],
    summary: "录入速度变快，但分类选择仍有困惑。",
    participantId: "P002",
    name: "陈先生",
    order: 3,
    tags: ["通勤场景", "分类卡点"],
    startedAt: "2026-11-11 18:35",
    duration: 486,
    quality: "high",
    quote: "录入速度快了，但交通和出行两个分类还是会纠结。",
  },
  {
    id: "R007",
    answers: [
      {
        questionId: "Q2",
        text: "把 App 放到桌面快捷入口，晚上看到图标就会打开，记下当天的一笔支出。",
      },
    ],
    summary: "增加桌面快捷入口后，形成晚间记账习惯。",
    participantId: "P004",
    name: "赵先生",
    order: 2,
    tags: ["已养成习惯"],
    startedAt: "2026-11-11 20:08",
    duration: 412,
    quality: "high",
    quote: "设成桌面快捷入口之后，晚上就会打开记一笔。",
  },
  {
    id: "R008",
    answers: [
      {
        questionId: "Q2",
        text: "回家后用语音记录了购物花费，在安静环境里操作方便，外出时还是手动记。",
      },
      {
        questionId: "Q3",
        text: "现在会按场景选择语音或手动输入，但在办公室和公共场合仍然不愿意说话。",
      },
    ],
    summary: "在家使用语音更方便，外出时仍受场景限制。",
    participantId: "P003",
    name: "王女士",
    order: 3,
    tags: ["语音识别卡点", "场景限制"],
    startedAt: "2026-11-12 12:30",
    duration: 478,
    quality: "high",
    quote: "回到家语音挺方便，但在外面还是不会用。",
  },
];
export const participants = [...new Set(records.map((r) => r.participantId))];
export const enrolledCount = 5;

// Enrolled participants are separate from responses, including people yet to answer.
export const participantRoster = [
  { id: "P001", name: "林女士" },
  { id: "P002", name: "陈先生" },
  { id: "P003", name: "王女士" },
  { id: "P004", name: "赵先生" },
  { id: "P005", name: "周女士" },
] satisfies import("@/types/diary").DiaryParticipant[];
