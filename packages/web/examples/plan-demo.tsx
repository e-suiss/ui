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

const steps = [
  { title: "Install @base-ui/react", status: "done" },
  { title: "Replace the Radix imports", status: "done" },
  { title: "Rename asChild to render", status: "running" },
  { title: "Run the type checker", status: "pending" },
] as const

function StepIcon({ status }: { status: (typeof steps)[number]["status"] }) {
  if (status === "done") {
    return (
      <IconPlaceholder
        lucide="CircleCheckIcon"
        tabler="IconCircleCheck"
        hugeicons="CheckmarkCircle02Icon"
        phosphor="CheckCircleIcon"
        remixicon="RiCheckboxCircleLine"
      />
    )
  }

  if (status === "running") {
    return (
      <IconPlaceholder
        lucide="CircleDotIcon"
        tabler="IconCircleDot"
        hugeicons="RecordIcon"
        phosphor="RecordIcon"
        remixicon="RiRecordCircleLine"
      />
    )
  }

  return (
    <IconPlaceholder
      lucide="CircleIcon"
      tabler="IconCircle"
      hugeicons="CircleIcon"
      phosphor="CircleIcon"
      remixicon="RiCircleLine"
    />
  )
}

export default function PlanDemo() {
  const done = steps.filter((step) => step.status === "done").length

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
            <TraceCollapsible defaultOpen>
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
                  <TraceDescription>
                    {done} of {steps.length} done
                  </TraceDescription>
                </TraceLine>
              </TraceCollapsibleTrigger>
              <TraceCollapsibleContent>
                <Trace>
                  {steps.map((step) => (
                    <TraceLine
                      key={step.title}
                      status={step.status === "done" ? undefined : step.status}
                    >
                      <TraceIcon>
                        <StepIcon status={step.status} />
                      </TraceIcon>
                      <TraceTitle>{step.title}</TraceTitle>
                    </TraceLine>
                  ))}
                </Trace>
              </TraceCollapsibleContent>
            </TraceCollapsible>
          </Trace>
        </MessageContent>
      </Message>
    </div>
  )
}
