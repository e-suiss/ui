"use client";

import { cn } from "cn";
import * as React from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { components, stories } from "@/demos/registry";

type Kind = "ui" | "pattern" | "interaction" | "chart" | "block";
type Args = Record<string, unknown>;
type Layout = "centered" | "padded" | "fullscreen";
type Context = { args: Args; parameters: Record<string, unknown>; globals: Record<string, unknown> };
type Decorator = (Story: React.ComponentType, context: Context) => React.ReactNode;
type Story = {
  name?: string;
  args?: Args;
  render?: (args: Args, context: Context) => React.ReactNode;
  decorators?: Decorator[];
  parameters?: { layout?: Layout };
};
type Meta = {
  component?: React.ComponentType<Args>;
  args?: Args;
  decorators?: Decorator[];
  parameters?: { layout?: Layout };
};

const overlays = new Set([
  "action-menu",
  "alert-dialog",
  "alert-sheet",
  "combobox",
  "command-palette",
  "confirm",
  "context-menu",
  "dialog",
  "drawer",
  "dropdown-menu",
  "flyout",
  "fullscreen-menu",
  "hover-card",
  "menubar",
  "modal",
  "popover",
  "preview",
  "select",
  "sheet",
  "tooltip",
]);

function closedKey(story: Story) {
  const { defaultOpen: _defaultOpen, open: _open, ...rest } = story.args ?? {};
  return { render: story.render, args: JSON.stringify(rest) };
}

function withoutClosedDuplicates(entries: (readonly [string, Story])[]) {
  const seen: ReturnType<typeof closedKey>[] = [];
  return entries.filter(([, story]) => {
    const key = closedKey(story);
    if (seen.some((other) => other.render === key.render && other.args === key.args)) return false;
    seen.push(key);
    return true;
  });
}

function labelOf(key: string, story: Story, closed: boolean) {
  const name = story.name ?? key.replace(/([a-z0-9])([A-Z])/g, "$1 $2").toLowerCase();
  const label = closed ? name.replace(/^open\s+/i, "") : name;
  return label.charAt(0).toUpperCase() + label.slice(1);
}

class Boundary extends React.Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) {
      return (
        <p className="font-mono text-[11px] tracking-[0.02em] text-label-tertiary uppercase">Preview unavailable</p>
      );
    }
    return this.props.children;
  }
}

function StoryView({ meta, story, closed }: { meta: Meta; story: Story; closed?: boolean }) {
  const args: Args = { ...meta.args, ...story.args };
  if (closed) {
    args.defaultOpen = false;
    delete args.open;
  }
  const context: Context = {
    args,
    parameters: { ...meta.parameters, ...story.parameters },
    globals: {},
  };

  let Rendered: React.ComponentType = function Base() {
    if (story.render) return <>{story.render(args, context)}</>;
    const Component = meta.component;
    return Component ? <Component {...args} /> : null;
  };
  for (const decorate of [...(story.decorators ?? []), ...(meta.decorators ?? [])]) {
    const Inner: React.ComponentType = Rendered;
    Rendered = function Decorated(): React.ReactNode {
      return <>{decorate(Inner, context)}</>;
    };
  }
  return <Rendered />;
}

function useFitOverflow(ref: React.RefObject<HTMLDivElement | null>) {
  React.useEffect(() => {
    const frame = ref.current;
    if (!frame) return;
    let queued = 0;
    const fit = () => {
      queued = 0;
      frame.style.minHeight = "";
      const overflow = frame.scrollHeight - frame.clientHeight;
      if (overflow > 1) frame.style.minHeight = `${frame.offsetHeight + overflow}px`;
    };
    const schedule = () => {
      if (!queued) queued = requestAnimationFrame(fit);
    };
    const events = ["pointerup", "transitionend", "animationend", "click", "keyup"] as const;
    for (const type of events) frame.addEventListener(type, schedule);
    schedule();
    return () => {
      cancelAnimationFrame(queued);
      for (const type of events) frame.removeEventListener(type, schedule);
    };
  }, [ref]);
}

