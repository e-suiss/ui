"use client";

import { cn } from "cn";
import * as React from "react";

const FOLDED = 320;

export function SourceCode({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [long, setLong] = React.useState(true);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const content = ref.current;
    if (!content) return;
    const measure = () => {
      if (content.scrollHeight > 0) setLong(content.scrollHeight > FOLDED + 40);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(content);
    measure();
    return () => observer.disconnect();
  }, []);

  const folded = long && !open;

  return (
    <div data-not-prose className="relative mt-[1.2em] [&_figure]:mt-0">
      <div
        ref={ref}
        className={cn(
          long && "overflow-hidden rounded-[20px] transition-[max-height] duration-700 ease-[cubic-bezier(0.32,0.08,0.24,1)]",
          folded ? "max-h-80" : long && "max-h-[40rem] [&_pre]:max-h-[32rem] [&_pre]:overflow-y-auto [&_pre]:overscroll-contain",
        )}
      >
        {children}
      </div>
      {long && (
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 flex h-32 items-end justify-center rounded-b-[20px] bg-linear-to-t from-surface-secondary via-surface-secondary/85 to-transparent pb-5 transition-opacity duration-500",
            !folded && "pointer-events-none opacity-0",
          )}
        >
          <button
            type="button"
            tabIndex={folded ? undefined : -1}
            onClick={() => setOpen(true)}
            className="h-8 cursor-pointer rounded-full bg-label px-4 text-[13px] font-medium text-surface outline-none focus-visible:focus-ring"
          >
            Expand
          </button>
        </div>
      )}
    </div>
  );
}
