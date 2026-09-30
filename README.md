# 文物修复档案协作平台

面向博物馆修复团队的文物病害记录、修复方案、影像版本和审批归档平台。

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

## 修复室工位排程

方案、步骤与工位通过排程申请（`schedule_request`）串联，角色与规则：

- 调度员（`x-role: SCHEDULER`）把**已批准方案**下的待开始步骤排进有容量和时间窗的工位：`POST /api/schedule-request`。
- 修复师（`RESTORER`）只能看到并执行分给自己的步骤：`POST /api/restoration-step/:id/start|complete`；排程本身不会把步骤提前置为进行中。
- 专家（`EXPERT`）继续负责审批：`POST /api/restoration-plan/:id/approve`。
- 同一时段并发抢占按**先到先得**：先到申请 `CONFIRMED`，后到申请保留为 `PENDING` 并返回 409 `SCHEDULE_SLOT_OCCUPIED` 与占用说明（占用人/时段/容量）。
- 文物状态变更（`PATCH /api/relic-item/:id/condition`）或已批准方案内容变更（`PATCH /api/restoration-plan/:id`）后，关联方案下**未开始**的排程批量置为 `INVALIDATED` 并清空步骤占位，前端提示重新排程；进行中/已完成步骤不受影响。
- 占位写入失败（503 `SCHEDULE_WRITE_FAILED`）时原排程和待处理申请都保留，可用 `POST /api/schedule-request/:id/retry` 重试；`INVALIDATED` 申请不可重试，必须重新提交。

## 枚举/常量出现位置清单

- RelicCondition: constants/RelicCondition、types/RelicCondition、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- PlanApprovalStatus: constants/PlanApprovalStatus、types/PlanApprovalStatus、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- DamageSeverity: constants/DamageSeverity、types/DamageSeverity、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- StepStatus: constants/StepStatus、models/RestorationStep、constructors、stores、SchedulePage、状态徽章与步骤开始/完成接口共同引用。
- ScheduleRequestStatus: constants/ScheduleRequestStatus、models/ScheduleRequest、constructors、stores、ScheduleRequestCard 与排程重试/失效逻辑共同引用。
- UserRole: constants/UserRole、authMiddleware/rbacMiddleware、前端 SessionStore 与角色切换器共同引用。

## 为什么会牵一发动全身

实体字段、枚举、日志模板、错误消息、构造器、筛选器和展示组件被刻意拆散到多个目录；修改一个状态值通常需要同步类型、构造器、服务、控制器、store、页面、README 与数据库种子。

## License

MIT
