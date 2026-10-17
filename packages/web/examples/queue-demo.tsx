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

type Todo = {
  content: string
  status: "pending" | "in_progress" | "completed"
}

const todos: Todo[] = [
  { content: "Add a dark variant to the theme tokens", status: "completed" },
  { content: "Read the theme from a cookie", status: "completed" },
  { content: "Add a toggle to the settings page", status: "in_progress" },
  { content: "Check contrast on the charts", status: "pending" },
]

function TodoIcon({ status }: { status: Todo["status"] }) {
  if (status === "completed") {
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
  if (status === "in_progress") {
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

function TodoLine({ todo }: { todo: Todo }) {
  return (
    <TraceLine status={todo.status === "in_progress" ? "running" : undefined}>
      <TraceIcon>
        <TodoIcon status={todo.status} />
      </TraceIcon>
      <TraceTitle>{todo.content}</TraceTitle>
    </TraceLine>
  )
}

export default function QueueDemo() {
  const pending = todos.filter((todo) => todo.status !== "completed")
  const completed = todos.filter((todo) => todo.status === "completed")

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
            <TraceCollapsible defaultOpen>
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
                  <TraceTitle>{pending.length} to do</TraceTitle>
                </TraceLine>
              </TraceCollapsibleTrigger>
              <TraceCollapsibleContent>
                <Trace>
                  {pending.map((todo) => (
                    <TodoLine key={todo.content} todo={todo} />
                  ))}
                </Trace>
              </TraceCollapsibleContent>
            </TraceCollapsible>
            <TraceCollapsible defaultOpen>
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
                  <TraceTitle>{completed.length} completed</TraceTitle>
                </TraceLine>
              </TraceCollapsibleTrigger>
              <TraceCollapsibleContent>
                <Trace>
                  {completed.map((todo) => (
                    <TodoLine key={todo.content} todo={todo} />
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
