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

export const Default: Story = {}

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
}

export const WithButtons: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <InputGroup {...args}>
        <InputGroupInput
          defaultValue="https://esuiss.dev/invite/x7k2"
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
}

export const Invalid: Story = {
  render: (args) => (
    <InputGroup {...args}>
      <InputGroupInput defaultValue="jane@" aria-invalid />
      <InputGroupAddon align="inline-end">
        <InfoIcon className="text-danger" />
      </InputGroupAddon>
    </InputGroup>
  ),
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
}
