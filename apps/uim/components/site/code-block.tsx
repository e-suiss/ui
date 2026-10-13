"use client";

import { CheckIcon, CopyIcon } from "@phosphor-icons/react";
import { cn } from "cn";
import * as React from "react";

import { CodeScroll } from "@/components/site/code-scroll";
import { isPackageCommand, PackageCommand } from "@/components/site/package-command";
import { strings } from "@/lib/strings";

const RESET_AFTER = 1500;

export type Source = { className: string; style?: React.CSSProperties; html: string; raw: string };

const sources = new Map<string, Promise<Source>>();

export function fetchSource(src: string) {
  let source = sources.get(src);
  if (!source) {
    source = fetch(src).then((response) => {
      if (!response.ok) throw new Error(response.statusText);
      return response.json() as Promise<Source>;
    });
    source.catch(() => sources.delete(src));
    sources.set(src, source);
  }
  return source;
}

function isTerminal(title: string | undefined, icon: unknown) {
  return title === "Terminal" || (typeof icon === "string" && icon.includes("m 4,4 a 1,1"));
}

function textOf(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (React.isValidElement<{ children?: React.ReactNode; className?: string }>(node)) {
    const text = textOf(node.props.children);
    return node.props.className === "line" ? `${text}\n` : text;
  }
  return "";
}

export function CodeBlock({
  title,
  className,
  children,
  raw,
  src,
  html,
  ...props
}: React.ComponentProps<"pre"> & { title?: string; icon?: unknown; raw?: string; src?: string; html?: string }) {
  const { icon, ...rest } = props;
  const terminal = isTerminal(title, icon);
  const command = terminal ? (raw ?? textOf(children)).trim() : "";
  const caption = terminal ? undefined : title;
  const ref = React.useRef<HTMLPreElement>(null);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), RESET_AFTER);
    return () => clearTimeout(timeout);
  }, [copied]);

  const copy = async () => {
    const text = src ? await fetchSource(src).then((source) => source.raw) : (ref.current?.textContent ?? "");
    await navigator.clipboard.writeText(text);
    setCopied(true);
  };

  if (terminal && isPackageCommand(command)) return <PackageCommand command={command} />;

  return (
    <figure
      data-slot="code-block"
      data-terminal={terminal ? "" : undefined}
      className="group/code relative mt-[0.8em] overflow-hidden rounded-[20px] bg-surface-secondary"
    >
      <div
        className={cn(
          "flex h-11 items-center gap-3 pe-1.5",
          caption
            ? "border-b border-label/10 ps-4"
            : "absolute end-0 top-0 z-10 bg-linear-to-r from-transparent to-surface-secondary to-40% ps-8",
        )}
      >
        {caption && (
          <figcaption className="truncate font-mono text-[11px] tracking-[0.02em] text-label-secondary uppercase">
            {caption}
          </figcaption>
        )}
        <button
          type="button"
          aria-label={copied ? strings.copied : strings.copy}
          onClick={copy}
          className="ms-auto flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-label-secondary outline-none transition-colors hover:bg-label/8 hover:text-label focus-visible:focus-ring"
        >
          {copied ? <CheckIcon className="size-3.5" /> : <CopyIcon className="size-3.5" />}
        </button>
      </div>
      <CodeScroll>
        <pre
          ref={ref}
          className={cn(
            "w-max min-w-full py-3.5 ps-4 font-mono text-[15px] leading-[1.667] tracking-[-0.027em]",
            caption ? "pe-4" : "pe-24",
            className,
          )}
          {...rest}
          {...(html === undefined ? { children } : { dangerouslySetInnerHTML: { __html: html } })}
        />
      </CodeScroll>
    </figure>
  );
}
