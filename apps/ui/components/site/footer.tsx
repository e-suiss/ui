"use client";

import { ArrowUpIcon, ArrowUpRightIcon } from "@phosphor-icons/react";
import { cn } from "cn";
import { usePathname } from "next/navigation";
import * as React from "react";

import { Anchor } from "@/components/site/anchor";
import { ThemeToggle } from "@/components/ui/theme";
import { repository, sections } from "@/lib/sections";
import { strings } from "@/lib/strings";

const frame = "mx-auto w-full max-w-[1680px] px-5 md:px-10";
const ease = "ease-[cubic-bezier(0.32,0.08,0.24,1)]";

const paths = [
  { label: "Install", href: "/docs/installation" },
  { label: "Browse components", href: "/docs/components" },
  { label: "Read the CLI", href: "/docs/cli" },
];

type Column = { title: string; links: { label: string; href: string }[] };

const columns: Column[] = [
  {
    title: "Get started",
    links: [
      { label: "Introduction", href: "/docs" },
      { label: "Installation", href: "/docs/installation" },
      { label: "Theming", href: "/docs/theming" },
      { label: "CLI", href: "/docs/cli" },
    ],
  },
  {
    title: "Library",
    links: sections
      .filter((section) => section.path !== "/docs")
      .map((section) => ({ label: section.label, href: section.path })),
  },
  {
    title: "Source",
    links: [
      { label: "e-suiss/ui", href: repository },
      { label: "e-suiss/docs", href: "https://github.com/e-suiss/docs" },
      { label: "@esuiss/ui on npm", href: "https://www.npmjs.com/package/@esuiss/ui" },
    ],
  },
];

function FitWord({ children, className }: { children: string; className?: string }) {
  const box = React.useRef<HTMLDivElement>(null);
  const word = React.useRef<HTMLSpanElement>(null);

  React.useLayoutEffect(() => {
    const container = box.current;
    const text = word.current;
    if (!container || !text) return;
    const fit = () => {
      text.style.fontSize = "100px";
      text.style.fontSize = `${(100 * container.clientWidth) / text.scrollWidth}px`;
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(container);
    document.fonts?.ready.then(fit);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={box} className="w-full">
      <span ref={word} className={cn("block w-max whitespace-nowrap", className)}>
        {children}
      </span>
    </div>
  );
}

function Directory() {
  return (
    <div className={cn(frame, "grid grid-cols-2 gap-x-6 gap-y-10 border-t border-label/15 py-14 md:grid-cols-3")}>
      {columns.map((column) => (
        <nav key={column.title} aria-label={column.title} className="flex flex-col gap-4">
          <p className="font-mono text-xs tracking-[0.02em] text-label-secondary uppercase">{column.title}</p>
          <ul className="flex flex-col gap-2.5">
            {column.links.map((link) => (
              <li key={link.href + link.label}>
                <Anchor
                  href={link.href}
                  className="text-[17px] tracking-[-0.02em] text-label/80 transition-colors hover:text-label"
                >
                  {link.label}
                </Anchor>
              </li>
            ))}
          </ul>
        </nav>
      ))}
    </div>

  );
}

function BottomBar() {
  return (
    <div className={cn(frame, "flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-label/15 py-6 text-sm text-label-secondary")}>
      <span>{strings.copyright}</span>
      <span>{strings.license}</span>
      <div className="ms-auto flex items-center gap-3">
        <ThemeToggle effect="rectangle" origin="bottom-up" size="icon-sm" className="size-8" />
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="group flex h-8 items-center gap-2 rounded-full bg-label/10 ps-3.5 pe-1 text-label outline-none transition-colors hover:bg-label/15 focus-visible:focus-ring"
        >
          Back to top
          <span className="flex size-6 items-center justify-center rounded-full bg-label text-surface">
            <ArrowUpIcon weight="bold" className={cn("size-3 transition-transform duration-500 group-hover:-translate-y-0.5", ease)} />
          </span>
        </button>
      </div>
    </div>
  );
}

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/preview")) return null;
  if (pathname !== "/") {
    return (
      <footer className="bg-surface text-label">
        <BottomBar />
      </footer>
    );
  }

  return (
    <footer className="dark overflow-hidden bg-surface text-label">
      <div className={cn(frame, "grid gap-12 pt-24 pb-16 md:grid-cols-[1fr_minmax(0,34rem)] md:pt-32")}>
        <div className="flex flex-col gap-6">
          <p className="font-mono text-xs tracking-[0.02em] text-label-secondary uppercase">(04) Start</p>
          <h2 className="text-[clamp(3.5rem,8vw,8rem)] leading-[0.84] font-semibold tracking-[-0.065em]">
            Start
            <br />
            building.
          </h2>
        </div>
        <ul className="flex flex-col justify-end">
          {paths.map((path) => (
            <li key={path.href} className="border-t border-label/15 last:border-b">
              <Anchor
                href={path.href}
                className="group flex items-center justify-between gap-6 py-4 outline-none focus-visible:focus-ring md:py-5"
              >
                <span
                  className={cn(
                    "text-[clamp(1.5rem,2.4vw,2.25rem)] leading-none font-semibold tracking-[-0.045em] transition-transform duration-700 group-hover:translate-x-3",
                    ease,
                  )}
                >
                  {path.label}
                </span>
                <span
                  className={cn(
                    "flex size-12 shrink-0 items-center justify-center rounded-full bg-label/10 transition-[rotate,background-color,color] duration-700 group-hover:rotate-45 group-hover:bg-label group-hover:text-surface",
                    ease,
                  )}
                >
                  <ArrowUpRightIcon className="size-4.5" />
                </span>
              </Anchor>
            </li>
          ))}
        </ul>
      </div>

      <Directory />
      <BottomBar />

    
      <div aria-hidden className={cn(frame, "mb-[-4.5vw] select-none")}>
        <FitWord className="pe-[0.075em] leading-[0.8] font-semibold tracking-[-0.075em]">suiss/ui</FitWord>
      </div>
    </footer>
  );
}
