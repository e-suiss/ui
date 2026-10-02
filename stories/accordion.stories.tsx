import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const items = [
  {
    value: "shipping",
    title: "How long does shipping take?",
    content:
      "Orders ship within two business days and arrive in three to five days.",
  },
  {
    value: "returns",
    title: "Can I return an item?",
    content:
      "Items can be returned within 14 days of delivery for a full refund.",
  },
  {
    value: "support",
    title: "How do I contact support?",
    content:
      "Reach the support team from the help center, available around the clock.",
  },
]

const meta = {
  title: "Components/Accordion",
  component: Accordion,
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Accordion>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Accordion {...args}>
      {items.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
}

export const Filled: Story = {
  args: { variant: "filled" },
  render: (args) => (
    <Accordion {...args}>
      {items.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
}

export const OpenByDefault: Story = {
  ...Default,
  args: { defaultValue: ["shipping"] },
}

export const Multiple: Story = {
  ...Default,
  args: { multiple: true, defaultValue: ["shipping", "returns"] },
}
