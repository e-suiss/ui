// @ts-nocheck
import {
  ArrowUpIcon,
  CheckIcon,
  CopyIcon,
  InfoIcon,
  MagnifyingGlassIcon,
  PaperclipIcon,
  XCircleIcon,
} from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import { expect, userEvent } from "storybook/test"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Kbd } from "@/components/ui/kbd"

const meta = {
  title: "Components/Input Group",
  component: InputGroup,
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <InputGroup {...args}>
      <InputGroupInput placeholder="Search..." />
      <InputGroupAddon>
        <MagnifyingGlassIcon />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">12 results</InputGroupAddon>
    </InputGroup>
  ),
} satisfies Meta<typeof InputGroup>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas, step }) => {
    const input = canvas.getByPlaceholderText("Search...")

    await step("focuses the input from an addon click", async () => {
      await userEvent.click(canvas.getByText("12 results"))
      await expect(input).toHaveFocus()
    })

    await step("accepts typed text", async () => {
      await userEvent.keyboard("button")
      await expect(input).toHaveValue("button")
    })
  },
}

function SearchField() {
  const [query, setQuery] = React.useState("MacBook")
  return (
    <InputGroup>
      <InputGroupInput
        aria-label="Search"
        placeholder="Search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <InputGroupAddon>
        <MagnifyingGlassIcon />
      </InputGroupAddon>
      {query && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            aria-label="Clear search"
            className="text-label-secondary"
            onClick={() => setQuery("")}
          >
            <XCircleIcon weight="fill" />
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  )
}

export const Search: Story = {
  render: () => <SearchField />,
  play: async ({ canvas, step }) => {
    const input = canvas.getByRole("textbox", { name: "Search" })

    await step("clears the query from the clear button", async () => {
      await expect(input).toHaveValue("MacBook")
      await userEvent.click(
        canvas.getByRole("button", { name: "Clear search" })
      )
      await expect(input).toHaveValue("")
      await expect(
        canvas.queryByRole("button", { name: "Clear search" })
      ).toBeNull()
    })

    await step("brings the clear button back after typing", async () => {
      await userEvent.type(input, "iPad")
      await expect(
        canvas.getByRole("button", { name: "Clear search" })
      ).toBeVisible()
    })
  },
}

export const WithText: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <InputGroup {...args}>
        <InputGroupAddon>
          <InputGroupText>$</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="0.00" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>USD</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup {...args}>
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput placeholder="example.com" className="ps-0.5" />
        <InputGroupAddon align="inline-end">
          <InputGroupText>.com</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
  play: async ({ canvas, step }) => {
    const amount = canvas.getByPlaceholderText("0.00")
    const domain = canvas.getByPlaceholderText("example.com")

    await step("focuses each input from its text addons", async () => {
      await userEvent.click(canvas.getByText("USD"))
      await expect(amount).toHaveFocus()
      await userEvent.keyboard("12.50")
      await expect(amount).toHaveValue("12.50")
      await userEvent.click(canvas.getByText("https://"))
      await expect(domain).toHaveFocus()
      await userEvent.keyboard("esuiss")
      await expect(domain).toHaveValue("esuiss")
    })
  },
}

export const WithButtons: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <InputGroup {...args}>
        <InputGroupInput
          defaultValue="https://esuiss.dev/invite/x7k2"
          aria-label="Invite link"
          readOnly
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon-xs" aria-label="Copy">
            <CopyIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup {...args}>
        <InputGroupInput placeholder="Enter your email" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton variant="secondary">Subscribe</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup {...args}>
        <InputGroupInput placeholder="Username" defaultValue="janedoe" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon-xs" aria-label="Info">
            <InfoIcon />
          </InputGroupButton>
          <CheckIcon className="text-green-600" />
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
  play: async ({ canvas, step }) => {
    await step(
      "names the icon buttons and keeps the link read-only",
      async () => {
        await expect(canvas.getByRole("button", { name: "Copy" })).toBeVisible()
        await expect(canvas.getByRole("button", { name: "Info" })).toBeVisible()
        await expect(
          canvas.getByDisplayValue("https://esuiss.dev/invite/x7k2")
        ).toHaveAttribute("readonly")
      }
    )

    await step("moves focus from the input to its button", async () => {
      await userEvent.click(canvas.getByPlaceholderText("Enter your email"))
      await userEvent.tab()
      await expect(
        canvas.getByRole("button", { name: "Subscribe" })
      ).toHaveFocus()
    })
  },
}

