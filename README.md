# AI4S 科研平台前端原型

本项目以 `project_20260916_213202.tar.gz` 中的 Next.js 原型为基础，按 `AI4S_Prototype_Docs_V1.0.zip` 和《AI4S科研平台功能清单V1.0_0914.xlsx》重构。功能名称取自功能清单前四个 Sheet；`src/data/capabilities.json` 是页面路由表的本地快照，`src/data/feature-details.json` 是功能清单中三级功能名称的本地快照。

## 本地运行

```bash
pnpm install --frozen-lockfile
pnpm dev
```

访问 `http://localhost:3000/workbench`。Windows 中文路径下开发服务器使用 webpack；生产构建使用 Next.js 默认构建器，并在 `next.config.ts` 中指定项目根目录。

```bash
pnpm run ts-check
pnpm run lint:build
pnpm build
```

## 原型结构

- 工作台：按定稿截图组织 Banner、五项指标、科研专区、AI 推荐、科研活动及科研概览。
- 全局导航：科研人员、课题负责人、科研管理人员和平台管理员的演示角色；一级折叠、二级入口。
- 业务页面：保留可复用的旧原型页面；缺失入口使用统一的科研对象列表、检索、筛选、详情和状态演示模板。
- 旧路由：通过重定向进入新版归属页面。
- 集成边界：AI中台与外部系统页面展示来源标识和演示数据；正式深链、SSO、接口和数据回流需接入真实系统。

演示数据位于 `src/mock/research.ts`。工作台已读推荐保存在浏览器本地；其余页面的状态操作只在当前页面会话中生效。
