import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Message, MessageContent } from "@/components/ui/message"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"

const tasks = [
  {
    title: "Found the project files",
    steps: [
      "Searched for generateMetadata",
      "Read app/layout.tsx",
      "Read app/page.tsx",
    ],
  },
  {
    title: "Updated the page metadata",
    steps: ["Edited app/layout.tsx", "Edited app/page.tsx"],
  },
]

export default function TaskDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4 py-6 text-sm">
      <Message align="end">
        <MessageContent>
          <Bubble align="end" variant="muted">
            <BubbleContent>
              Add Open Graph metadata to the home page.
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message>
        <MessageContent className="gap-4">
          <Trace>
            {tasks.map((task, index) => (
              <TraceCollapsible
                key={task.title}
                defaultOpen={index === tasks.length - 1}
              >
                <TraceCollapsibleTrigger>
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
                    <TraceTitle>{task.title}</TraceTitle>
                  </TraceLine>
                </TraceCollapsibleTrigger>
                <TraceCollapsibleContent>
                  <Trace>
                    {task.steps.map((step) => (
                      <TraceLine key={step}>
                        <TraceTitle>{step}</TraceTitle>
                      </TraceLine>
                    ))}
                  </Trace>
                </TraceCollapsibleContent>
              </TraceCollapsible>
            ))}
          </Trace>
          <p>
            Added Open Graph defaults to app/layout.tsx and a title, description
            and image for the home page in app/page.tsx.
          </p>
        </MessageContent>
      </Message>
    </div>
  )
}
