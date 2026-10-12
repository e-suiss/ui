"use client";

import { PlusIcon } from "@phosphor-icons/react";
import { cn } from "cn";
import * as React from "react";

export interface PropRow {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description?: string;
}

function unionOf(type: string) {
  const members: string[] = [];
  let depth = 0;
  let current = "";
  for (const char of type) {
    if ("([{<".includes(char)) depth++;
    if (")]}>".includes(char)) depth--;
    if (char === "|" && depth === 0) {
      members.push(current.trim());
      current = "";
    } else current += char;
  }
  members.push(current.trim());
  return members.filter(Boolean);
}

function summaryOf(type: string) {
  const members = unionOf(type);
  if (members.length > 3) return `union (${members.length})`;
  if (type.length > 28) return /=>/.test(type) ? "function" : `${type.slice(0, 26)}…`;
  return type;
}

function Inline({ text }: { text: string }) {
  return text.split(/(`[^`]+`)/).map((chunk, index) =>
    chunk.startsWith("`") ? (
      <code key={index} className="rounded-md bg-label/[0.06] px-1.5 py-0.5 font-mono text-[0.85em] whitespace-nowrap">
        {chunk.slice(1, -1)}
      </code>
    ) : (
      <React.Fragment key={index}>{chunk}</React.Fragment>
    ),
  );
}

function Row({ prop }: { prop: PropRow }) {
  const [open, setOpen] = React.useState(false);
  const id = React.useId();
  const members = unionOf(prop.type);

  return (
    <div className="border-t border-label/10 first:border-t-0">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((value) => !value)}
        className="group grid w-full cursor-pointer grid-cols-[1.25rem_minmax(0,1fr)_minmax(0,1fr)] items-center gap-x-3 px-4 py-3 text-left outline-none transition-colors hover:bg-label/[0.03] focus-visible:bg-label/[0.04] sm:grid-cols-[1.25rem_minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,0.8fr)]"
      >
        <PlusIcon
          aria-hidden
          weight="bold"
          className={cn("size-3.5 text-label-tertiary transition-transform duration-300", open && "rotate-45 text-label")}
        />
        <span className="flex min-w-0 items-center gap-2 font-mono text-[13.5px] font-medium text-label">
          <span className="truncate">{prop.name}</span>
          {prop.required && <span className="text-[11px] text-red-500" aria-label="required">*</span>}
        </span>
        <span className="truncate font-mono text-[12.5px] text-accent">{summaryOf(prop.type)}</span>
        <span className="hidden truncate font-mono text-[12.5px] text-label-secondary sm:block">
          {prop.default ?? (prop.required ? "required" : "—")}
        </span>
      </button>
      <div
        id={id}
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden" inert={!open}>
          <dl className="ml-[2.75rem] mr-4 mb-4 grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-4 gap-y-2.5 border-l border-label/10 pl-4 text-[14px] leading-relaxed">
            {prop.description && (
              <>
                <dt className="pt-0.5 font-mono text-[11px] tracking-wider text-label-tertiary uppercase">About</dt>
                <dd className="text-label-secondary">
                  <Inline text={prop.description} />
                </dd>
              </>
            )}
            <dt className="pt-0.5 font-mono text-[11px] tracking-wider text-label-tertiary uppercase">Type</dt>
            <dd className="flex flex-wrap gap-1.5">
              {members.length > 1 ? (
                members.map((member) => (
                  <code key={member} className="rounded-md bg-accent/10 px-1.5 py-0.5 font-mono text-[12.5px] text-accent">
                    {member}
                  </code>
                ))
              ) : (
                <code className="font-mono text-[12.5px] break-all text-accent">{prop.type}</code>
              )}
            </dd>
            <dt className="pt-0.5 font-mono text-[11px] tracking-wider text-label-tertiary uppercase sm:hidden">Default</dt>
            <dd className="font-mono text-[12.5px] text-label-secondary sm:hidden">
              {prop.default ?? (prop.required ? "required" : "—")}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  );
}

export function PropsTable({ extends: bases = [], props = [] }: { extends?: string[]; props?: PropRow[] }) {
  return (
    <div data-not-prose data-slot="props-table" className="mt-5 overflow-hidden rounded-2xl ring-1 ring-label/10">
      {bases.length > 0 && (
        <div className={cn("flex flex-wrap items-center gap-2 px-4 py-2.5 text-[12.5px]", props.length && "border-b border-label/10 bg-label/[0.025]")}>
          <span className="font-mono text-[11px] tracking-wider text-label-tertiary uppercase">Extends</span>
          {bases.map((base) => (
            <code key={base} className="rounded-md bg-label/[0.06] px-1.5 py-0.5 font-mono text-label">
              {base}
            </code>
          ))}
        </div>
      )}
      {props.length > 0 && (
        <>
          <div className="grid grid-cols-[1.25rem_minmax(0,1fr)_minmax(0,1fr)] gap-x-3 border-b border-label/10 px-4 py-2 font-mono text-[11px] tracking-wider text-label-tertiary uppercase sm:grid-cols-[1.25rem_minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,0.8fr)]">
            <span />
            <span>Prop</span>
            <span>Type</span>
            <span className="hidden sm:block">Default</span>
          </div>
          {props.map((prop) => (
            <Row key={prop.name} prop={prop} />
          ))}
        </>
      )}
    </div>
  );
}
