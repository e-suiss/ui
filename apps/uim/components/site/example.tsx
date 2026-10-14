"use client";

import { cn } from "cn";
import * as React from "react";

import { SourceCode } from "@/components/site/source-code";

const KEY = "uim-platform";
const listeners = new Set<() => void>();
let current: string | null = null;

function readPlatform() {
  if (current === null) {
    try {
      current = window.localStorage.getItem(KEY) ?? "";
    } catch {
      current = "";
    }
  }
  return current;
}

function setPlatform(value: string) {
  current = value;
  try {
    window.localStorage.setItem(KEY, value);
  } catch {}
  for (const listener of listeners) listener();
}

function previewAlt(id: string, scheme: string) {
  const [component = "", story = ""] = id.split("--");
  const words = (value: string) => value.split("-").filter(Boolean);
  const name = words(component).slice(1).map((word) => word[0].toUpperCase() + word.slice(1)).join(" ");
  const variant = words(story).join(" ");
  return `${name}${variant && variant !== "default" ? ` (${variant})` : ""} on iOS in ${scheme} mode`;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function Example({
  id,
  width,
  height,
  platforms = [],
  video,
  children,
}: {
  id?: string;
  width?: number;
  height?: number;
  platforms?: string[];
  video?: boolean;
  children: React.ReactNode;
}) {
  const [tab, setTab] = React.useState<"preview" | "code">(id ? "preview" : "code");
  const stored = React.useSyncExternalStore(subscribe, readPlatform, () => "");
  const panels = React.Children.toArray(children).filter(React.isValidElement);
  const labels = platforms.length === panels.length ? platforms : [];
  const active = Math.max(0, labels.indexOf(stored));

  return (
    <div data-not-prose className="mt-[1.2em]">
      <div role="tablist" className="flex gap-4 border-b sm:gap-5 border-label/12">
        {(id ? (["preview", "code"] as const) : (["code"] as const)).map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={tab === item}
            onClick={() => setTab(item)}
            className={cn(
              "relative h-9 cursor-pointer text-sm font-medium capitalize tracking-[-0.01em] outline-none transition-colors focus-visible:focus-ring",
              tab === item
                ? "text-label after:absolute after:inset-x-0 after:-bottom-px after:h-[1.5px] after:rounded-full after:bg-label"
                : "text-label/45 hover:text-label",
            )}
          >
            {item}
          </button>
        ))}
        {tab === "code" && labels.length > 1 ? (
          <div className="ms-auto -me-2 flex min-w-0 items-center gap-0.5 self-center sm:me-0 sm:gap-1 overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {labels.map((label, index) => (
              <button
                key={label}
                type="button"
                aria-pressed={index === active}
                onClick={() => setPlatform(label)}
                className={cn(
                  "h-7 shrink-0 cursor-pointer rounded-full px-2 text-xs sm:px-3 font-medium tracking-[-0.01em] outline-none transition-colors focus-visible:focus-ring",
                  index === active ? "bg-label/8 text-label" : "text-label/45 hover:text-label",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        ) : (
          id && <span className="ms-auto self-center font-mono text-[11px] tracking-[0.02em] text-label-tertiary uppercase">iOS</span>
        )}
      </div>
      {id && (
        <div hidden={tab !== "preview"}>
          <div
            data-slot="preview"
            className="mt-[1.2em] flex justify-center overflow-hidden rounded-[24px] bg-surface-secondary px-6 py-10 ring-1 ring-label/10 md:py-14"
          >
            <div className="w-full max-w-[360px] overflow-hidden rounded-[28px] shadow-[0_24px_60px_-28px_rgb(0_0_0/0.35)] ring-1 ring-label/10">
              {(["light", "dark"] as const).map((scheme) =>
                video ? (
                  <video
                    key={scheme}
                    src={`/previews/${id}.${scheme}.mp4`}
                    poster={`/previews/${id}.${scheme}.webp`}
                    width={width}
                    height={height}
                    aria-label={previewAlt(id, scheme)}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className={cn("block h-auto w-full", scheme === "light" ? "dark:hidden" : "hidden dark:block")}
                  />
                ) : (
                  <img
                    key={scheme}
                    src={`/previews/${id}.${scheme}.webp`}
                    width={width}
                    height={height}
                    alt={previewAlt(id, scheme)}
                    loading="lazy"
                    decoding="async"
                    className={cn("block h-auto w-full", scheme === "light" ? "dark:hidden" : "hidden dark:block")}
                  />
                ),
              )}
            </div>
          </div>
        </div>
      )}
      <div hidden={tab !== "code"}>
        {labels.length > 1 ? (
          panels.map((panel, index) => (
            <div key={labels[index]} hidden={index !== active}>
              <SourceCode>{panel}</SourceCode>
            </div>
          ))
        ) : (
          <SourceCode>{children}</SourceCode>
        )}
      </div>
    </div>
  );
}
