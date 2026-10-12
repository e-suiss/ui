"use client";

import { cn } from "cn";
import * as React from "react";

import { SourceCode } from "@/components/site/source-code";

export function Example({
  id,
  width,
  height,
  children,
}: {
  id?: string;
  width?: number;
  height?: number;
  children: React.ReactNode;
}) {
  const [tab, setTab] = React.useState<"preview" | "code">(id ? "preview" : "code");

  return (
    <div data-not-prose className="mt-[1.2em]">
      <div role="tablist" className="flex gap-5 border-b border-label/12">
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
        {id && <span className="ms-auto self-center font-mono text-[11px] tracking-[0.02em] text-label-tertiary uppercase">iOS</span>}
      </div>
      {id && (
        <div hidden={tab !== "preview"}>
          <div
            data-slot="preview"
            className="mt-[1.2em] flex justify-center overflow-hidden rounded-[24px] bg-surface-secondary px-6 py-10 ring-1 ring-label/10 md:py-14"
          >
            <div className="w-full max-w-[360px] overflow-hidden rounded-[28px] shadow-[0_24px_60px_-28px_rgb(0_0_0/0.35)] ring-1 ring-label/10">
              <img
                src={`/previews/${id}.light.webp`}
                width={width}
                height={height}
                alt=""
                loading="lazy"
                decoding="async"
                className="block h-auto w-full dark:hidden"
              />
              <img
                src={`/previews/${id}.dark.webp`}
                width={width}
                height={height}
                alt=""
                loading="lazy"
                decoding="async"
                className="hidden h-auto w-full dark:block"
              />
            </div>
          </div>
        </div>
      )}
      <div hidden={tab !== "code"}>
        <SourceCode>{children}</SourceCode>
      </div>
    </div>
  );
}
