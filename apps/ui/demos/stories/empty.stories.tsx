// @ts-nocheck
import {
  ArrowUpRightIcon,
  CloudIcon,
  FolderSimpleIcon,
  MagnifyingGlassIcon,
} from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect } from "storybook/test"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

const meta = {
  title: "Components/Empty",
  component: Empty,
  decorators: [
    (Story) => (
      <div className="w-[32rem]">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <Empty {...args}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderSimpleIcon />
        </EmptyMedia>
        <EmptyTitle>No projects yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any projects yet. Get started by creating
          your first project.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button>Create project</Button>
          <Button variant="outline">Import project</Button>
        </div>
        <Button variant="link" size="sm" className="text-label-secondary">
          Learn more
          <ArrowUpRightIcon data-icon="inline-end" />
        </Button>
      </EmptyContent>
    </Empty>
  ),
} satisfies Meta<typeof Empty>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText("No projects yet")).toBeVisible()
    await expect(
      canvas.getByRole("button", { name: "Create project" })
    ).toBeVisible()
    await expect(
      canvas.getByRole("button", { name: "Import project" })
    ).toBeVisible()
  },
}

export const Outline: Story = {
  args: { className: "border" },
  render: (args) => (
    <Empty {...args}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CloudIcon />
        </EmptyMedia>
        <EmptyTitle>Cloud storage is empty</EmptyTitle>
        <EmptyDescription>
          Upload files to your cloud storage to access them anywhere.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" size="sm">
          Upload files
        </Button>
      </EmptyContent>
    </Empty>
  ),
}

export const DefaultMedia: Story = {
  render: (args) => (
    <Empty {...args}>
      <EmptyHeader>
        <EmptyMedia>
          <FolderSimpleIcon className="text-label-secondary size-12" />
        </EmptyMedia>
        <EmptyTitle>This folder is empty</EmptyTitle>
        <EmptyDescription>Drag files here to add them.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  ),
}

export const WithSearch: Story = {
  render: (args) => (
    <Empty {...args}>
      <EmptyHeader>
        <EmptyTitle>404 - Not found</EmptyTitle>
        <EmptyDescription>
          The page you&apos;re looking for doesn&apos;t exist. Try searching for
          what you need below.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <InputGroup className="sm:w-3/4">
          <InputGroupInput placeholder="Search pages..." />
          <InputGroupAddon>
            <MagnifyingGlassIcon />
          </InputGroupAddon>
        </InputGroup>
        <EmptyDescription>
          Need help? <a href="#support">Contact support</a>
        </EmptyDescription>
      </EmptyContent>
    </Empty>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText("404 - Not found")).toBeVisible()
    await expect(canvas.getByPlaceholderText("Search pages...")).toBeEnabled()
    await expect(
      canvas.getByRole("link", { name: "Contact support" })
    ).toHaveAttribute("href", "#support")
  },
}
