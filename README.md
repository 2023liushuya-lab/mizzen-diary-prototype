# Mizzen 日记法交互原型

可运行的 Next.js 日记法交互原型，供本地与云端 agent 继续迭代。先读 `AGENTS.md` 和 `HANDOFF.md`。

## 启动

```sh
pnpm install --frozen-lockfile
pnpm dev
```

访问 http://127.0.0.1:3119 。正式构建预览可运行 `pnpm build` 后再运行 `pnpm start`。

## 技术与设计

- 与 Mizzen 前端保持相同核心版本：Next.js 16.2.6、React 19.2.6、TypeScript 5、Tailwind CSS 4、Zustand 5.0.8。
- 复用 Mizzen 前端 Button/Input 的组件接口与实现模式，采用 Radix Dialog 处理焦点锁定、键盘关闭与可访问性。
- App Router 提供五个页面，状态由 Zustand selector 读取，研究配置、大纲、对话及偏好通过 persist 保存到本地。
- 视觉以当前现网与真实前端组件为准：Mona Sans、实际 Mizzen Demo Logo、白色表面、灰色导航、Indigo 操作色、48px 研究顶栏。详细真源与差异记录在 `DESIGN.md`，不混用旧独立规范的蓝色与 Inter Tight。
- 布局参考飞书中的现网截图：创建入口、双栏大纲与设置、记录单表（本轮已移除三张统计卡）、数据/对话标签分析页。
- 中英文界面文案在 `src/i18n/messages.ts` 管理，示例研究内容及原始回答保持中文。

## 评审入口

| 页面 | 地址 | 可体验交互 |
| --- | --- | --- |
| 创建 | `/` | 三个齐平入口、结构化填空、模式弹出菜单、导入大纲（无模板区） |
| 大纲与设置 | `/study/outline` | 六项日记法配置、题目编辑、参与次数条件、条件预览、保存 |
| 招募 | `/study/recruit` | 原生创建招募入口、链接招募列表、查看示例链接 |
| 记录 | `/study/records` | 每人一行、次数分组、每次整体总结和逐题回答、未答提醒、CSV 导出 |
| 洞察 | `/study/analysis` | 四个分析入口、示例结果、原话引用、自定义问题反馈 |

招募使用独立页面，布局对照现有 RecruitmentTypeSelector 与 ActiveRecruitsTable；发布仍仅模拟。窄屏时表格在容器内横向滚动，设置双栏变为单栏。

## 代码结构

```text
src/app/                  Next.js 页面、布局、设计 token
src/types/                研究、配置、记录、问题和消息类型
src/stores/               Zustand 状态、保存与发布等动作
src/hooks/                翻译、记录筛选
src/lib/                  规则、演示数据、导出与工具
src/components/ui/        统一基础组件
src/components/diary/     页面与业务组件
src/i18n/                 中英文文案
```

## 检查

```sh
pnpm typecheck
pnpm lint
pnpm build
```

已有浏览器检查覆盖次数条件、设置保存、回答定位、分组收起/展开、搜索筛选和 390px 窄屏。截图见 `docs/reference/`；检查记录不代表生产验收。

## 范围

需求来源：[日记法一期极简版 v4](https://mizzen-ai.feishu.cn/wiki/SL6mwLLTriJjDDkFdPLcbxyDntd)。全部受访者、问题、记录、统计和分析为演示数据。未连接后端、AI、App 推送、真实招募或发布服务。示例访谈链接不对应真实研究。Device ID 跨次身份关联稳定性与准入规则需真实系统验证。

同一研究的历史摘要和首次甄别免答只在评审中说明，不声明已实现服务能力；不做跨项目自动复用。

## 记录页结构

每位受访者一行。前面为用户、累计回复次数、开始时间、活跃时间、状态和质量评分；后面是第 1～4 次横向分组。每个分组下包含本次整体总结和各题回答列，而不是把一次访谈当作一条回答。分组默认展开，可收起只看总结。点击回答优先查看对应题目，并保留本次其他回答。

不显示用户画像与内容标签，不使用行内展开历史。累计按实际访谈记录数统计，不按题数或最大次数统计；P002 只有第 1、3 次记录，累计为 2 次，第 2 次保留空缺。按条件未提问、暂无回答和暂无记录分别处理。

## 云端启动

Node.js 22、pnpm 10.19.0。无需环境变量、密钥、数据库或其他 Mizzen 仓库。

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm exec next dev --hostname 0.0.0.0 --port 3000
```

将云端预览指向 3000 端口；`pnpm dev` 默认是本地 127.0.0.1:3119。
