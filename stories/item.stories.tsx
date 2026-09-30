import {
  BellIcon,
  CaretRightIcon,
  CheckCircleIcon,
  PlusIcon,
  ShieldCheckIcon,
} from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"

const people = [
  {
    name: "Olivia Martin",
    email: "olivia@example.com",
    avatar: "https://i.pravatar.cc/96?img=12",
  },
  {
    name: "Liam Chen",
    email: "liam@example.com",
    avatar: "https://github.com/vercel.png",
  },
  {
    name: "Sofia Rossi",
    email: "sofia@example.com",
    avatar: "https://github.com/github.png",
  },
]

const meta = {
  title: "Components/Item",
  component: Item,
  args: {
    variant: "outline",
    size: "default",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outline", "muted"],
    },
    size: {
      control: "select",
      options: ["default", "sm", "xs"],
    },
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <Item {...args}>
      <ItemMedia variant="icon">
        <ShieldCheckIcon />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Two-factor authentication</ItemTitle>
        <ItemDescription>
          Add an extra layer of security to your account.
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button variant="outline" size="sm">
          Enable
        </Button>
      </ItemActions>
    </Item>
  ),
} satisfies Meta<typeof Item>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      {(["default", "outline", "muted"] as const).map((variant) => (
        <Item key={variant} {...args} variant={variant}>
          <ItemContent>
            <ItemTitle>
              {variant.charAt(0).toUpperCase() + variant.slice(1)} item
            </ItemTitle>
            <ItemDescription>
              A short description of this list entry.
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant="outline" size="sm">
              Open
            </Button>
          </ItemActions>
        </Item>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      {(["default", "sm", "xs"] as const).map((size) => (
        <Item key={size} {...args} size={size}>
          <ItemMedia variant="icon">
            <CheckCircleIcon />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Your profile has been verified</ItemTitle>
          </ItemContent>
          <ItemActions>
            <CaretRightIcon className="size-4" />
          </ItemActions>
        </Item>
      ))}
    </div>
  ),
}

export const AsLink: Story = {
  render: (args) => (
    <Item {...args} render={<a href="#notifications" />}>
      <ItemMedia variant="icon">
        <BellIcon />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Notification settings</ItemTitle>
        <ItemDescription>
          Choose what you want to be notified about.
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <CaretRightIcon className="size-4" />
      </ItemActions>
    </Item>
  ),
}

export const WithImage: Story = {
  render: (args) => (
    <ItemGroup>
      {people.map((person, index) => (
        <div key={person.email} className="contents">
          {index > 0 && <ItemSeparator />}
          <Item {...args} variant="default" size="sm" role="listitem">
            <ItemMedia variant="image">
              <img src={person.avatar} alt={person.name} />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{person.name}</ItemTitle>
              <ItemDescription>{person.email}</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button variant="ghost" size="icon-sm" aria-label="Invite">
                <PlusIcon />
              </Button>
            </ItemActions>
          </Item>
        </div>
      ))}
    </ItemGroup>
  ),
}

export const WithAvatar: Story = {
  render: (args) => (
    <Item {...args}>
      <ItemMedia>
        <Avatar size="lg">
          <AvatarImage
            src="https://i.pravatar.cc/96?img=12"
            alt="Olivia Martin"
          />
          <AvatarFallback>OM</AvatarFallback>
        </Avatar>
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Olivia Martin</ItemTitle>
        <ItemDescription>Last seen 5 minutes ago</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button size="sm">Message</Button>
      </ItemActions>
    </Item>
  ),
}

export const WithHeaderAndFooter: Story = {
  render: (args) => (
    <Item {...args}>
      <ItemHeader>
        <ItemTitle>Pro plan</ItemTitle>
        <span className="text-sm font-medium">$24/mo</span>
      </ItemHeader>
      <ItemContent>
        <ItemDescription>
          Unlimited projects, priority support, and advanced analytics.
        </ItemDescription>
      </ItemContent>
      <ItemFooter>
        <span className="text-muted-foreground text-xs">Renews on May 1</span>
        <Button variant="outline" size="sm">
          Manage
        </Button>
      </ItemFooter>
    </Item>
  ),
}
