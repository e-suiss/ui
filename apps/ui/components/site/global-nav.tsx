"use client";

import { ArrowUpRightIcon } from "@phosphor-icons/react";
import { cn } from "cn";
import { usePathname } from "next/navigation";
import * as React from "react";

import { Anchor } from "@/components/site/anchor";
import { useActiveSection } from "@/components/site/local-nav";
import { Logo } from "@/components/site/logo";
import { Search } from "@/components/site/search";
import { repository, sections } from "@/lib/sections";
import { strings } from "@/lib/strings";

const ease = "ease-[cubic-bezier(0.32,0.08,0.24,1)]";
const MENU_EXIT = 500;

function RollLink({
  href,
  active,
  children,
}: {
  href: string;
  active?: boolean;
  children: string;
}) {
  return (
    <Anchor
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex h-9 items-center overflow-hidden rounded-full px-4 text-sm leading-5 font-medium tracking-[-0.01em] text-label outline-none transition-colors duration-300 focus-visible:focus-ring",
        active ? "bg-label text-surface" : "hover:bg-label/8",
      )}
    >
      <span className="relative block overflow-hidden">
        <span className={cn("block transition-transform duration-500 group-hover:-translate-y-full", ease)}>
          {children}
        </span>
        <span
          aria-hidden
          className={cn(
            "absolute inset-0 block translate-y-full transition-transform duration-500 group-hover:translate-y-0",
            ease,
          )}
        >
          {children}
        </span>
      </span>
    </Anchor>
  );
}

export function GlobalNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [menuMounted, setMenuMounted] = React.useState(false);
  React.useEffect(() => {
    if (menuOpen) {
      setMenuMounted(true);
      return;
    }
    const timeout = setTimeout(() => setMenuMounted(false), MENU_EXIT);
    return () => clearTimeout(timeout);
  }, [menuOpen]);
  const home = pathname === "/";
  const isActive = useActiveSection();

  // biome-ignore lint/correctness/useExhaustiveDependencies: close the menu on navigation
  React.useEffect(() => setMenuOpen(false), [pathname]);

  React.useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  if (pathname.startsWith("/docs") || pathname.startsWith("/preview")) return null;

  return (
    <header
      style={home && !menuOpen ? ({ "--label": "oklch(0.2316 0.0038 286.09)" } as React.CSSProperties) : undefined}
className={cn("z-50 text-label", home ? "absolute inset-x-0 top-0" : "relative border-b border-label/10 bg-surface")}
    >
      <nav
        aria-label="Global"
        className="relative z-10 mx-auto flex h-16 w-full max-w-[1680px] items-center gap-6 px-5 md:px-10"
      >
        <Anchor
          href="/"
          className="flex h-10 items-center rounded-sm outline-none focus-visible:focus-ring"
        >
          <Logo />
        </Anchor>

        {home && (
          <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 rounded-full bg-white/35 p-1 backdrop-blur-2xl backdrop-saturate-150 lg:flex">
            {sections.map((section) => (
              <li key={section.path}>
                <RollLink href={section.path} active={isActive(section.path)}>
                  {section.label}
                </RollLink>
              </li>
            ))}
          </ul>
        )}

        <div className="ms-auto flex items-center gap-2">
          {!home && (
            <Search className="size-10 rounded-full bg-label/5 text-label transition-colors duration-300 hover:bg-label/10" />
          )}
          <Anchor
            href={repository}
            className={cn(
              "group hidden h-10 items-center gap-2 rounded-full bg-label ps-4.5 pe-1 text-sm font-medium text-surface outline-none focus-visible:focus-ring [--focus-ring-offset:3px] sm:flex",
              home && "bg-[#1d1d1f] text-white",
            )}
          >
            {strings.github}
            <span
              className={cn(
                "flex size-8 items-center justify-center rounded-full bg-surface text-label transition-transform duration-500 group-hover:rotate-45",
                ease,
                home && "bg-white text-[#1d1d1f]",
              )}
            >
              <ArrowUpRightIcon weight="bold" className="size-3.5" />
            </span>
          </Anchor>
          <button
            type="button"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
            className={cn(
              "h-10 rounded-full px-4.5 text-sm font-medium outline-none transition-colors duration-300 focus-visible:focus-ring lg:hidden",
              home && !menuOpen ? "bg-white/35 backdrop-blur-2xl backdrop-saturate-150" : "bg-label/5",
            )}
          >
            {menuOpen ? strings.close : strings.menu}
          </button>
        </div>
      </nav>

      {menuMounted && (
        <div
          data-state={menuOpen ? "open" : "closed"}
          className={cn(
            "fixed inset-0 flex flex-col overflow-y-auto bg-surface px-5 pt-24 pb-10 transition-opacity duration-500 md:px-10 lg:hidden",
            ease,
            menuOpen ? "opacity-100 starting:opacity-0" : "pointer-events-none opacity-0",
          )}
        >
          <ul className="flex flex-col">
            {sections.map((section, index) => (
              <li
                key={section.path}
                style={{ transitionDelay: `${(menuOpen ? index : sections.length - 1 - index) * 40}ms` }}
                className={cn(
                  "border-t border-label/15 transition-[opacity,translate] duration-500",
                  ease,
                  menuOpen
                    ? "translate-y-0 opacity-100 starting:translate-y-4 starting:opacity-0"
                    : "-translate-y-2 opacity-0",
                )}
              >
                <Anchor
                  href={section.path}
                  className="flex items-baseline gap-4 py-3 outline-none focus-visible:focus-ring"
                >
                  <span className="font-mono text-xs text-label-secondary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[clamp(2.75rem,12vw,5rem)] leading-[0.95] font-semibold tracking-tighter">
                    {section.label}
                  </span>
                </Anchor>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex gap-6 border-t border-label/15 pt-6 text-[15px] font-medium">
            <Anchor href="/docs/installation">{strings.getStarted}</Anchor>
            <Anchor href={repository}>{strings.github}</Anchor>
          </div>
        </div>
      )}
    </header>
  );
}