function useNearViewport<T extends Element>() {
  const ref = React.useRef<T>(null);
  const [near, setNear] = React.useState(false);
  React.useEffect(() => {
    const element = ref.current;
    if (!element || near) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setNear(true);
      },
      { rootMargin: "800px 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [near]);
  return [ref, near] as const;
}

function Frame({
  wide,
  layout = "centered",
  label,
  children,
}: {
  wide?: boolean;
  layout?: Layout;
  label?: string;
  children: React.ReactNode;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  useFitOverflow(ref);
  return (
    <div data-not-prose className="mt-[1.2em] flex flex-col gap-3">
      {label && <p className="font-mono text-[11px] tracking-[0.02em] text-label-tertiary uppercase">{label}</p>}
      <div
        ref={ref}
        data-slot="preview"
        className={cn(
          "overflow-hidden rounded-[24px]",
          "bg-surface ring-1 ring-label/10",
          !wide && layout === "centered" && "flex min-h-56 flex-wrap items-center justify-center gap-3 p-10",
          !wide && layout === "padded" && "min-h-56 p-6",
        )}
      >
        <Boundary>{children}</Boundary>
      </div>
    </div>
  );
}

function Loading({ wide }: { wide?: boolean }) {
  return <div data-not-prose className={cn("mt-[1.2em] animate-pulse rounded-[24px] bg-surface-secondary", wide ? "h-96" : "h-56")} />;
}

function ComponentPreviewOf({ name, wide }: { name: string; wide: boolean }) {
  const [Component, setComponent] = React.useState<React.ComponentType>();
  React.useEffect(() => {
    components[name]?.().then((loaded) => setComponent(() => loaded));
  }, [name]);
  if (!Component) return <Loading wide={wide} />;
  return (
    <Frame wide={wide}>
      {wide ? (
        <Component />
      ) : (
        <div className="w-full max-w-xl">
          <Component />
        </div>
      )}
    </Frame>
  );
}

function StoryPreviewOf({ name, story: only }: { name: string; story?: string }) {
  const [module, setModule] = React.useState<Record<string, unknown>>();
  React.useEffect(() => {
    stories[name]?.().then(setModule);
  }, [name]);
  if (!module) return <Loading />;

  const meta = (module.default ?? {}) as Meta;
  const closed = overlays.has(name);
  const all = Object.entries(module)
    .filter(([key, value]) => key !== "default" && value && typeof value === "object")
    .map(([key, value]) => [key, value as Story] as const);
  const deduped = closed ? withoutClosedDuplicates(all) : all;
  const entries = only ? all.filter(([key]) => key === only) : deduped;

  return (
    <>
      {entries.map(([key, story], index) => (
        <Frame
          key={key}
          label={index === 0 || only ? undefined : labelOf(key, story, closed)}
          layout={story.parameters?.layout ?? meta.parameters?.layout}
        >
          <StoryView meta={meta} story={story} closed={closed} />
        </Frame>
      ))}
    </>
  );
}

export function ComponentPreview({ kind, name, story }: { kind: Kind; name: string; story?: string }) {
  const [ref, near] = useNearViewport<HTMLDivElement>();
  const wide = kind === "block";
  if (!near) {
    return (
      <div ref={ref}>
        <Loading wide={wide} />
      </div>
    );
  }
  if (kind === "chart" || kind === "block") return <ComponentPreviewOf name={name} wide={wide} />;
  return <StoryPreviewOf name={name} story={story} />;
}

export function PreviewCanvas({ kind, name, story: only }: { kind: Kind; name: string; story?: string }) {
  const [module, setModule] = React.useState<Record<string, unknown>>();
  const [Component, setComponent] = React.useState<React.ComponentType>();
  React.useEffect(() => {
    if (kind === "block" || kind === "chart") components[name]?.().then((loaded) => setComponent(() => loaded));
    else stories[name]?.().then(setModule);
  }, [kind, name]);

  if (Component) {
    return (
      <ScrollArea className="h-svh">
        <Boundary>
          <Component />
        </Boundary>
      </ScrollArea>
    );
  }
  if (!module) return null;

  const meta = (module.default ?? {}) as Meta;
  const closed = overlays.has(name);
  const entries = Object.entries(module).filter(([key, value]) => key !== "default" && value && typeof value === "object");
  const found = entries.find(([key]) => key === only) ?? entries[0];
  if (!found) return null;
  const story = found[1] as Story;
  const layout = story.parameters?.layout ?? meta.parameters?.layout ?? "centered";

  return (
    <ScrollArea className="h-svh">
      <div
        className={cn(
          "min-h-svh",
          layout === "centered" && "flex flex-wrap items-center justify-center gap-3 p-6 sm:p-10",
          layout === "padded" && "p-4 sm:p-6",
        )}
      >
        <Boundary>
          <StoryView meta={meta} story={story} closed={closed} />
        </Boundary>
      </div>
    </ScrollArea>
  );
}
