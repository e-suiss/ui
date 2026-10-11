// @ts-nocheck
import { CheckIcon, PlusIcon, UserIcon } from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect } from "storybook/test"

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar"

const people = [
  {
    name: "Emma Wilson",
    initials: "EW",
    src: "https://i.pravatar.cc/128?img=47",
  },
  {
    name: "Liam Carter",
    initials: "LC",
    src: "https://i.pravatar.cc/128?img=12",
  },
  {
    name: "Sofia Martinez",
    initials: "SM",
    src: "https://i.pravatar.cc/128?img=32",
  },
] as const

const meta = {
  title: "Components/Avatar",
  component: Avatar,
  args: {
    size: "default",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "default", "lg", "xl"],
    },
  },
} satisfies Meta<typeof Avatar>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage src={people[0].src} alt={people[0].name} />
      <AvatarFallback>{people[0].initials}</AvatarFallback>
    </Avatar>
  ),
}

export const Fallback: Story = {
  render: (args) => (
    <Avatar {...args}>
      <AvatarFallback>LC</AvatarFallback>
    </Avatar>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText("LC")).toBeVisible()
  },
}

export const FallbackSizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      {(["sm", "default", "lg", "xl"] as const).map((size) => (
        <Avatar key={size} {...args} size={size}>
          <AvatarFallback>{people[0].initials}</AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
}

export const Placeholder: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      {(["sm", "default", "lg", "xl"] as const).map((size) => (
        <Avatar key={size} {...args} size={size}>
          <AvatarFallback>
            <UserIcon weight="fill" />
          </AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      {(["sm", "default", "lg", "xl"] as const).map((size) => (
        <Avatar key={size} {...args} size={size}>
          <AvatarImage src={people[1].src} alt={people[1].name} />
          <AvatarFallback>{people[1].initials}</AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
}

export const WithBadge: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      {(["sm", "default", "lg", "xl"] as const).map((size) => (
        <Avatar key={size} {...args} size={size}>
          <AvatarImage src={people[2].src} alt={people[2].name} />
          <AvatarFallback>{people[2].initials}</AvatarFallback>
          <AvatarBadge className="bg-success">
            <CheckIcon weight="bold" />
          </AvatarBadge>
        </Avatar>
      ))}
    </div>
  ),
}

export const Group: Story = {
  render: (args) => (
    <AvatarGroup>
      {people.map((person) => (
        <Avatar key={person.name} {...args}>
          <AvatarImage src={person.src} alt={person.name} />
          <AvatarFallback>{person.initials}</AvatarFallback>
        </Avatar>
      ))}
      <AvatarGroupCount>+4</AvatarGroupCount>
    </AvatarGroup>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText("+4")).toBeVisible()
    for (const person of people) {
      await expect(
        canvas.queryByRole("img", { name: person.name }) ??
          canvas.queryByText(person.initials)
      ).toBeInTheDocument()
    }
  },
}

export const GroupWithIconCount: Story = {
  args: { size: "lg" },
  render: (args) => (
    <AvatarGroup>
      {people.map((person) => (
        <Avatar key={person.name} {...args}>
          <AvatarImage src={person.src} alt={person.name} />
          <AvatarFallback>{person.initials}</AvatarFallback>
        </Avatar>
      ))}
      <AvatarGroupCount>
        <PlusIcon />
      </AvatarGroupCount>
    </AvatarGroup>
  ),
}
