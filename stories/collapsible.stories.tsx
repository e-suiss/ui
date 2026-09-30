import type { Meta, StoryObj } from "@storybook/react-vite"
import { CaretUpDownIcon } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

const repositories = ["esuiss/ui", "esuiss/docs", "esuiss/cli"]

const meta = {
  title: "Components/Collapsible",
  component: Collapsible,
  args: {
    disabled: false,
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Collapsible>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Collapsible {...args} className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-4 px-3">
        <span className="text-sm font-medium">
          @ademceper starred 3 repositories
        </span>
        <CollapsibleTrigger
          render={
            <Button variant="ghost" size="icon-sm" aria-label="Toggle list" />
          }
        >
          <CaretUpDownIcon />
        </CollapsibleTrigger>
      </div>
      <div className="bg-muted rounded-2xl px-4 py-2 text-sm">
        {repositories[0]}
      </div>
      <CollapsibleContent className="flex flex-col gap-2">
        {repositories.slice(1).map((repository) => (
          <div
            key={repository}
            className="bg-muted rounded-2xl px-4 py-2 text-sm"
          >
            {repository}
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  ),
}

export const OpenByDefault: Story = {
  ...Default,
  args: { defaultOpen: true },
}

export const Disabled: Story = {
  ...Default,
  args: { disabled: true },
}
