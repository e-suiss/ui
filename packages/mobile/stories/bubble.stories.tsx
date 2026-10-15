import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import {
  ContextActions,
  ContextActionsContent,
  ContextActionsItem,
  ContextActionsTrigger,
} from "@/components/patterns/context-actions"
import {
  Bubble,
  BubbleContent,
  BubbleGroup,
  BubbleReactions,
} from "@/components/ui/bubble"

const VARIANTS = [
  "default",
  "secondary",
  "muted",
  "tinted",
  "outline",
  "ghost",
  "destructive",
] as const

const meta = {
  title: "Components/Bubble",
  component: Bubble,
  args: {
    variant: "default",
    align: "start",
  },
  argTypes: {
    variant: {
      control: "select",
      options: VARIANTS,
    },
    align: {
      control: "select",
      options: ["start", "end"],
    },
  },
} satisfies Meta<typeof Bubble>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Bubble {...args}>
      <BubbleContent>Are we still on for lunch tomorrow?</BubbleContent>
    </Bubble>
  ),
}

export const Variants: Story = {
  render: (args) => (
    <BubbleGroup>
      {VARIANTS.map((variant) => (
        <Bubble key={variant} {...args} variant={variant}>
          <BubbleContent>This is a {variant} bubble.</BubbleContent>
        </Bubble>
      ))}
    </BubbleGroup>
  ),
}

export const Conversation: Story = {
  render: () => (
    <BubbleGroup>
      <Bubble variant="muted">
        <BubbleContent>
          Hey, did you get a chance to review the draft?
        </BubbleContent>
      </Bubble>
      <Bubble align="end">
        <BubbleContent>Yes, I left a few comments on the intro.</BubbleContent>
      </Bubble>
      <Bubble align="end">
        <BubbleContent>Everything else looks great.</BubbleContent>
      </Bubble>
      <Bubble variant="muted">
        <BubbleContent>Thanks! I will update it this afternoon.</BubbleContent>
      </Bubble>
    </BubbleGroup>
  ),
}

export const WithReactions: Story = {
  render: (args) => (
    <BubbleGroup>
      <Bubble {...args} variant="muted">
        <BubbleContent>We just hit 10,000 users!</BubbleContent>
        <BubbleReactions>🎉 3</BubbleReactions>
      </Bubble>
      <Bubble {...args} align="end">
        <BubbleContent>That is amazing news.</BubbleContent>
        <BubbleReactions align="start">❤️</BubbleReactions>
      </Bubble>
      <Bubble {...args} variant="secondary">
        <BubbleContent>Reactions can sit on top as well.</BubbleContent>
        <BubbleReactions side="top">👍 2</BubbleReactions>
      </Bubble>
    </BubbleGroup>
  ),
}

export const Interactive: Story = {
  args: { variant: "outline" },
  render: (args) => (
    <Bubble {...args}>
      <BubbleContent onPress={() => undefined}>
        Show me the latest release notes
      </BubbleContent>
    </Bubble>
  ),
}

export const LongPressActions: Story = {
  render: () => (
    <View>
      <ContextActions>
        <Bubble variant="muted">
          <BubbleContent
            accessibilityLabel="Message from Maya"
            render={<ContextActionsTrigger />}
          >
            Hold this message to see its actions.
          </BubbleContent>
        </Bubble>
        <ContextActionsContent>
          <ContextActionsItem>Reply</ContextActionsItem>
          <ContextActionsItem>Copy</ContextActionsItem>
          <ContextActionsItem variant="destructive">Delete</ContextActionsItem>
        </ContextActionsContent>
      </ContextActions>
    </View>
  ),
}
