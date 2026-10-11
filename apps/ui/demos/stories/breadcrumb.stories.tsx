// @ts-nocheck
import { HouseIcon } from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent } from "storybook/test"

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const meta = {
  title: "Components/Breadcrumb",
  component: Breadcrumb,
} satisfies Meta<typeof Breadcrumb>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Breadcrumb {...args}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Projects</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Website redesign</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
  play: async ({ canvas, step }) => {
    await step("labels the trail and marks the current page", async () => {
      const nav = canvas.getByRole("navigation", { name: "breadcrumb" })
      await expect(nav).toBeVisible()
      await expect(canvas.getAllByRole("listitem")).toHaveLength(3)
      await expect(canvas.getByText("Website redesign")).toHaveAttribute(
        "aria-current",
        "page"
      )
    })

    await step("tabs through the links only", async () => {
      await userEvent.tab()
      await expect(canvas.getByRole("link", { name: "Home" })).toHaveFocus()
      await userEvent.tab()
      await expect(canvas.getByRole("link", { name: "Projects" })).toHaveFocus()
    })
  },
}

export const WithHomeIcon: Story = {
  render: (args) => (
    <Breadcrumb {...args}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#" aria-label="Home" className="text-label">
            <HouseIcon weight="fill" />
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Menu</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Main Courses</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Grilled Meatballs</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("link", { name: "Home" })).toBeVisible()
  },
}

export const WithEllipsis: Story = {
  render: (args) => (
    <Breadcrumb {...args}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Settings</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Notifications</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
  play: async ({ canvas, step }) => {
    await step(
      "names the collapsed items and marks the current page",
      async () => {
        await expect(canvas.getByText("More")).toBeInTheDocument()
        await expect(canvas.getByText("Notifications")).toHaveAttribute(
          "aria-current",
          "page"
        )
      }
    )

    await step("skips the static ellipsis when tabbing", async () => {
      await userEvent.tab()
      await expect(canvas.getByRole("link", { name: "Home" })).toHaveFocus()
      await userEvent.tab()
      await expect(canvas.getByRole("link", { name: "Settings" })).toHaveFocus()
    })
  },
}

export const CustomSeparator: Story = {
  render: (args) => (
    <Breadcrumb {...args}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Docs</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <span>/</span>
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Components</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <span>/</span>
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
  play: async ({ canvas, canvasElement, step }) => {
    await step("hides the custom separators from assistive tech", async () => {
      const separators = canvasElement.querySelectorAll(
        '[data-slot="breadcrumb-separator"]'
      )
      await expect(separators).toHaveLength(2)
      for (const separator of separators) {
        await expect(separator).toHaveAttribute("aria-hidden", "true")
        await expect(separator).toHaveTextContent("/")
      }
      await expect(canvas.getAllByRole("listitem")).toHaveLength(3)
    })

    await step("tabs through the links", async () => {
      await userEvent.tab()
      await expect(canvas.getByRole("link", { name: "Docs" })).toHaveFocus()
      await userEvent.tab()
      await expect(
        canvas.getByRole("link", { name: "Components" })
      ).toHaveFocus()
      await expect(canvas.getByText("Breadcrumb")).toHaveAttribute(
        "aria-current",
        "page"
      )
    })
  },
}
