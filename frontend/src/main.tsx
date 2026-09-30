import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { routes } from "./router/routes";
import { mockData } from "./mocks/seedData";
import { StatusBadge } from "./components/common/StatusBadge";
import { StatCard } from "./components/common/StatCard";
import { SchedulingPage } from "./pages/SchedulingPage";
import { useSessionStore, ROLE_PRESETS } from "./stores/SessionStore";
import { RoleText, Role } from "./constants/Role";
import "./styles.css";

function Page({ name }: { name: string }) {
  const entities = Object.entries(mockData);
  const total = useMemo(() => entities.reduce((sum, [, rows]) => sum + rows.length, 0), [entities]);
  return <main className="page">
    <section className="page-head">
      <div>
        <p className="eyebrow">relic-restore</p>
        <h1>{name}</h1>
      </div>
      <StatusBadge value="LOCAL_DATA" />
    </section>
    <section className="metrics">
      <StatCard label="核心模型" value={entities.length} />
      <StatCard label="本地记录" value={total} />
      <StatCard label="共享枚举" value={8} />
    </section>
    <section className="workbench">
      <div className="panel wide">
        <h2>业务数据</h2>
        <div className="table">
          {entities.map(([key, rows]) => <article key={key} className="row">
            <strong>{key}</strong><span>{rows.length} 条</span><StatusBadge value={Object.values(rows[0] ?? {})[1] as string ?? "READY"} />
          </article>)}
        </div>
      </div>
      <div className="panel">
        <h2>联动检查</h2>
        <p>工位、排程、申请、步骤状态与 RBAC 角色按提示词拆分；占位先到先得，失败保留申请可重试，状态变更触发未开始排程失效。</p>
      </div>
    </section>
  </main>;
}

function RoleSwitcher() {
  const { session, setRole } = useSessionStore();
  return (
    <div className="role-switcher">
      <label>当前角色</label>
      <select value={session.role} onChange={(e) => setRole(e.target.value, ROLE_PRESETS[e.target.value]?.userName ?? "")}>
        {Role.map((r) => (
          <option key={r} value={r}>{RoleText[r]}</option>
        ))}
      </select>
      <span className="muted">{session.userName} · #{session.userId}</span>
    </div>
  );
}

function App() {
  const [active, setActive] = useState<string>(routes[0]?.route ?? "/dashboard");
  const current = routes.find((route) => route.route === active) ?? routes[0];
  return <div className="shell">
    <aside>
      <div className="brand">文物修复档案协作平台</div>
      <RoleSwitcher />
      <nav>{routes.map((route) => <button key={route.route} className={active === route.route ? "active" : ""} onClick={() => setActive(route.route)}>{route.name}</button>)}</nav>
    </aside>
    {active === "/scheduling" ? <SchedulingPage /> : <Page name={current?.name ?? "工作台"} />}
  </div>;
}

createRoot(document.getElementById("root")!).render(<App />);
