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

const todos: { title: string; description?: string; done: boolean }[] = [
  {
    title: "Write the migration guide",
    description: "Cover the renamed props and the new data attributes.",
    done: true,
  },
  { title: "Add a changeset", done: true },
  {
    title: "Fix the focus ring on the select trigger",
    description: "It is clipped by overflow-hidden on the field.",
    done: false,
  },
  { title: "Update the registry snapshots", done: false },
  {
    title: "Add tests for the combobox",
    description: "Typing, clearing and keyboard selection.",
    done: false,
  },
]

function TodoRow({ todo }: { todo: (typeof todos)[number] }) {
  const line = (
    <TraceLine>
      <TraceIcon>
        {todo.done ? (
          <IconPlaceholder
            lucide="CircleCheckIcon"
            tabler="IconCircleCheck"
            hugeicons="CheckmarkCircle02Icon"
            phosphor="CheckCircleIcon"
            remixicon="RiCheckboxCircleLine"
          />
        ) : (
          <IconPlaceholder
            lucide="CircleIcon"
            tabler="IconCircle"
            hugeicons="CircleIcon"
            phosphor="CircleIcon"
            remixicon="RiCircleLine"
          />
        )}
      </TraceIcon>
      <TraceTitle>{todo.title}</TraceTitle>
    </TraceLine>
  )

  if (!todo.description) {
    return line
  }

  return (
    <TraceCollapsible>
      <TraceCollapsibleTrigger>{line}</TraceCollapsibleTrigger>
      <TraceCollapsibleContent>{todo.description}</TraceCollapsibleContent>
    </TraceCollapsible>
  )
}

export default function QueueDescriptions() {
  const pending = todos.filter((todo) => !todo.done)
  const completed = todos.filter((todo) => todo.done)

  return (
    <Trace className="max-w-sm">
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
        <TraceCollapsibleContent keepMounted>
          <Trace>
            {pending.map((todo) => (
              <TodoRow key={todo.title} todo={todo} />
            ))}
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
      <TraceCollapsible>
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
        <TraceCollapsibleContent keepMounted>
          <Trace>
            {completed.map((todo) => (
              <TodoRow key={todo.title} todo={todo} />
            ))}
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  )
}
