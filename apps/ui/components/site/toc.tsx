"use client";

import { cn } from "cn";
import type { TableOfContents, TOCItemType } from "fumadocs-core/toc";
import * as React from "react";

import { strings } from "@/lib/strings";

type Section = { item: TOCItemType; children: TOCItemType[] };

const ease = "ease-[cubic-bezier(0.32,0.08,0.24,1)]";
const pad = (value: number) => String(value).padStart(2, "0");
const idOf = (item: TOCItemType) => decodeURIComponent(item.url.slice(1));

function sectionsOf(items: TableOfContents) {
  const sections: Section[] = [];
  for (const item of items) {
    if (item.depth <= 2 || sections.length === 0) sections.push({ item, children: [] });
    else sections.at(-1)?.children.push(item);
  }
  return sections;
}

function useActiveHeading(ids: string[]) {
  const [active, setActive] = React.useState<string>();

  React.useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const line = window.innerHeight * 0.25;
        let current: string | undefined;
        for (const id of ids) {
          const heading = document.getElementById(id);
          if (heading && heading.getBoundingClientRect().top <= line) current = id;
        }
        const atEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
        setActive(atEnd ? ids.at(-1) : current);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [ids]);

  return active;
}

export function Toc({ items }: { items: TableOfContents }) {
  const headings = React.useMemo(() => items.filter((item) => item.depth <= 3), [items]);
  const sections = React.useMemo(() => sectionsOf(headings), [headings]);
  const ids = React.useMemo(() => headings.map(idOf), [headings]);
  const active = useActiveHeading(ids);

  if (sections.length === 0) return null;
  const current = sections.findIndex(
    (section) => idOf(section.item) === active || section.children.some((child) => idOf(child) === active),
  );

  return (
    <nav aria-label={strings.onThisPage} className="flex flex-col gap-5">
      <p className="font-mono text-[11px] tracking-[0.02em] text-label-tertiary uppercase">{strings.onThisPage}</p>
      <ol className="flex flex-col gap-1">
        {sections.map((section, index) => (
          <li key={section.item.url}>
            <a
              href={section.item.url}
              className={cn(
                "grid grid-cols-[2rem_1fr] items-baseline py-1.5 text-[14px] leading-[1.3] tracking-[-0.015em] transition-colors duration-300 hover:text-label",
                index === current ? "font-medium text-label" : "text-label/50",
              )}
            >
              <span className="font-mono text-[11px] font-normal tracking-[0.02em] text-label-tertiary">
                {pad(index + 1)}
              </span>
              <span>{section.item.title}</span>
            </a>
            {section.children.length > 0 && (
              <ul className="flex flex-col ps-8">
                {section.children.map((child) => (
                  <li key={child.url}>
                    <a
                      href={child.url}
                      data-active={idOf(child) === active ? "" : undefined}
                      className="group flex items-center gap-2.5 py-1 text-[13px] leading-[1.3] tracking-[-0.01em] text-label/50 transition-colors duration-300 hover:text-label data-active:text-label"
                    >
                      <span
                        className={cn(
                          "h-[1.5px] w-2.5 shrink-0 rounded-full bg-label/40 transition-[width,background-color] duration-500 group-hover:bg-label/70 group-data-active:w-4 group-data-active:bg-label",
                          ease,
                        )}
                      />
                      {child.title}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
