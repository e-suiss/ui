// @ts-nocheck
import { ArrowUpRightIcon, CheckCircleIcon } from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect } from "storybook/test"

import { Badge } from "@/components/ui/badge"

const meta = {
  title: "Components/Badge",
  component: Badge,
  args: {
    children: "Badge",
    variant: "default",
  },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "secondary",
        "destructive",
        "outline",
        "ghost",
        "link",
      ],
    },
  },
} satisfies Meta<typeof Badge>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Badge")).toBeVisible()
  },
}

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge {...args} variant="default">
        Default
      </Badge>
      <Badge {...args} variant="secondary">
        Secondary
      </Badge>
      <Badge {...args} variant="destructive">
        Destructive
      </Badge>
      <Badge {...args} variant="outline">
        Outline
      </Badge>
      <Badge {...args} variant="ghost">
        Ghost
      </Badge>
      <Badge {...args} variant="link">
        Link
      </Badge>
    </div>
  ),
}

export const WithIcon: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge {...args} variant="secondary">
        <CheckCircleIcon data-icon="inline-start" />
        Verified
      </Badge>
      <Badge {...args} variant="outline">
        Changelog
        <ArrowUpRightIcon data-icon="inline-end" />
      </Badge>
    </div>
  ),
}

export const AsLink: Story = {
  args: {
    render: <a href="#documentation" />,
    children: "Documentation",
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("link", { name: "Documentation" })
    ).toHaveAttribute("href", "#documentation")
  },
}

export const CustomColor: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge {...args} className="text-orange-700 dark:text-orange-400">
        New
      </Badge>
      <Badge {...args} className="text-success">
        Available
      </Badge>
    </div>
  ),
}
