"use client";

import { ArrowUpRightIcon, SidebarIcon } from "@phosphor-icons/react";
import { cn } from "cn";
import { usePathname } from "next/navigation";

import { Anchor } from "@/components/site/anchor";
import { Logo } from "@/components/site/logo";
import { Search } from "@/components/site/search";
import { useSidebar } from "@/components/ui/sidebar";
import { repository, sections } from "@/lib/sections";
import { strings } from "@/lib/strings";

const ease = "ease-[cubic-bezier(0.32,0.08,0.24,1)]";

export function useActiveSection() {
  const pathname = usePathname();
  const owns = (path: string) => pathname === path || pathname.startsWith(`${path}/`);
  return (path: string) =>
    path === "/docs"
      ? owns(path) && !sections.some((section) => section.path !== "/docs" && owns(section.path))
      : owns(path);
}

export function LocalNav() {
  const { toggleSidebar } = useSidebar();
  const isActive = useActiveSection();

  return (
    <header className="sticky top-0 z-40 border-b border-label/10 bg-surface/85 backdrop-blur-xl backdrop-saturate-180">
      <nav
        aria-label={strings.documentation}
        className="mx-auto flex h-16 w-full max-w-[1680px] items-stretch gap-8 px-5 md:px-10"
      >
        <button
          type="button"
          aria-label={strings.menu}
          onClick={toggleSidebar}
          className="-ms-1.5 -me-5 flex size-9 items-center justify-center self-center rounded-full outline-none hover:bg-label/6 focus-visible:focus-ring md:hidden"
        >
          <SidebarIcon className="size-4.5" />
        </button>
        <Anchor href="/" className="flex items-center self-center rounded-sm outline-none focus-visible:focus-ring">
          <Logo />
        </Anchor>
        <ul className="hidden min-w-0 items-stretch gap-6 md:flex">
          {sections.map((section) => {
            const active = isActive(section.path);
            return (
              <li key={section.path} className="flex">
                <Anchor
                  href={section.path}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative flex items-center text-sm font-medium whitespace-nowrap tracking-[-0.01em] outline-none transition-colors duration-300 focus-visible:focus-ring",
                    active
                      ? "text-label after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:rounded-full after:bg-label"
                      : "text-label/55 hover:text-label",
                  )}
                >
                  {section.label}
                </Anchor>
              </li>
            );
          })}
        </ul>
        <div className="ms-auto flex shrink-0 items-center gap-2">
          <Search className="size-10 rounded-full bg-label/5 text-label transition-colors duration-300 hover:bg-label/10" />
          <Anchor
            href={repository}
            className="hidden h-10 items-center rounded-full px-4 text-sm font-medium tracking-[-0.01em] outline-none transition-colors hover:bg-label/5 focus-visible:focus-ring lg:flex"
          >
            {strings.github}
          </Anchor>
          <Anchor
            href="/docs/installation"
            className="group hidden h-10 items-center gap-2 rounded-full bg-label ps-4.5 pe-1 text-sm font-medium text-surface outline-none focus-visible:focus-ring [--focus-ring-offset:3px] sm:flex"
          >
            {strings.getStarted}
            <span
              className={cn(
                "flex size-8 items-center justify-center rounded-full bg-surface text-label transition-transform duration-500 group-hover:rotate-45",
                ease,
              )}
            >
              <ArrowUpRightIcon weight="bold" className="size-3.5" />
            </span>
          </Anchor>
        </div>
      </nav>
    </header>
  );
}
