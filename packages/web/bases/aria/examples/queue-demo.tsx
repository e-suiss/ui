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

export default function QueueDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4 py-6 text-sm">
      <Message align="end">
        <MessageContent>
          <Bubble align="end" variant="muted">
            <BubbleContent>Add dark mode to the settings page.</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message>
        <MessageContent className="gap-4">
          <Trace>
            <TraceCollapsible defaultExpanded>
              <TraceCollapsibleTrigger>
                <TraceLine>
                  <TraceIcon>
                    <IconPlaceholder
                      lucide="ListTodoIcon"
                      tabler="IconListDetails"
                      hugeicons="TaskDaily01Icon"
                      phosphor="ListDashesIcon"
                      remixicon="RiTodoLine"
                    />
                  </TraceIcon>
                  <TraceTitle>2 to do</TraceTitle>
                </TraceLine>
              </TraceCollapsibleTrigger>
              <TraceCollapsibleContent>
                <Trace>
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
                    <TraceTitle>Add a toggle to the settings page</TraceTitle>
                  </TraceLine>
                  <TraceLine>
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
            <TraceCollapsible defaultExpanded>
              <TraceCollapsibleTrigger>
                <TraceLine>
                  <TraceIcon>
                    <IconPlaceholder
                      lucide="ListChecksIcon"
                      tabler="IconListCheck"
                      hugeicons="CheckListIcon"
                      phosphor="ListChecksIcon"
                      remixicon="RiListCheck3"
                    />
                  </TraceIcon>
                  <TraceTitle>2 completed</TraceTitle>
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
                    <TraceTitle>
                      Add a dark variant to the theme tokens
                    </TraceTitle>
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
                    <TraceTitle>Read the theme from a cookie</TraceTitle>
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
