"use client";

import { ArrowUpRightIcon } from "@phosphor-icons/react";
import { cn } from "cn";
import * as React from "react";

const RESET_AFTER = 1500;
const ease = "ease-[cubic-bezier(0.32,0.08,0.24,1)]";
const item =
  "group flex cursor-pointer items-center gap-1 rounded-sm font-mono text-[11px] tracking-[0.02em] text-label-secondary uppercase outline-none transition-colors duration-300 hover:text-label focus-visible:focus-ring";

function External({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={item}>
      {label}
      <ArrowUpRightIcon
        weight="bold"
        className={cn("size-2.5 transition-transform duration-500 group-hover:rotate-45", ease)}
      />
    </button>
  );
}

export function PageActions({ markdownUrl }: { markdownUrl: string }) {
  const [copied, setCopied] = React.useState(false);
  const cache = React.useRef<string | undefined>(undefined);

  React.useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), RESET_AFTER);
    return () => clearTimeout(timeout);
  }, [copied]);

  const copy = async () => {
    const text: string = cache.current ?? (await fetch(markdownUrl).then((response) => response.text()));
    cache.current = text;
    await navigator.clipboard.writeText(text);
    setCopied(true);
  };

  const prompt = () =>
    encodeURIComponent(`Read ${window.location.origin}${markdownUrl}, I want to ask questions about it.`);
  const open = (url: string) => window.open(url, "_blank", "noopener,noreferrer");

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <button type="button" onClick={copy} className={cn(item, copied && "text-label")}>
        {copied ? "Copied" : "Copy page"}
      </button>
      <External label="Markdown" onClick={() => open(markdownUrl)} />
      <External label="ChatGPT" onClick={() => open(`https://chatgpt.com/?hints=search&q=${prompt()}`)} />
      <External label="Claude" onClick={() => open(`https://claude.ai/new?q=${prompt()}`)} />
    </div>
  );
}
