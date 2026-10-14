// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor } from "storybook/test"

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
  play: async ({ canvas, step }) => {
    const shipping = canvas.getByRole("button", {
      name: "How long does shipping take?",
    })
    const returns = canvas.getByRole("button", {
      name: "Can I return an item?",
    })

    await step("starts with every panel collapsed", async () => {
      await expect(shipping).toHaveAttribute("aria-expanded", "false")
      await expect(returns).toHaveAttribute("aria-expanded", "false")
    })

    await step("expands a panel on click", async () => {
      await userEvent.click(shipping)
      await expect(shipping).toHaveAttribute("aria-expanded", "true")
      await expect(
        await canvas.findByText(
          "Orders ship within two business days and arrive in three to five days."
        )
      ).toBeVisible()
    })

    await step("collapses the open panel when another opens", async () => {
      await userEvent.click(returns)
      await expect(returns).toHaveAttribute("aria-expanded", "true")
      await waitFor(() =>
        expect(shipping).toHaveAttribute("aria-expanded", "false")
      )
    })

    await step("toggles from the keyboard", async () => {
      const support = canvas.getByRole("button", {
        name: "How do I contact support?",
      })
      await userEvent.tab()
      await expect(support).toHaveFocus()
      await userEvent.keyboard("{Enter}")
      await expect(support).toHaveAttribute("aria-expanded", "true")
      await userEvent.keyboard(" ")
      await expect(support).toHaveAttribute("aria-expanded", "false")
    })
  },
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
  play: async ({ canvas, step }) => {
    const returns = canvas.getByRole("button", {
      name: "Can I return an item?",
    })

    await step("starts with every panel collapsed", async () => {
      for (const item of items) {
        await expect(
          canvas.getByRole("button", { name: item.title })
        ).toHaveAttribute("aria-expanded", "false")
      }
    })

    await step("expands a panel on click", async () => {
      await userEvent.click(returns)
      await expect(returns).toHaveAttribute("aria-expanded", "true")
      await expect(
        await canvas.findByText(
          "Items can be returned within 14 days of delivery for a full refund."
        )
      ).toBeVisible()
    })

    await step("collapses it on a second click", async () => {
      await userEvent.click(returns)
      await expect(returns).toHaveAttribute("aria-expanded", "false")
      await waitFor(() =>
        expect(
          canvas.queryByText(
            "Items can be returned within 14 days of delivery for a full refund."
          )
        ).toBeNull()
      )
    })
  },
}

export const OpenByDefault: Story = {
  args: { defaultValue: ["shipping"] },
  render: Default.render,
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("button", { name: "How long does shipping take?" })
    ).toHaveAttribute("aria-expanded", "true")
    await expect(
      canvas.getByText(
        "Orders ship within two business days and arrive in three to five days."
      )
    ).toBeVisible()
  },
}

export const Multiple: Story = {
  args: { multiple: true, defaultValue: ["shipping", "returns"] },
  render: Default.render,
  play: async ({ canvas, step }) => {
    const shipping = canvas.getByRole("button", {
      name: "How long does shipping take?",
    })
    const support = canvas.getByRole("button", {
      name: "How do I contact support?",
    })

    await step("keeps several panels open at once", async () => {
      await userEvent.click(support)
      await expect(support).toHaveAttribute("aria-expanded", "true")
      await expect(shipping).toHaveAttribute("aria-expanded", "true")
    })

    await step("closes only the panel that was clicked", async () => {
      await userEvent.click(shipping)
      await expect(shipping).toHaveAttribute("aria-expanded", "false")
      await expect(support).toHaveAttribute("aria-expanded", "true")
    })
  },
}
