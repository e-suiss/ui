import type { Meta, StoryObj } from "@storybook/react-native"
import {
  CheckCircleIcon,
  CircleIcon,
  PathIcon,
  RecordIcon,
} from "phosphor-react-native"
import { Icon } from "@/components/ui/icon"
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

const meta = {
  title: "AI/Plan",
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <TraceCollapsible defaultOpen>
      <TraceCollapsibleTrigger>
        <TraceLine status="running">
          <TraceIcon>
            <Icon as={PathIcon} />
          </TraceIcon>
          <TraceTitle>Plan: migrate to Base UI</TraceTitle>
          <TraceDescription>2 of 4 done</TraceDescription>
        </TraceLine>
      </TraceCollapsibleTrigger>
      <TraceCollapsibleContent>
        <Trace>
          <TraceLine>
            <TraceIcon>
              <Icon as={CheckCircleIcon} />
            </TraceIcon>
            <TraceTitle>Install @base-ui/react</TraceTitle>
          </TraceLine>
          <TraceLine>
            <TraceIcon>
              <Icon as={CheckCircleIcon} />
            </TraceIcon>
            <TraceTitle>Replace the Radix imports</TraceTitle>
          </TraceLine>
          <TraceLine status="running">
            <TraceIcon>
              <Icon as={RecordIcon} />
            </TraceIcon>
            <TraceTitle>Rename asChild to render</TraceTitle>
          </TraceLine>
          <TraceLine status="pending">
            <TraceIcon>
              <Icon as={CircleIcon} />
            </TraceIcon>
            <TraceTitle>Run the type checker</TraceTitle>
          </TraceLine>
        </Trace>
      </TraceCollapsibleContent>
    </TraceCollapsible>
  ),
}
