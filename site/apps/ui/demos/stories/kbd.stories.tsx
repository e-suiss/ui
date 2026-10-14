// @ts-nocheck
import {
  ArrowElbowDownLeftIcon,
  CommandIcon,
  MagnifyingGlassIcon,
} from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent } from "storybook/test"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Kbd, KbdGroup } from "@/components/ui/kbd"

const meta = {
  title: "Components/Kbd",
  component: Kbd,
} satisfies Meta<typeof Kbd>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { mod: true, children: "K" },
  play: async ({ canvasElement, step }) => {
    await step("renders the shortcut inside a kbd element", async () => {
      const kbd = canvasElement.querySelector("kbd")
      await expect(kbd).not.toBeNull()
      await expect(kbd).toHaveTextContent("K")
      await expect(kbd?.textContent?.length).toBeGreaterThan(1)
    })
  },
}

export const Modifiers: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      <Kbd {...args} mod />
      <Kbd {...args}>⇧</Kbd>
      <Kbd {...args}>⌥</Kbd>
      <Kbd {...args}>⌃</Kbd>
      <Kbd {...args}>Esc</Kbd>
      <Kbd {...args}>Tab</Kbd>
    </div>
  ),
}

export const Group: Story = {
  render: (args) => (
    <div className="text-label-secondary flex flex-col items-start gap-3 text-sm">
      <p>
        Use{" "}
        <KbdGroup>
          <Kbd {...args} mod />
          <span>+</span>
          <Kbd {...args}>B</Kbd>
        </KbdGroup>{" "}
        to toggle the sidebar.
      </p>
      <KbdGroup>
        <Kbd {...args} mod />
        <Kbd {...args}>⇧</Kbd>
        <Kbd {...args}>P</Kbd>
      </KbdGroup>
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    await step("nests each key inside its group", async () => {
      const groups = canvasElement.querySelectorAll('[data-slot="kbd-group"]')
      await expect(groups).toHaveLength(2)
      await expect(
        groups[0]?.querySelectorAll('[data-slot="kbd"]')
      ).toHaveLength(2)
      await expect(
        groups[1]?.querySelectorAll('[data-slot="kbd"]')
      ).toHaveLength(3)
    })
  },
}

export const WithIcon: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      <Kbd {...args}>
        <CommandIcon />K
      </Kbd>
      <Kbd {...args}>
        <ArrowElbowDownLeftIcon />
      </Kbd>
    </div>
  ),
}

export const InInputGroup: Story = {
  render: (args) => (
    <div className="w-80">
      <InputGroup>
        <InputGroupInput placeholder="Search..." />
        <InputGroupAddon>
          <MagnifyingGlassIcon />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <Kbd {...args} mod>
            K
          </Kbd>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
  play: async ({ canvas, canvasElement, step }) => {
    const input = canvas.getByPlaceholderText("Search...")
    const kbd = canvasElement.querySelector<HTMLElement>('[data-slot="kbd"]')
    const addon = kbd?.closest<HTMLElement>('[data-slot="input-group-addon"]')

    await step("shows the shortcut in the trailing addon", async () => {
      await expect(kbd).toHaveTextContent("K")
      await expect(addon).toHaveAttribute("data-align", "inline-end")
    })

    await step("focuses the input from the hint and accepts text", async () => {
      if (addon) await userEvent.click(addon)
      await expect(input).toHaveFocus()
      await userEvent.keyboard("dialog")
      await expect(input).toHaveValue("dialog")
    })
  },
}
