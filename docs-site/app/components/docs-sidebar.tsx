"use client";

import { useEffect, useState } from "react";

const navItems = [
  ["overview", "Start here"],
  ["how-it-works", "How it works"],
  ["station", "Agent setup"],
  ["provider-setup", "Model provider"],
  ["the-recipe", "Skill format"],
  ["contract", "Inputs & control"],
  ["safety", "Safety"]
] as const;

export function DocsSidebar() {
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    const visibleSections = new Map<Element, IntersectionObserverEntry>();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => visibleSections.set(entry.target, entry));
      const marker = window.innerHeight * 0.2;
      const visible = [...visibleSections.values()]
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => Math.abs(a.boundingClientRect.top - marker) - Math.abs(b.boundingClientRect.top - marker));
      if (visible[0]) setActiveSection(visible[0].target.id);
    }, { rootMargin: "-12% 0px -74% 0px", threshold: 0 });
    navItems.forEach(([id]) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <aside className="sidebar">
      <div className="sidebar-intro">
        <span className="eyebrow">SkillChef docs</span>
        <p>Turn a repeatable workflow and approved context into one inspectable agent skill.</p>
      </div>
      <nav className="sidebar-group" aria-label="In this guide">
        <span className="sidebar-label">In this guide</span>
        {navItems.map(([id, label]) => (
          <a className={`sidebar-link${activeSection === id ? " active" : ""}`} href={`#${id}`} key={id} aria-current={activeSection === id ? "location" : undefined}>
            {label}
          </a>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="status-line"><span className="status-dot" /> Local-first · single owner</div>
        <p>No accounts, repo-context persistence, or repository writes. Shared hosting is not multi-tenant BYOK.</p>
      </div>
    </aside>
  );
}
