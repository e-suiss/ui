"use client";

import { cn } from "cn";
import type * as React from "react";
import { Pie, PieChart } from "recharts";

import { SegmentPicker, SegmentPickerItem } from "@/components/patterns/segment-picker";
import { Avatar, AvatarFallback, AvatarGroup } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ThemeToggle } from "@/components/ui/theme";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

function Tile({
  file,
  className,
  children,
}: {
  file?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <li
      className={cn(
        "relative flex min-h-44 flex-col overflow-hidden rounded-[28px] bg-surface-secondary p-6 md:min-h-60 md:p-7",
        className,
      )}
    >
      {file && (
        <p className="font-mono text-[11px] tracking-[0.02em] text-label-secondary">{file}</p>
      )}
      {children}
    </li>
  );
}

const pieces = [
  { kind: "components", label: "Components", count: 67, color: "var(--blue)" },
  { kind: "charts", label: "Charts", count: 70, color: "var(--purple)" },
  { kind: "blocks", label: "Blocks", count: 54, color: "var(--orange)" },
  { kind: "patterns", label: "Patterns", count: 19, color: "var(--green)" },
  { kind: "interactions", label: "Interactions", count: 11, color: "var(--pink)" },
  { kind: "hooks", label: "Hooks", count: 4, color: "var(--teal)" },
].map((piece) => ({ ...piece, fill: `var(--color-${piece.kind})` }));

const chartConfig: ChartConfig = {
  count: { label: "Pieces" },
  ...Object.fromEntries(pieces.map((piece) => [piece.kind, { label: piece.label, color: piece.color }])),
};

const total = pieces.reduce((sum, piece) => sum + piece.count, 0);

function ChartTile() {
  return (
    <Tile file="pie-chart.tsx" className="md:col-span-7 md:row-span-2">
      <div className="grid flex-1 items-center gap-8 pt-6 md:grid-cols-[1fr_1.15fr]">
        <div className="flex flex-col gap-8">
          <div>
            <p className="text-[clamp(3.5rem,6vw,6rem)] leading-[0.85] font-semibold tracking-[-0.06em] tabular-nums">
              {total}
            </p>
            <p className="mt-2 text-[17px] tracking-[-0.02em] text-label-secondary">pieces in the registry</p>
          </div>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
            {pieces.map((piece) => (
              <li key={piece.kind} className="flex items-center gap-2.5 text-[15px]">
                <span className="size-2.5 shrink-0 rounded-full" style={{ background: piece.color }} />
                <span className="flex-1">{piece.label}</span>
                <span className="text-label-secondary tabular-nums">{piece.count}</span>
              </li>
            ))}
          </ul>
        </div>
        <ChartContainer
          config={chartConfig}
          className="aspect-square w-full max-w-90 justify-self-center [&_.recharts-pie-sector]:origin-center [&_.recharts-pie-sector]:cursor-pointer [&_.recharts-pie-sector]:transition-[scale] [&_.recharts-pie-sector]:duration-500 [&_.recharts-pie-sector]:ease-[cubic-bezier(0.32,0.08,0.24,1)] [&_.recharts-pie-sector]:[transform-box:view-box] [&_.recharts-pie-sector:hover]:scale-[1.06] [&_svg]:overflow-visible"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              isAnimationActive={false}
              content={<ChartTooltipContent hideLabel nameKey="kind" />}
            />
            <Pie
              data={pieces}
              dataKey="count"
              nameKey="kind"
              innerRadius="56%"
              outerRadius="94%"
              strokeWidth={0}
              paddingAngle={1.5}
              cornerRadius={6}
            />
          </PieChart>
        </ChartContainer>
      </div>
    </Tile>
  );
}

const avatars = [
  { initials: "AM", tint: "from-[#5ac8fa] to-[#007aff] dark:from-[#5ac8fa] dark:to-[#007aff]" },
  { initials: "JK", tint: "from-[#ffcc00] to-[#ff9500] dark:from-[#ffcc00] dark:to-[#ff9500]" },
  { initials: "LS", tint: "from-[#34c759] to-[#248a3d] dark:from-[#34c759] dark:to-[#248a3d]" },
  { initials: "TR", tint: "from-[#bf5af2] to-[#8944ab] dark:from-[#bf5af2] dark:to-[#8944ab]" },
  { initials: "EP", tint: "from-[#ff6482] to-[#ff2d55] dark:from-[#ff6482] dark:to-[#ff2d55]" },
];

