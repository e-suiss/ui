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
            <TraceCollapsible>
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
                  <TraceTitle>Found the project files</TraceTitle>
                </TraceLine>
              </TraceCollapsibleTrigger>
              <TraceCollapsibleContent>
                <Trace>
                  <TraceLine>
                    <TraceTitle>Searched for generateMetadata</TraceTitle>
                  </TraceLine>
                  <TraceLine>
                    <TraceTitle>Read app/layout.tsx</TraceTitle>
                  </TraceLine>
                  <TraceLine>
                    <TraceTitle>Read app/page.tsx</TraceTitle>
                  </TraceLine>
                </Trace>
              </TraceCollapsibleContent>
            </TraceCollapsible>
            <TraceCollapsible defaultOpen>
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
                  <TraceTitle>Updated the page metadata</TraceTitle>
                </TraceLine>
              </TraceCollapsibleTrigger>
              <TraceCollapsibleContent>
                <Trace>
                  <TraceLine>
                    <TraceTitle>Edited app/layout.tsx</TraceTitle>
                  </TraceLine>
                  <TraceLine>
                    <TraceTitle>Edited app/page.tsx</TraceTitle>
                  </TraceLine>
                </Trace>
              </TraceCollapsibleContent>
            </TraceCollapsible>
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
