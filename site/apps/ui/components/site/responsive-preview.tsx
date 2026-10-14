"use client";

import {
  ArrowClockwiseIcon,
  ArrowsOutSimpleIcon,
  DesktopIcon,
  DeviceMobileIcon,
  DeviceTabletIcon,
} from "@phosphor-icons/react";
import { cn } from "cn";
import * as React from "react";

const devices = [
  { size: 100, label: "Desktop", Icon: DesktopIcon },
  { size: 60, label: "Tablet", Icon: DeviceTabletIcon },
  { size: 30, label: "Mobile", Icon: DeviceMobileIcon },
] as const;

const MIN_SIZE = 30;

const dots =
  "bg-[radial-gradient(var(--color-label)_1px,transparent_1px)] bg-size-[20px_20px] opacity-[0.12]";

export function useResponsivePreview() {
  const [size, setSize] = React.useState(100);
  const [key, setKey] = React.useState(0);
  return { size, setSize, key, reload: () => setKey((value) => value + 1) };
}

type State = ReturnType<typeof useResponsivePreview>;

export function ResponsiveToolbar({ src, state, onSelect }: { src: string; state: State; onSelect: () => void }) {
  const button =
    "flex size-7 cursor-pointer items-center justify-center rounded-full text-label/60 outline-none transition-colors hover:text-label focus-visible:focus-ring";
  return (
    <div className="ms-auto hidden items-center gap-0.5 self-center rounded-full bg-label/5 p-0.5 lg:flex">
      {devices.map(({ size, label, Icon }) => (
        <button
          key={size}
          type="button"
          aria-label={label}
          aria-pressed={state.size === size}
          onClick={() => {
            state.setSize(size);
            onSelect();
          }}
          className={cn(button, state.size === size && "bg-label text-surface hover:text-surface")}
        >
          <Icon className="size-4" />
        </button>
      ))}
      <span aria-hidden className="mx-1 h-4 w-px bg-label/15" />
      <a href={src} target="_blank" rel="noreferrer" aria-label="Open in new tab" className={button}>
        <ArrowsOutSimpleIcon className="size-4" />
      </a>
      <button type="button" aria-label="Refresh preview" onClick={state.reload} className={button}>
        <ArrowClockwiseIcon className="size-4" />
      </button>
    </div>
  );
}

export function ResponsivePreview({ src, height, state }: { src: string; height: number; state: State }) {
  const stage = React.useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = React.useState(false);

  const startDrag = (event: React.PointerEvent<HTMLButtonElement>) => {
    const element = stage.current;
    if (!element) return;
    event.preventDefault();
    setDragging(true);
    const { left, width } = element.getBoundingClientRect();
    const move = (moveEvent: PointerEvent) => {
      const size = ((moveEvent.clientX - left) / width) * 100;
      state.setSize(Math.max(MIN_SIZE, Math.min(100, size)));
    };
    const end = () => {
      setDragging(false);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", end);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", end);
  };

  return (
    <div data-not-prose className="mt-[1.2em]">
      <div ref={stage} className="relative pe-3" style={{ height }}>
        <div aria-hidden className="absolute inset-y-0 start-0 end-3 overflow-hidden rounded-[24px] bg-label/[0.03]">
          <div className={cn("absolute inset-0", dots)} />
        </div>
        <div
          className={cn(
            "relative z-10 flex h-full max-lg:w-full!",
            !dragging && "transition-[width] duration-500 ease-[cubic-bezier(0.32,0.08,0.24,1)]",
          )}
          style={{ width: `calc(${state.size}% + 0.75rem)` }}
        >
          <div className="h-full min-w-0 flex-1 overflow-hidden rounded-[24px] bg-surface ring-1 ring-label/10">
            <iframe
              key={state.key}
              src={src}
              title="Preview"
              loading="lazy"
              className={cn("size-full border-0 bg-surface", dragging && "pointer-events-none")}
            />
          </div>
          <button
            type="button"
            aria-label="Resize preview"
            onPointerDown={startDrag}
            onDoubleClick={() => state.setSize(100)}
            className="group/handle relative hidden w-3 shrink-0 cursor-ew-resize outline-none focus-visible:focus-ring lg:block"
          >
            <span className="absolute top-1/2 right-0 h-8 w-1.5 -translate-y-1/2 rounded-full bg-label/20 transition-all group-hover/handle:h-10 group-hover/handle:bg-label/35" />
          </button>
        </div>
      </div>
    </div>
  );
}