function AppearanceTile() {
  return (
    <Tile file="theme.tsx" className="md:col-span-6">
      <div className="flex flex-1 items-center justify-between gap-6">
        <div className="flex flex-col gap-1">
          <p className="text-[28px] leading-[1.1] font-semibold tracking-[-0.03em]">Light and dark.</p>
          <p className="text-[15px] text-label-secondary">
            Every token has a dark twin. Try it: this switches the whole page.
          </p>
        </div>
        <ThemeToggle effect="rectangle" origin="bottom-up" className="size-14 shrink-0" />
      </div>
    </Tile>
  );
}

export function Bento() {
  return (
    <ul className="grid auto-rows-[minmax(11rem,auto)] gap-3 md:auto-rows-[minmax(15rem,auto)] md:grid-cols-12">
      <ChartTile />

      <Tile file="switch.tsx" className="md:col-span-3">
        <div className="flex flex-1 items-center justify-center">
          <Switch defaultChecked aria-label="Wi‑Fi" className="scale-[1.8]" />
        </div>
      </Tile>

      <Tile file="toggle-group.tsx" className="md:col-span-2">
        <div className="flex flex-1 items-center justify-center">
          <ToggleGroup defaultValue={["bold"]} aria-label="Text style" size="lg">
            <ToggleGroupItem value="bold" className="font-bold">
              B
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" className="italic">
              I
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </Tile>

      <Tile file="segment-picker.tsx" className="md:col-span-5">
        <div className="flex flex-1 items-center justify-center">
          <SegmentPicker defaultValue="week" aria-label="Range" size="lg">
            <SegmentPickerItem value="day">Day</SegmentPickerItem>
            <SegmentPickerItem value="week">Week</SegmentPickerItem>
            <SegmentPickerItem value="month">Month</SegmentPickerItem>
            <SegmentPickerItem value="year">Year</SegmentPickerItem>
          </SegmentPicker>
        </div>
      </Tile>

      <Tile file="avatar.tsx" className="md:col-span-4">
        <div className="flex flex-1 items-center justify-center">
          <AvatarGroup className="has-data-[size=xl]:-space-x-3 *:data-[slot=avatar]:ring-[3px] *:data-[slot=avatar]:ring-surface-secondary">
            {avatars.map((avatar) => (
              <Avatar key={avatar.initials} size="xl">
                <AvatarFallback
                  className={cn(
                    "group-data-[size=xl]/avatar:text-lg",
                    avatar.tint,
                  )}
                >
                  {avatar.initials}
                </AvatarFallback>
              </Avatar>
            ))}
          </AvatarGroup>
        </div>
      </Tile>

      <Tile file="button.tsx" className="md:col-span-5">
        <div className="flex flex-1 flex-wrap items-center justify-center gap-2.5">
          <Button size="lg">Continue</Button>
          <Button size="lg" variant="secondary">
            Cancel
          </Button>
          <Button size="lg" variant="tinted">
            Share
          </Button>
        </div>
      </Tile>

      <Tile file="slider.tsx" className="md:col-span-3">
        <div className="flex flex-1 flex-col justify-center gap-4">
          <div className="flex items-baseline justify-between text-[15px]">
            <span>Volume</span>
            <span className="text-label-secondary tabular-nums">64%</span>
          </div>
          <Slider defaultValue={[64]} aria-label="Volume" />
        </div>
      </Tile>

      <Tile file="input.tsx" className="md:col-span-6">
        <div className="mt-6 flex flex-col gap-1">
          <p className="text-[28px] leading-[1.1] font-semibold tracking-[-0.03em]">Get release notes.</p>
          <p className="text-[15px] text-label-secondary">One email when a new version ships.</p>
        </div>
        <form className="mt-auto flex gap-2 pt-6" onSubmit={(event) => event.preventDefault()}>
          <Input type="email" placeholder="you@example.com" aria-label="Email" className="h-11 flex-1" />
          <Button size="lg" type="submit" className="rounded-lg">
            Subscribe
          </Button>
        </form>
      </Tile>

      <AppearanceTile />
    </ul>
  );
}