export const ButtonSizes: Story = {
  render: (args) => (
    <InputGroup {...args}>
      <InputGroupInput placeholder="Type a command..." />
      <InputGroupAddon align="inline-end">
        <InputGroupButton size="xs">Extra small</InputGroupButton>
        <InputGroupButton size="icon-xs" aria-label="Copy">
          <CopyIcon />
        </InputGroupButton>
        <InputGroupButton size="icon-sm" aria-label="Attach">
          <PaperclipIcon />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
  play: async ({ canvas, step }) => {
    const input = canvas.getByPlaceholderText("Type a command...")

    await step("accepts typed text", async () => {
      await userEvent.click(input)
      await userEvent.keyboard("deploy")
      await expect(input).toHaveValue("deploy")
    })

    await step("tabs through every button size", async () => {
      for (const name of ["Extra small", "Copy", "Attach"]) {
        await userEvent.tab()
        await expect(canvas.getByRole("button", { name })).toHaveFocus()
      }
    })
  },
}

export const WithKbd: Story = {
  render: (args) => (
    <InputGroup {...args}>
      <InputGroupInput placeholder="Search documentation..." />
      <InputGroupAddon>
        <MagnifyingGlassIcon />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <Kbd mod>K</Kbd>
      </InputGroupAddon>
    </InputGroup>
  ),
  play: async ({ canvas, canvasElement, step }) => {
    const input = canvas.getByPlaceholderText("Search documentation...")
    const kbd = canvasElement.querySelector<HTMLElement>('[data-slot="kbd"]')
    const addon = kbd?.closest<HTMLElement>('[data-slot="input-group-addon"]')

    await step("focuses the input from the shortcut hint", async () => {
      await expect(kbd).toHaveTextContent("K")
      await expect(addon).toHaveAttribute("data-align", "inline-end")
      if (addon) await userEvent.click(addon)
      await expect(input).toHaveFocus()
      await userEvent.keyboard("tabs")
      await expect(input).toHaveValue("tabs")
    })
  },
}

export const BlockAddons: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <InputGroup {...args}>
        <InputGroupInput placeholder="Enter a title" />
        <InputGroupAddon align="block-start">
          <InputGroupText>Title</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup {...args}>
        <InputGroupInput placeholder="Enter an amount" />
        <InputGroupAddon align="block-end">
          <InputGroupText>Minimum payment is $5.00</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
  play: async ({ canvas, step }) => {
    const title = canvas.getByPlaceholderText("Enter a title")
    const amount = canvas.getByPlaceholderText("Enter an amount")

    await step("places the addons above and below the inputs", async () => {
      const titleAddon = canvas
        .getByText("Title")
        .closest('[data-slot="input-group-addon"]')
      const amountAddon = canvas
        .getByText("Minimum payment is $5.00")
        .closest('[data-slot="input-group-addon"]')
      await expect(titleAddon).toHaveAttribute("data-align", "block-start")
      await expect(amountAddon).toHaveAttribute("data-align", "block-end")
      await expect(
        titleAddon?.getBoundingClientRect().bottom ?? 0
      ).toBeLessThanOrEqual(title.getBoundingClientRect().top + 1)
      await expect(
        amountAddon?.getBoundingClientRect().top ?? 0
      ).toBeGreaterThanOrEqual(amount.getBoundingClientRect().bottom - 1)
    })

    await step("focuses each input from its block addon", async () => {
      await userEvent.click(canvas.getByText("Title"))
      await expect(title).toHaveFocus()
      await userEvent.keyboard("Invoice")
      await expect(title).toHaveValue("Invoice")
      await userEvent.click(canvas.getByText("Minimum payment is $5.00"))
      await expect(amount).toHaveFocus()
      await userEvent.keyboard("25")
      await expect(amount).toHaveValue("25")
    })
  },
}

export const WithTextarea: Story = {
  render: (args) => (
    <InputGroup {...args}>
      <InputGroupTextarea placeholder="Ask, search, or chat..." />
      <InputGroupAddon align="block-end">
        <InputGroupButton size="icon-xs" aria-label="Attach file">
          <PaperclipIcon />
        </InputGroupButton>
        <InputGroupText className="ms-auto">52% used</InputGroupText>
        <InputGroupButton
          variant="default"
          size="icon-xs"
          className="rounded-full"
          aria-label="Send"
        >
          <ArrowUpIcon />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
  play: async ({ canvas, step }) => {
    const textarea = canvas.getByPlaceholderText("Ask, search, or chat...")

    await step("accepts multi-line text", async () => {
      await userEvent.type(textarea, "Hi{Shift>}{Enter}{/Shift}there")
      await expect(textarea).toHaveValue("Hi\nthere")
    })

    await step("names the action buttons", async () => {
      await expect(
        canvas.getByRole("button", { name: "Attach file" })
      ).toBeVisible()
      await expect(canvas.getByRole("button", { name: "Send" })).toBeVisible()
    })
  },
}

export const Invalid: Story = {
  render: (args) => (
    <InputGroup {...args}>
      <InputGroupInput defaultValue="jane@" aria-label="Email" aria-invalid />
      <InputGroupAddon align="inline-end">
        <InfoIcon className="text-danger" />
      </InputGroupAddon>
    </InputGroup>
  ),
  play: async ({ canvas, step }) => {
    await step("flags the input as invalid", async () => {
      await expect(canvas.getByRole("textbox", { name: "Email" })).toBeInvalid()
    })
  },
}

export const Disabled: Story = {
  render: (args) => (
    <InputGroup {...args} data-disabled="true">
      <InputGroupInput placeholder="Search..." disabled />
      <InputGroupAddon>
        <MagnifyingGlassIcon />
      </InputGroupAddon>
    </InputGroup>
  ),
  play: async ({ canvas, step }) => {
    const input = canvas.getByPlaceholderText("Search...")

    await step("ignores typing while disabled", async () => {
      await expect(input).toBeDisabled()
      await userEvent.type(input, "abc")
      await expect(input).toHaveValue("")
    })
  },
}
