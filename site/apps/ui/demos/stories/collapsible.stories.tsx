// @ts-nocheck
import { CaretUpDownIcon } from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor } from "storybook/test"

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
      <div className="bg-surface-secondary rounded-2xl px-4 py-2 text-sm">
        {repositories[0]}
      </div>
      <CollapsibleContent className="flex flex-col gap-2">
        {repositories.slice(1).map((repository) => (
          <div
            key={repository}
            className="bg-surface-secondary rounded-2xl px-4 py-2 text-sm"
          >
            {repository}
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  ),
  play: async ({ canvas, step }) => {
    const trigger = canvas.getByRole("button", { name: "Toggle list" })

    await step("starts collapsed", async () => {
      await expect(trigger).toHaveAttribute("aria-expanded", "false")
      await expect(canvas.queryByText("esuiss/docs")).toBeNull()
    })

    await step("expands on click", async () => {
      await userEvent.click(trigger)
      await expect(trigger).toHaveAttribute("aria-expanded", "true")
      await expect(await canvas.findByText("esuiss/docs")).toBeVisible()
    })

    await step("collapses with Enter", async () => {
      await userEvent.keyboard("{Enter}")
      await expect(trigger).toHaveAttribute("aria-expanded", "false")
      await waitFor(() => expect(canvas.queryByText("esuiss/docs")).toBeNull())
    })
  },
}

export const OpenByDefault: Story = {
  args: { defaultOpen: true },
  render: Default.render,
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("button", { name: "Toggle list" })
    ).toHaveAttribute("aria-expanded", "true")
    await expect(canvas.getByText("esuiss/cli")).toBeVisible()
  },
}

export const Disabled: Story = {
  args: { disabled: true },
  render: Default.render,
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("button", { name: "Toggle list" })
    await userEvent.click(trigger)
    await expect(trigger).toHaveAttribute("aria-expanded", "false")
    await expect(canvas.queryByText("esuiss/docs")).toBeNull()
  },
}
