"use client";

import { useEffect, useState } from "react";

const navItems = [
  ["overview", "Overview"],
  ["workflow", "The compiler loop"],
  ["quickstart", "Quickstart"],
  ["platforms", "Coding platforms"],
  ["contract", "Tool contract"],
  ["reference", "Runtime reference"],
  ["safety", "Safety boundaries"]
] as const;

export function DocsSidebar() {
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) setActiveSection(visible[0].target.id);
    }, { rootMargin: "-18% 0px -66% 0px", threshold: 0 });
    navItems.forEach(([id]) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <aside className="sidebar">
      <div className="sidebar-intro">
        <span className="eyebrow">Documentation</span>
        <p>Turn a task, approved context, and public guidance into one inspectable skill.</p>
      </div>
      <div className="sidebar-group">
        <span className="sidebar-label">On this page</span>
        {navItems.map(([id, label], index) => (
          <a className={`sidebar-link${activeSection === id ? " active" : ""}`} href={`#${id}`} key={id} aria-current={activeSection === id ? "location" : undefined}>
            <span>{String(index + 1).padStart(2, "0")}</span> {label}
          </a>
        ))}
      </div>
      <div className="sidebar-footer">
        <div className="status-line"><span className="status-dot" /> Developer preview</div>
        <p>No accounts. No persistence. No repository writes.</p>
      </div>
    </aside>
  );
}
