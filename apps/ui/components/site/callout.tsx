"use client";

import { cn } from "cn";
import type * as React from "react";

import { strings } from "@/lib/strings";

type CalloutType = "note" | "tip" | "important" | "warning" | "deprecated";

const styles: Record<CalloutType, string> = {
  note: "border-separator bg-surface-secondary",
  tip: "border-teal/50 bg-teal/8",
  important: "border-yellow/60 bg-yellow/10",
  warning: "border-danger/50 bg-danger-surface",
  deprecated: "border-orange/50 bg-orange/8",
};

export function Callout({
  type = "note",
  title,
  children,
}: {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
}) {

  return (
    <aside
      data-slot="callout"
      data-type={type}
      className={cn("mt-[1.2em] rounded-[20px] border px-5 py-4 [&>p:first-of-type]:mt-1", styles[type])}
    >
      <p className="font-mono text-[11px] tracking-[0.02em] uppercase">{title ?? strings[type]}</p>
      {children}
    </aside>
  );
}
