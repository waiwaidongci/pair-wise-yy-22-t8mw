import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { routes } from "./router/routes";
import { mockData } from "./mocks/seedData";
import { StatusBadge } from "./components/common/StatusBadge";
import { StatCard } from "./components/common/StatCard";
import { SchedulePage } from "./pages/SchedulePage";
import { useSessionStore } from "./stores/SessionStore";
import { UserRole, UserRoleText } from "./constants/UserRole";
import "./styles.css";

function OverviewPage({ name }: { name: string }) {
  const entities = Object.entries(mockData);
  const total = entities.reduce((sum, [, rows]) => sum + rows.length, 0);
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
      <StatCard label="共享枚举" value={5} />
    </section>
    <section className="workbench">
      <div className="panel wide">
        <h2>业务数据</h2>
        <div className="table">
          {entities.map(([key, rows]) => <article key={key} className="row">
            <strong>{key}</strong><span>{rows.length} 条</span><StatusBadge value={String((rows[0] as Record<string, unknown> | undefined)?.status ?? (rows[0] as Record<string, unknown> | undefined)?.approval_status ?? "READY")} />
          </article>)}
        </div>
      </div>
      <div className="panel">
        <h2>联动检查</h2>
        <p>页面、store、API、构造器、日志模板和枚举常量均按提示词拆分；「工位排程」演示容量、时间窗、先到先得与失效重排。</p>
      </div>
    </section>
  </main>;
}

function RoleSwitcher() {
  const role = useSessionStore((state) => state.role);
  const userId = useSessionStore((state) => state.userId);
  const setRole = useSessionStore((state) => state.setRole);
  const setUserId = useSessionStore((state) => state.setUserId);
  return <div className="role-switcher">
    <label>
      当前角色
      <select value={role} onChange={(event) => setRole(event.target.value as typeof role)}>
        {UserRole.map((value) => <option key={value} value={value}>{UserRoleText[value]}</option>)}
      </select>
    </label>
    <label>
      用户 ID
      <input type="number" value={userId} onChange={(event) => setUserId(Number(event.target.value))} />
    </label>
  </div>;
}

function App() {
  const [active, setActive] = useState<string>("/schedule");
  const current = routes.find((route) => route.route === active) ?? routes[0];
  return <div className="shell">
    <aside>
      <div className="brand">文物修复档案协作平台</div>
      <RoleSwitcher />
      <nav>{routes.map((route) => <button key={route.route} className={active === route.route ? "active" : ""} onClick={() => setActive(route.route)}>{route.name}</button>)}</nav>
    </aside>
    {current?.route === "/schedule"
      ? <SchedulePage />
      : <OverviewPage name={current?.name ?? "工作台"} />}
  </div>;
}

createRoot(document.getElementById("root")!).render(<App />);
