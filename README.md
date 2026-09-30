# 文物修复档案协作平台

面向博物馆修复团队的文物病害记录、修复方案、影像版本、审批归档与**修复室工位排程**平台。调度员把步骤排进有容量与时间窗的工位，修复师只执行分给自己的步骤，专家仍处理审批。

## 快速启动

```bash
cp .env.example .env && docker compose up -d
```

## 访问地址或 CLI 示例

前端：<http://localhost:20110>

后端健康检查：<http://localhost:21110/health>


## 本地开发方式

- 前端：`cd frontend && npm install && npm run dev`
- 后端：进入 `backend` 后按技术栈运行开发命令，接口统一挂在 `/api`。
- 前端 Vite 已配置 `/api` 代理到 `http://localhost:3000`，本地开发可直连后端。

## 工位排程（修复室有限工位排步骤）

把方案、步骤与工位接起来，核心约束：

- **有限工位**：每个工位有容量（并发步骤数）与每日时间窗（如 `09:00–18:00`），排程必须落在时间窗内且不超容量。
- **角色分工**：调度员（scheduler）排程/重试；修复师（technician）只执行分给自己（`operator_id` 匹配）的步骤；专家（expert）仍处理方案审批。
- **先到者占位**：两人同时抢占同一时段时，后端在工位锁内做「检查重叠 + 条件写入」，先进入临界区者占位成功，后到者收到占用说明（占用者、占位时间、占用时段）。
- **失效提示重排**：文物状态或方案内容一变，该文物/方案下所有「未开始」排程立即置为失效，步骤回退为待排程，并返回提示重排说明。
- **失败可重试**：占位写入失败时保留原排程不动，待处理申请保持 `PENDING` 并写入占用说明，允许重试（可改时段/工位）。
- **步骤状态不提前**：步骤进入进行中前必须存在有效排程且已到排程开始时间，否则分别返回 `STEP_NOT_SCHEDULED` / `STEP_NOT_STARTABLE`；状态不得跳级。

相关接口：

| 方法 | 路径 | 角色 | 说明 |
|---|---|---|---|
| GET | `/api/workstation` | 全部 | 工位列表 |
| POST | `/api/workstation` | scheduler | 新增工位 |
| GET | `/api/schedule/schedules` | 全部 | 排程列表 |
| POST | `/api/schedule/schedules` | scheduler | 占位排程（失败返回占用说明） |
| GET | `/api/schedule/applications` | 全部 | 待处理申请 |
| POST | `/api/schedule/applications/:id/retry` | scheduler | 重试申请 |
| POST | `/api/restoration-step/:id/start\|:complete` | technician | 执行分给自己的步骤 |
| PUT | `/api/relic-item/:id` | scheduler/technician/archivist | 文物状态变更 -> 未开始排程失效 |
| PUT | `/api/restoration-plan/:id` | scheduler | 方案内容变更 -> 未开始排程失效 |
| POST | `/api/restoration-plan/:id/approve\|:reject` | expert | 专家审批 |

角色通过请求头 `x-role` / `x-user-id` / `x-user-name` 传入，前端右上角可切换角色。


## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | React 18 + TypeScript + Vite + Ant Design + Zustand |
| 后端 | NestJS + TypeScript + Prisma |
| 数据库 | PostgreSQL 15 |
| 部署 | Docker Compose |

## 项目目录结构

```text
frontend/src/api, stores, types, constants, constructors, components/common, hooks, pages, router, utils, mocks
backend/src/routes, controllers, services, models, repositories, middlewares, constants, constructors, utils, types, config
```

## 环境变量说明

- `COMPOSE_PROJECT_NAME`: Compose 项目名，默认 `relic-restore`
- `FRONTEND_PORT`: 前端端口，默认 `20110`
- `BACKEND_PORT`: 后端端口，默认 `21110`
- `DB_PORT`: 数据库宿主机端口
- `DB_USER/DB_PASSWORD/DB_NAME`: 本地数据库凭据

## Docker 部署说明

- 根 Compose 文件不写 `version`，顶层 `name: relic-restore`。
- 容器名均使用 `${COMPOSE_PROJECT_NAME:-relic-restore}` 前缀。
- 数据库使用命名卷，避免绑定中文路径。
- 常见问题：端口占用时修改 `.env` 中端口后重启；需要重置数据时执行 `docker compose down -v`。

## 枚举/常量出现位置清单

- RelicCondition: constants/RelicCondition、types/RelicCondition、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- PlanApprovalStatus: constants/PlanApprovalStatus、types/PlanApprovalStatus、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- DamageSeverity: constants/DamageSeverity、types/DamageSeverity、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- StepStatus（PENDING/SCHEDULED/IN_PROGRESS/COMPLETED）: backend `constants/StepStatus`、`services/RestorationStepService`（状态守卫）、`services/ScheduleService`（占位/失效联动）、前端 `constants/StepStatus`、`stores/RestorationStepStore`、排程页步骤执行按钮均有引用。
- ScheduleStatus（SCHEDULED/INVALID/COMPLETED/CANCELLED）: backend `constants/ScheduleStatus`、`repositories/WorkstationScheduleRepository`（原子占位）、`services/ScheduleService`（失效）、前端 `constants/ScheduleStatus`、`stores/ScheduleStore`、排程页状态徽标均有引用。
- WorkstationStatus（ACTIVE/MAINTENANCE/CLOSED）: backend `constants/WorkstationStatus`、`services/WorkstationService`/`services/ScheduleService`（可用性校验）、前端 `constants/WorkstationStatus`、`components/common/WorkstationCard` 均有引用。
- ScheduleApplicationStatus（PENDING/CONFIRMED/FAILED）: backend `constants/ScheduleApplicationStatus`、`repositories/ScheduleApplicationRepository`、`services/ScheduleService`（申请/重试）、前端 `constants/ScheduleApplicationStatus`、`components/common/ApplicationRetryCard` 均有引用。
- Role（scheduler/technician/expert/archivist/guest）: backend `constants/Role`、`middlewares/authMiddleware`/`rbacMiddleware`、各路由角色守卫、前端 `constants/Role`、`stores/SessionStore`、排程页角色切换与按钮显隐均有引用。
- 排程错误码（SLOT_OCCUPIED/STEP_NOT_STARTABLE/STEP_NOT_ASSIGNED/OUTSIDE_TIME_WINDOW/WORKSTATION_CLOSED 等）: backend `constants/errorCodes`、`constants/errorMessages`、`services/ScheduleService`/`RestorationStepService`、`middlewares/errorHandlerMiddleware`（透传占用说明）、前端 `constants/errorCodes`/`errorMessages`、`api/client`、`stores/ScheduleStore` 均有引用。

## 为什么会牵一发动全身

实体字段、枚举、日志模板、错误消息、构造器、筛选器和展示组件被刻意拆散到多个目录；修改一个状态值通常需要同步类型、构造器、服务、控制器、store、页面、README 与数据库种子。

## License

MIT
