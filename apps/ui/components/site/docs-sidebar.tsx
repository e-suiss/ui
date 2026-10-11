"use client";

import type * as PageTree from "fumadocs-core/page-tree";
import { cn } from "cn";
import { usePathname } from "next/navigation";
import type * as React from "react";

import { Anchor } from "@/components/site/anchor";
import { useActiveSection } from "@/components/site/local-nav";
import { sections } from "@/lib/sections";
import { strings } from "@/lib/strings";
import { Sidebar, SidebarContent, useSidebar } from "@/components/ui/sidebar";

type Group = { label?: string; nodes: PageTree.Node[] };

function groupNodes(nodes: PageTree.Node[]) {
  const groups: Group[] = [{ nodes: [] }];
  for (const node of nodes) {
    if (node.type === "separator") {
      groups.push({ label: String(node.name ?? ""), nodes: [] });
    } else {
      groups.at(-1)?.nodes.push(node);
    }
  }
  return groups.filter((group) => group.nodes.length > 0);
}

function urlsOf(nodes: PageTree.Node[]): string[] {
  return nodes.flatMap((node) => {
    if (node.type === "page") return [node.url];
    if (node.type === "folder") return [...(node.index ? [node.index.url] : []), ...urlsOf(node.children)];
    return [];
  });
}

function prefixOf(folder: PageTree.Folder) {
  const urls = urlsOf(folder.index ? [folder.index, ...folder.children] : folder.children);
  if (urls.length === 0) return undefined;
  if (urls.length === 1) return urls[0].slice(0, urls[0].lastIndexOf("/"));
  const parts = urls.map((url) => url.split("/"));
  const shared: string[] = [];
  for (let index = 0; parts.every((segments) => segments[index] === parts[0][index]); index++) {
    if (index >= parts[0].length) break;
    shared.push(parts[0][index]);
  }
  return shared.join("/");
}

function sectionOf(nodes: PageTree.Node[], pathname: string): { title: string; nodes: PageTree.Node[] } {
  const folders = nodes.filter((node): node is PageTree.Folder => node.type === "folder");
  const current = folders.find((folder) => {
    const prefix = prefixOf(folder);
    return prefix !== undefined && (pathname === prefix || pathname.startsWith(`${prefix}/`));
  });
  if (current) {
    const prefix = prefixOf(current);
    const children = current.children.map((child) =>
      child.type === "page" && child.url === prefix ? { ...child, name: "Overview" } : child,
    );
    return {
      title: String(current.name ?? ""),
      nodes: [...(current.index ? [{ ...current.index, name: "Overview" }] : []), ...children],
    };
  }
  return { title: "Docs", nodes: nodes.filter((node) => node.type !== "folder") };
}

function Row({ page, group }: { page: PageTree.Item; group?: string }) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const active = pathname === page.url;

  return (
    <li>
      <Anchor
        href={page.url}
        onClick={() => setOpenMobile(false)}
        aria-current={active ? "page" : undefined}
        className="group/row relative flex h-8 items-center rounded-md ps-5 pe-2 outline-none focus-visible:focus-ring"
      >
        <span
          aria-hidden
          className={cn(
            "absolute start-0 top-1/2 h-px -translate-y-1/2 bg-label transition-all duration-300 ease-out",
            active ? "w-3 h-[2px]" : "w-0 group-hover/row:w-1.5 bg-label/30",
          )}
        />
        <span
          className={cn(
            "truncate text-[15px] tracking-[-0.015em] transition-[color,transform] duration-300 ease-out",
            active ? "font-semibold text-label" : "text-label/60 group-hover/row:translate-x-1 group-hover/row:text-label",
          )}
        >
          {shortName(String(page.name), group)}
        </span>
      </Anchor>
    </li>
  );
}

function shortName(name: string, group?: string) {
  if (!group) return name;
  const rest = name.replace(new RegExp(`^${group}( Chart)? `, "i"), "");
  return rest === name ? name : rest.charAt(0).toUpperCase() + rest.slice(1);
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="ps-5 pe-2 pt-5 pb-1.5 font-mono text-[11px] tracking-[0.04em] text-label-tertiary uppercase">
      {children}
    </div>
  );
}

const pagesOf = (nodes: PageTree.Node[]) =>
  nodes.flatMap((node): PageTree.Item[] =>
    node.type === "page" ? [node] : node.type === "folder" ? [...(node.index ? [node.index] : []), ...pagesOf(node.children)] : [],
  );

function SectionSwitcher() {
  const { setOpenMobile } = useSidebar();
  const isActive = useActiveSection();
  return (
    <nav aria-label={strings.documentation} className="mb-6 flex flex-wrap gap-1.5 ps-5 pe-2 md:hidden">
      {sections.map((item) => (
        <Anchor
          key={item.path}
          href={item.path}
          onClick={() => setOpenMobile(false)}
          aria-current={isActive(item.path) ? "page" : undefined}
          className="flex h-8 items-center rounded-full bg-label/6 px-3.5 text-sm font-medium tracking-[-0.01em] text-label/70 outline-none aria-[current=page]:bg-label aria-[current=page]:text-surface focus-visible:focus-ring"
        >
          {item.label}
        </Anchor>
      ))}
    </nav>
  );
}

export function DocsSidebar({ nodes: all }: { nodes: PageTree.Node[] }) {
  const pathname = usePathname();
  const section = sectionOf(all, pathname);
  const groups = groupNodes(section.nodes);
  const pages = pagesOf(section.nodes).filter((page) => page.name !== "Overview");

  return (
    <Sidebar className="sticky top-16 h-[calc(100svh-(--spacing(16)))] border-e-0 [&>[data-slot=sidebar-inner]]:bg-surface">
      <SidebarContent className="px-3 py-8">
        <SectionSwitcher />
        <div className="flex items-baseline justify-between ps-5 pe-2 pb-3 font-mono text-[11px] tracking-[0.04em] text-label uppercase">
          <span>{section.title}</span>
          <span className="text-label-tertiary tabular-nums">{pages.length}</span>
        </div>
        <nav aria-label={section.title}>
          {groups.map((group, index) => (
            <div key={group.label ?? index}>
              {group.label && <Label>{group.label}</Label>}
              <ul>
                {pagesOf(group.nodes).map((page) => (
                  <Row key={page.url} page={page} group={group.label} />
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </SidebarContent>
    </Sidebar>
  );
}
