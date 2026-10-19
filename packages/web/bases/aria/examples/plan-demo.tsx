import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Message, MessageContent } from "@/components/ui/message"
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

export default function PlanDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4 py-6 text-sm">
      <Message align="end">
        <MessageContent>
          <Bubble align="end" variant="muted">
            <BubbleContent>
              Migrate the dialog components to Base UI.
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message>
        <MessageContent className="gap-4">
          <Trace>
            <TraceCollapsible defaultExpanded>
              <TraceCollapsibleTrigger>
                <TraceLine status="running">
                  <TraceIcon>
                    <IconPlaceholder
                      lucide="RouteIcon"
                      tabler="IconRoute"
                      hugeicons="Route01Icon"
                      phosphor="PathIcon"
                      remixicon="RiRouteLine"
                    />
                  </TraceIcon>
                  <TraceTitle>Plan: migrate to Base UI</TraceTitle>
                  <TraceDescription>2 of 4 done</TraceDescription>
                </TraceLine>
              </TraceCollapsibleTrigger>
              <TraceCollapsibleContent>
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
                    <TraceTitle>Install @base-ui/react</TraceTitle>
                  </TraceLine>
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
                    <TraceTitle>Replace the Radix imports</TraceTitle>
                  </TraceLine>
                  <TraceLine status="running">
                    <TraceIcon>
                      <IconPlaceholder
                        lucide="CircleDotIcon"
                        tabler="IconCircleDot"
                        hugeicons="RecordIcon"
                        phosphor="RecordIcon"
                        remixicon="RiRecordCircleLine"
                      />
                    </TraceIcon>
                    <TraceTitle>Rename asChild to render</TraceTitle>
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
                    <TraceTitle>Run the type checker</TraceTitle>
                  </TraceLine>
                </Trace>
              </TraceCollapsibleContent>
            </TraceCollapsible>
          </Trace>
        </MessageContent>
      </Message>
    </div>
  )
}
