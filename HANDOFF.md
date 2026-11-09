# 云端 Agent 接力说明

## 当前状态

2026-11-09 的可运行交互原型，包含创建、大纲与设置、招募、记录、洞察五个页面。只迁移本原型，不含生产源码或后端。

最新用户要求是修正记录页：继续沿用 Mizzen 前端的记录表，一次访谈下面包含很多题目，并有该次访谈整体总结。已实现两层分组表头、每次总结与逐题回答、分组收起/展开、对应回答详情和 CSV 导出。用户尚未确认这次改动已达到预期，请继续根据后续反馈调整，不要将其视为已验收。

## 入口与关键代码

- /study/outline：大纲、六项设置；组件 src/components/diary/outline-page.tsx、native-outline.tsx。
- /study/records：最新重点；组件 src/components/diary/records-page.tsx。
- 回复详情：src/components/diary/modal-host.tsx。
- 演示题目、访谈、逐题回答：src/lib/fixtures.ts。
- 类型与规则：src/types/diary.ts、src/lib/diary-rules.ts。
- 本地状态：src/stores/diary-store.ts；localStorage 不随 GitHub 同步。
- 中英文：src/i18n/messages.ts；示例原话保持中文。
- 视觉来源和组件对照：DESIGN.md；截图 docs/reference/。

## 已确认的产品边界

累计次数是已回复访谈次数，不是题目数或最大参与次序。P002 第 1、3 次有记录，累计 2 次；第 2 次空缺。未提问、暂无回答、暂无访谈记录不能混同。Device ID 不能直接视为稳定身份。跨项目历史分析不能静默复用。

## 后续工作注意

用户另外要求寻找日记法分析 Skill，已查找未安装。现有建议是主题分析基础上增加个人变化、阶段对比、跨人共性和关键转折；这只是建议，没有获准更改分析页或接入 AI。不要据此扩大范围。

当前表格以标准 React table 模拟真实前端 CleanedConversationTable 的总结与题目列，没有迁入生产 AG Grid 与服务。布局不声明逐像素一致；历史题目目前为固定演示快照，不是完整问卷版本管理。所有新增逐题文本为演示数据。

## 运行与验证

详见 README.md。建议 Node 22、pnpm 10.19.0，云端监听 0.0.0.0:3000。无需任何密钥。pnpm check 包含类型检查、lint、生产构建；浏览器复核分组、回答定位、筛选导出及窄屏。

## 需求原文

https://mizzen-ai.feishu.cn/wiki/SL6mwLLTriJjDDkFdPLcbxyDntd

链接不保证云端可访问；本仓库文档已记录当前已知约定。没有复制私有飞书全文或生产仓库。
