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

export default function QueueDescriptions() {
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
            <TraceTitle>3 to do</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent keepMounted>
          <Trace>
            <TraceCollapsible>
              <TraceCollapsibleTrigger>
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
                  <TraceTitle>
                    Fix the focus ring on the select trigger
                  </TraceTitle>
                </TraceLine>
              </TraceCollapsibleTrigger>
              <TraceCollapsibleContent>
                It is clipped by overflow-hidden on the field.
              </TraceCollapsibleContent>
            </TraceCollapsible>
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
              <TraceTitle>Update the registry snapshots</TraceTitle>
            </TraceLine>
            <TraceCollapsible>
              <TraceCollapsibleTrigger>
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
                  <TraceTitle>Add tests for the combobox</TraceTitle>
                </TraceLine>
              </TraceCollapsibleTrigger>
              <TraceCollapsibleContent>
                Typing, clearing and keyboard selection.
              </TraceCollapsibleContent>
            </TraceCollapsible>
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
            <TraceTitle>2 completed</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent keepMounted>
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
                  <TraceTitle>Write the migration guide</TraceTitle>
                </TraceLine>
              </TraceCollapsibleTrigger>
              <TraceCollapsibleContent>
                Cover the renamed props and the new data attributes.
              </TraceCollapsibleContent>
            </TraceCollapsible>
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
              <TraceTitle>Add a changeset</TraceTitle>
            </TraceLine>
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  )
}
