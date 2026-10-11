"use client";

import { cn } from "cn";
import * as React from "react";

import { ComponentPreview } from "@/components/site/component-preview";
import { ResponsivePreview, ResponsiveToolbar, useResponsivePreview } from "@/components/site/responsive-preview";
import { SourceCode } from "@/components/site/source-code";

type Kind = React.ComponentProps<typeof ComponentPreview>["kind"];

export function Example({
  kind,
  name,
  story,
  children,
}: {
  kind: Kind;
  name: string;
  story?: string;
  children: React.ReactNode;
}) {
  const [tab, setTab] = React.useState<"preview" | "code">("preview");
  const responsive = kind === "pattern" || kind === "interaction" || kind === "block";
  const preview = useResponsivePreview();
  const src = `/preview/${kind}/${name}${story ? `/${story}` : ""}`;

  return (
    <div data-not-prose className="mt-[1.2em]">
      <div role="tablist" className="flex gap-5 border-b border-label/12">
        {(["preview", "code"] as const).map((item) => (
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
        {responsive && <ResponsiveToolbar src={src} state={preview} onSelect={() => setTab("preview")} />}
      </div>
      <div hidden={tab !== "preview"}>
        {responsive ? (
          <ResponsivePreview src={src} height={kind === "block" ? 800 : 560} state={preview} />
        ) : (
          <ComponentPreview kind={kind} name={name} story={story} />
        )}
      </div>
      <div hidden={tab !== "code"}>
        <SourceCode>{children}</SourceCode>
      </div>
    </div>
  );
}
