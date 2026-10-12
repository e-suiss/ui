"use client";

import { cn } from "cn";
import * as React from "react";

export function Tabs({ items, children }: { items: string[]; children: React.ReactNode }) {
  const [active, setActive] = React.useState(0);
  const panels = React.Children.toArray(children);

  return (
    <div className="mt-[1.2em]">
      <div role="tablist" data-not-prose className="flex gap-5 overflow-x-auto border-b border-label/12">
        {items.map((item, index) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={active === index}
            onClick={() => setActive(index)}
            className={cn(
              "relative h-9 shrink-0 cursor-pointer text-sm font-medium tracking-[-0.01em] outline-none transition-colors focus-visible:focus-ring",
              active === index
                ? "text-label after:absolute after:inset-x-0 after:-bottom-px after:h-[1.5px] after:rounded-full after:bg-label"
                : "text-label/45 hover:text-label",
            )}
          >
            {item}
          </button>
        ))}
      </div>
      {panels.map((panel, index) => (
        <div key={items[index] ?? index} hidden={active !== index}>
          {panel}
        </div>
      ))}
    </div>
  );
}
