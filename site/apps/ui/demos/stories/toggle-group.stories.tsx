// @ts-nocheck
import {
  TextAlignCenterIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
  TextBIcon,
  TextItalicIcon,
  TextUnderlineIcon,
} from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent } from "storybook/test"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const meta = {
  title: "Components/Toggle Group",
  component: ToggleGroup,
  args: {
    variant: "default",
    size: "default",
    spacing: 2,
    orientation: "horizontal",
    multiple: true,
    disabled: false,
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outline"],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg"],
    },
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
    spacing: {
      control: { type: "number", min: 0, max: 4 },
    },
  },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        <TextBIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <TextItalicIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Toggle underline">
        <TextUnderlineIcon />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
} satisfies Meta<typeof ToggleGroup>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { defaultValue: ["bold"] },
  play: async ({ canvas, step }) => {
    const bold = canvas.getByRole("button", { name: "Toggle bold" })
    const italic = canvas.getByRole("button", { name: "Toggle italic" })

    await step("presses several items at once", async () => {
      await expect(bold).toHaveAttribute("aria-pressed", "true")
      await userEvent.click(italic)
      await expect(italic).toHaveAttribute("aria-pressed", "true")
      await expect(bold).toHaveAttribute("aria-pressed", "true")
    })

    await step(
      "moves focus with arrow keys and toggles with Space",
      async () => {
        await userEvent.keyboard("{ArrowRight}")
        const underline = canvas.getByRole("button", {
          name: "Toggle underline",
        })
        await expect(underline).toHaveFocus()
        await userEvent.keyboard(" ")
        await expect(underline).toHaveAttribute("aria-pressed", "true")
      }
    )

    await step("releases an item on a second click", async () => {
      await userEvent.click(bold)
      await expect(bold).toHaveAttribute("aria-pressed", "false")
    })
  },
}

export const Outline: Story = {
  args: { variant: "outline", defaultValue: ["italic"] },
}

export const Attached: Story = {
  args: { variant: "outline", spacing: 0, defaultValue: ["bold"] },
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col items-start gap-3">
      {(["sm", "default", "lg"] as const).map((size) => (
        <ToggleGroup key={size} {...args} size={size}>
          <ToggleGroupItem value="bold" aria-label="Toggle bold">
            <TextBIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Toggle italic">
            <TextItalicIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Toggle underline">
            <TextUnderlineIcon />
          </ToggleGroupItem>
        </ToggleGroup>
      ))}
    </div>
  ),
}

export const Segmented: Story = {
  args: {
    multiple: false,
    variant: "default",
    spacing: 0,
    defaultValue: ["week"],
  },
  render: (args) => (
    <ToggleGroup {...args} aria-label="Calendar view">
      <ToggleGroupItem value="day">Day</ToggleGroupItem>
      <ToggleGroupItem value="week">Week</ToggleGroupItem>
      <ToggleGroupItem value="month">Month</ToggleGroupItem>
      <ToggleGroupItem value="year">Year</ToggleGroupItem>
    </ToggleGroup>
  ),
  play: async ({ canvas, step }) => {
    const week = canvas.getByRole("button", { name: "Week" })
    const month = canvas.getByRole("button", { name: "Month" })

    await step("names the group and keeps one item pressed", async () => {
      await expect(
        canvas.getByRole("group", { name: "Calendar view" })
      ).toBeVisible()
      await expect(week).toHaveAttribute("aria-pressed", "true")
      await userEvent.click(month)
      await expect(month).toHaveAttribute("aria-pressed", "true")
      await expect(week).toHaveAttribute("aria-pressed", "false")
    })
  },
}

export const SegmentedVertical: Story = {
  args: {
    multiple: false,
    variant: "default",
    spacing: 0,
    orientation: "vertical",
    defaultValue: ["week"],
  },
  render: Segmented.render,
  play: async ({ canvas, step }) => {
    await step("moves focus with up and down keys", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Week" }))
      await userEvent.keyboard("{ArrowDown}")
      await expect(canvas.getByRole("button", { name: "Month" })).toHaveFocus()
      await userEvent.keyboard("{ArrowUp}{ArrowUp}")
      await expect(canvas.getByRole("button", { name: "Day" })).toHaveFocus()
    })
  },
}

export const SegmentedMultiple: Story = {
  args: {
    multiple: true,
    variant: "default",
    spacing: 0,
    defaultValue: ["bold", "underline"],
  },
}

export const SegmentedSizes: Story = {
  args: { multiple: false, variant: "default", spacing: 0 },
  render: (args) => (
    <div className="flex flex-col items-start gap-3">
      {(["sm", "default", "lg"] as const).map((size) => (
        <ToggleGroup
          key={size}
          {...args}
          size={size}
          defaultValue={["week"]}
          aria-label={`Calendar view, ${size}`}
        >
          <ToggleGroupItem value="day">Day</ToggleGroupItem>
          <ToggleGroupItem value="week">Week</ToggleGroupItem>
          <ToggleGroupItem value="month">Month</ToggleGroupItem>
        </ToggleGroup>
      ))}
    </div>
  ),
}

export const SingleSelection: Story = {
  args: { multiple: false, variant: "outline", defaultValue: ["left"] },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="left" aria-label="Align left">
        <TextAlignLeftIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center">
        <TextAlignCenterIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        <TextAlignRightIcon />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
  play: async ({ canvas, step }) => {
    await step("switches the single pressed item", async () => {
      const left = canvas.getByRole("button", { name: "Align left" })
      const right = canvas.getByRole("button", { name: "Align right" })
      await userEvent.click(right)
      await expect(right).toHaveAttribute("aria-pressed", "true")
      await expect(left).toHaveAttribute("aria-pressed", "false")
    })
  },
}

export const Vertical: Story = {
  args: {
    orientation: "vertical",
    variant: "outline",
    spacing: 0,
    defaultValue: ["bold"],
  },
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: ["bold"] },
  play: async ({ canvas, step }) => {
    await step("disables every item and ignores clicks", async () => {
      for (const item of canvas.getAllByRole("button")) {
        await expect(item).toBeDisabled()
      }
      const italic = canvas.getByRole("button", { name: "Toggle italic" })
      await userEvent.click(italic, { pointerEventsCheck: 0 })
      await expect(italic).toHaveAttribute("aria-pressed", "false")
    })
  },
}
