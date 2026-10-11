"use client";

import { CheckIcon, CopyIcon } from "@phosphor-icons/react";
import { cn } from "cn";
import * as React from "react";

import { strings } from "@/lib/strings";

const managers = ["pnpm", "npm", "yarn", "bun"] as const;
type Manager = (typeof managers)[number];

const RESET_AFTER = 1500;
const STORAGE_KEY = "package-manager";
const CHANGE_EVENT = "package-manager-change";

const NPX = /^npx\s+/;
const NPM_INSTALL = /^npm\s+(?:install|i)(?=\s|$)/;

function convertLine(line: string, manager: Manager) {
  if (manager === "npm") return line;
  if (NPX.test(line)) {
    const rest = line.replace(NPX, "");
    return { pnpm: `pnpm dlx ${rest}`, yarn: `yarn dlx ${rest}`, bun: `bunx ${rest}` }[manager];
  }
  if (NPM_INSTALL.test(line)) {
    const rest = line.replace(NPM_INSTALL, "").replace(/\s--save-dev\b/, " -D");
    return { pnpm: `pnpm add${rest}`, yarn: `yarn add${rest}`, bun: `bun add${rest}` }[manager];
  }
  return line;
}

export function isPackageCommand(text: string) {
  return text.split("\n").some((line) => NPX.test(line.trim()) || NPM_INSTALL.test(line.trim()));
}

function useManager() {
  const [manager, setManager] = React.useState<Manager>("pnpm");

  React.useEffect(() => {
    const read = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (managers.includes(stored as Manager)) setManager(stored as Manager);
      } catch {}
    };
    read();
    window.addEventListener(CHANGE_EVENT, read);
    window.addEventListener("storage", read);
    return () => {
      window.removeEventListener(CHANGE_EVENT, read);
      window.removeEventListener("storage", read);
    };
  }, []);

  const choose = (next: Manager) => {
    setManager(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
    window.dispatchEvent(new Event(CHANGE_EVENT));
  };

  return [manager, choose] as const;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false);
  React.useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), RESET_AFTER);
    return () => clearTimeout(timeout);
  }, [copied]);

  return (
    <button
      type="button"
      aria-label={copied ? strings.copied : strings.copy}
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
      }}
      className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-label text-surface outline-none transition-transform duration-500 ease-[cubic-bezier(0.32,0.08,0.24,1)] hover:scale-105 focus-visible:focus-ring [--focus-ring-offset:3px]"
    >
      {copied ? <CheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
    </button>
  );
}

function Line({ line }: { line: string }) {
  const [tool, ...rest] = line.split(" ");
  return (
    <span className="block">
      <span className="text-label-tertiary select-none">$ </span>
      <span className="text-label">{tool}</span>
      {rest.length > 0 && <span className="text-label/70"> {rest.join(" ")}</span>}
    </span>
  );
}

export function PackageCommand({ command }: { command: string }) {
  const [manager, choose] = useManager();
  const lines = command
    .trim()
    .split("\n")
    .map((line) => convertLine(line.trim(), manager));

  return (
    <figure
      data-slot="code-block"
      className="mt-[1em] grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-3 border-y border-label/12 py-3 sm:grid-cols-[auto_1fr_auto]"
    >
      <div
        role="radiogroup"
        aria-label="Package manager"
        className="flex flex-wrap gap-x-4 gap-y-1 sm:w-20 sm:flex-col sm:gap-0"
      >
        {managers.map((item) => {
          const active = item === manager;
          return (
            <button
              key={item}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => choose(item)}
              className={cn(
                "flex cursor-pointer items-center gap-2 py-0.5 font-mono text-[11px] tracking-[0.02em] uppercase outline-none transition-colors duration-300 focus-visible:focus-ring",
                active ? "text-label" : "text-label-tertiary hover:text-label-secondary",
              )}
            >
              <span
                className={cn(
                  "h-[1.5px] shrink-0 rounded-full transition-[width,background-color] duration-500 ease-[cubic-bezier(0.32,0.08,0.24,1)]",
                  active ? "w-4 bg-label" : "w-2 bg-label/30",
                )}
              />
              {item}
            </button>
          );
        })}
      </div>
      <pre className="col-span-2 row-start-2 min-w-0 self-stretch overflow-x-auto font-mono text-[15px] leading-[1.6] tracking-[-0.03em] sm:col-span-1 sm:row-start-auto sm:border-s sm:border-label/10 sm:ps-6 sm:text-[16px]">
        <code className="flex h-full flex-col justify-center">
          {lines.map((line, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: lines have no identity
            <Line key={index} line={line} />
          ))}
        </code>
      </pre>
      <div className="col-start-2 row-start-1 sm:col-start-3">
        <CopyButton text={lines.join("\n")} />
      </div>
    </figure>
  );
}
