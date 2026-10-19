import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"

export default function PlanDescription() {
  return (
    <Trace className="max-w-sm">
      <TraceCollapsible defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <IconPlaceholder
                lucide="RouteIcon"
                tabler="IconRoute"
                hugeicons="Route01Icon"
                phosphor="PathIcon"
                remixicon="RiRouteLine"
              />
            </TraceIcon>
            <TraceTitle>Plan: add dark mode</TraceTitle>
            <TraceDescription>1 of 4 done</TraceDescription>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent className="flex flex-col gap-3">
          <p>
            Store the theme in a cookie so the server renders the right one and
            the page does not flash on load.
          </p>
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
              <TraceTitle>Add a dark variant to the theme tokens</TraceTitle>
            </TraceLine>
            <TraceLine status="pending">
              <TraceIcon>
                <IconPlaceholder
                  lucide="CircleIcon"
                  tabler="IconCircle"
                  hugeicons="CircleIcon"
                  phosphor="CircleIcon"
                  remixicon="RiCircleLine"
                />
              </TraceIcon>
              <TraceTitle>
                Read the theme from a cookie on the server
              </TraceTitle>
            </TraceLine>
            <TraceLine status="pending">
              <TraceIcon>
                <IconPlaceholder
                  lucide="CircleIcon"
                  tabler="IconCircle"
                  hugeicons="CircleIcon"
                  phosphor="CircleIcon"
                  remixicon="RiCircleLine"
                />
              </TraceIcon>
              <TraceTitle>Add a toggle to the settings page</TraceTitle>
            </TraceLine>
            <TraceLine status="pending">
              <TraceIcon>
                <IconPlaceholder
                  lucide="CircleIcon"
                  tabler="IconCircle"
                  hugeicons="CircleIcon"
                  phosphor="CircleIcon"
                  remixicon="RiCircleLine"
                />
              </TraceIcon>
              <TraceTitle>Check contrast on the charts</TraceTitle>
            </TraceLine>
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  )
}
