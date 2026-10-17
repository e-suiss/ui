import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"

export default function SubagentRunning() {
  return (
    <Trace className="max-w-sm">
      <TraceCollapsible defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine status="running">
            <TraceIcon>
              <IconPlaceholder
                lucide="LoaderCircleIcon"
                tabler="IconLoader2"
                hugeicons="Loading03Icon"
                phosphor="CircleNotchIcon"
                remixicon="RiLoader4Line"
                className="animate-spin"
              />
            </TraceIcon>
            <TraceTitle>Running the research agent</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent keepMounted>
          <Trace>
            <TraceLine>
              <TraceIcon>
                <IconPlaceholder
                  lucide="CircleCheckIcon"
                  tabler="IconCircleCheck"
                  hugeicons="CheckmarkCircle02Icon"
                  phosphor="CheckCircleIcon"
                  remixicon="RiCheckboxCircleLine"
                />
              </TraceIcon>
              <TraceTitle>Ran grep -rn cacheKey scripts</TraceTitle>
            </TraceLine>
            <TraceLine status="running">
              <TraceIcon>
                <IconPlaceholder
                  lucide="LoaderCircleIcon"
                  tabler="IconLoader2"
                  hugeicons="Loading03Icon"
                  phosphor="CircleNotchIcon"
                  remixicon="RiLoader4Line"
                  className="animate-spin"
                />
              </TraceIcon>
              <TraceTitle>
                Running sed -n 13,15p scripts/optimize-images.ts
              </TraceTitle>
            </TraceLine>
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  )
}
