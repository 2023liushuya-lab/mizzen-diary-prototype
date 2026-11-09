# Mizzen 日记法：真实前端视觉基准

2026-11-09 用户明确纠正：技术栈一致不等于设计语言一致，本次必须对齐 Mizzen 现网与当前前端。

## 真源

- 现网 `https://mizzen.top/workspace`，打开「新建项目」只读观察，没有提交创建、没有调用 AI。
- `Workspace/mizzen-insight/frontend-website/src/app/globals.css`
- `src/app/layout.tsx`：Mona_Sans，实际页面字体已检查。
- `src/app/workspace/components/WorkspaceSidebar.tsx`：256px 侧栏、64px 顶部、灰色选中导航。
- `src/app/workspace/components/CreateProjectPanel.tsx`、`TemplatesSection.tsx`、`templates-data.ts`：白底、896px 内容宽、24px 标题、圆角输入区、模板标签白色选中、彩色模板图标。
- `src/app/interview/[slug]/(wizard)/create/components/InterviewNavBar.tsx`、`InterviewTabs.tsx`：48px 顶栏、深色当前步骤、灰色其他步骤、箭头分隔，不使用导航胶囊。
- `src/app/interview/[slug]/(wizard)/conversations/components/ConversationsContent.tsx`：居中三张紧凑统计卡；记录页顶部下划线标签。
- 飞书 PRD v4 中的阶段示意图只用于功能结构与新增内容，不把示意图自己的蓝色再次混入真实产品。

## 样式基准

- 字体 Mona Sans，本地提供现网同款字体；中文采用系统字体回退。
- 页面与内容主表面白色，分区 gray-50 / gray-100。
- 正文 gray-900 `#111827`，次要 gray-600 / gray-500，占位 gray-400。
- 边框 gray-200 `#E5E7EB`，输入可用 gray-300。
- 研究主色为前端 `--wizard-brand-primary: 79 70 229`，hover `67 56 202`，light `238 242 255`。
- 通用表单 36px 高、6px 圆角；紧凑行控件 28–32px。模板卡采用原生 rounded-xl + border + shadow-sm。
- 新增日记法配置集中于一张轻量配置卡，不拆多日大纲。
- 分析页是数据/对话标签，四个分析入口为输入框上方的快捷胶囊；不保留上一版自创的常驻受访者侧栏。

## 对照证据

仓库 `docs/reference/` 包含原型截图；现网截图和生产源码仅作为本地对照依据，未随仓库迁移。布局与新增内容仍是交互原型，不声明逐像素一致或生产可用。

原先套用独立 `mizzen-design.md` 蓝色、Inter Tight 和另一个 Logo 的版本已被用户否定。本文件替换本原型内原来的规范副本，工作区原文件保持不动。

## 本轮用户明确调整

首页模板区删除；常规研究、日记法、导入大纲三个入口统一 32px 高度并齐平；模式选择改为有描述和选中态的弹出菜单。六项日记法配置保持。右侧预览采用原前端 InterviewPreviewPanel 的研究背景、研究目标、编号流程和按顺序排布的问题。招募采用 RecruitmentTypeSelector + ActiveRecruitsTable 的独立页面骨架。用户要求优先，记录页不再展示三张指标卡。记录页按用户最新要求简化为每人一行，前置累计回复次数，第 1～4 次横向排列并显示每次小结，点击查看原回复；不再行内展开，不显示用户画像和内容标签。其余字段对照线上记录页。


## 最新修正：每次访谈包含多题

一次参与是完整访谈，不是一条回答。记录页使用两层分组表头：每人一行，前置累计次数；第 1～4 次横向分组，每组含本次整体总结及 Q1、Q2、Q3 各题回答列。对照真实前端 CleanedConversationTable 的总结列与动态题目列实现，保持现有视觉。各组可独立收起为总结，默认展开；未提问与暂无回答分别显示。次数缺口不重排。点击题目回答在本次详情中优先显示该题，并保留本次总结和其他回答。导出包括本次总结与逐题回答。历史记录使用演示大纲快照，不随当前编辑的大纲改写；新增回答文本均为模拟材料。此约定覆盖上文单次只有小结的描述。
