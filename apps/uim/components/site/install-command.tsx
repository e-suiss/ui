"use client";

import { CheckIcon, CopyIcon } from "@phosphor-icons/react";
import * as React from "react";

const RESET_AFTER = 1500;

export function InstallCommand({ command }: { command: string }) {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), RESET_AFTER);
    return () => clearTimeout(timeout);
  }, [copied]);

  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(command);
        setCopied(true);
      }}
      className="group flex w-full items-center justify-between gap-6 border-y border-label/15 py-8 text-start outline-none focus-visible:focus-ring md:py-12"
    >
      <code className="min-w-0 font-mono text-[clamp(1.25rem,4.2vw,4rem)] leading-none tracking-[-0.04em] break-all">
        <span className="text-label-tertiary">$ </span>
        {command}
      </code>
      <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-label text-surface transition-transform duration-500 ease-[cubic-bezier(0.32,0.08,0.24,1)] group-hover:scale-110 md:size-20">
        {copied ? <CheckIcon className="size-6 md:size-7" /> : <CopyIcon className="size-6 md:size-7" />}
        <span className="sr-only">{copied ? "Copied" : "Copy"}</span>
      </span>
    </button>
  );
}
