// @ts-nocheck
import {
  ClipboardTextIcon,
  CopyIcon,
  ScissorsIcon,
  TrashIcon,
} from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, screen, userEvent, waitFor } from "storybook/test"

import {
  ActionBar,
  ActionBarContent,
  ActionBarItem,
  ActionBarLabel,
  ActionBarMenu,
  ActionBarSeparator,
  ActionBarShortcut,
  ActionBarTrigger,
} from "@/components/patterns/action-bar"

function FileMenu({ defaultOpen }: { defaultOpen?: boolean }) {
  return (
    <ActionBarMenu defaultOpen={defaultOpen}>
      <ActionBarTrigger>File</ActionBarTrigger>
      <ActionBarContent>
        <ActionBarItem>
          New tab
          <ActionBarShortcut mod>T</ActionBarShortcut>
        </ActionBarItem>
        <ActionBarItem>
          New window
          <ActionBarShortcut mod>N</ActionBarShortcut>
        </ActionBarItem>
        <ActionBarItem disabled>New incognito window</ActionBarItem>
        <ActionBarSeparator />
        <ActionBarItem>
          Print
          <ActionBarShortcut mod>P</ActionBarShortcut>
        </ActionBarItem>
      </ActionBarContent>
    </ActionBarMenu>
  )
}

function EditMenu({ withIcons = false }: { withIcons?: boolean }) {
  return (
    <ActionBarMenu>
      <ActionBarTrigger>Edit</ActionBarTrigger>
      <ActionBarContent>
        <ActionBarItem>
          {withIcons && <ScissorsIcon />}
          Cut
          <ActionBarShortcut mod>X</ActionBarShortcut>
        </ActionBarItem>
        <ActionBarItem>
          {withIcons && <CopyIcon />}
          Copy
          <ActionBarShortcut mod>C</ActionBarShortcut>
        </ActionBarItem>
        <ActionBarItem>
          {withIcons && <ClipboardTextIcon />}
          Paste
          <ActionBarShortcut mod>V</ActionBarShortcut>
        </ActionBarItem>
        <ActionBarSeparator />
        <ActionBarItem variant="destructive">
          {withIcons && <TrashIcon />}
          Delete
        </ActionBarItem>
      </ActionBarContent>
    </ActionBarMenu>
  )
}

function ViewMenu() {
  return (
    <ActionBarMenu>
      <ActionBarTrigger>View</ActionBarTrigger>
      <ActionBarContent>
        <ActionBarLabel>Appearance</ActionBarLabel>
        <ActionBarItem>Zoom in</ActionBarItem>
        <ActionBarItem>Zoom out</ActionBarItem>
        <ActionBarItem>Actual size</ActionBarItem>
      </ActionBarContent>
    </ActionBarMenu>
  )
}

const meta = {
  title: "Patterns/Action Bar",
  component: ActionBar,
  parameters: { layout: "padded" },
  decorators: [
    (Story) => (
      <div className="min-h-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ActionBar>

export default meta

type Story = StoryObj<typeof meta>

const NEW_TAB = /New tab/
const COPY = /Copy/
const PRINT = /Print/
const CUT = /Cut/
const DELETE = /Delete/

export const Default: Story = {
  render: (args) => (
    <ActionBar {...args}>
      <FileMenu />
      <EditMenu />
      <ViewMenu />
    </ActionBar>
  ),
  play: async ({ canvas, step }) => {
    const file = canvas.getByRole("menuitem", { name: "File" })
    const edit = canvas.getByRole("menuitem", { name: "Edit" })

    await step("lays the menus out in a menubar", async () => {
      await expect(canvas.getByRole("menubar")).toBeVisible()
      await expect(canvas.getByRole("menuitem", { name: "View" })).toBeVisible()
    })

    await step("opens a menu with its disabled entry", async () => {
      await userEvent.click(file)
      await screen.findByRole("menu")
      await waitFor(() =>
        expect(screen.getByRole("menuitem", { name: NEW_TAB })).toBeVisible()
      )
      await expect(
        screen.getByRole("menuitem", { name: "New incognito window" })
      ).toHaveAttribute("aria-disabled", "true")
    })

    await step("hovering another trigger switches menus", async () => {
      await userEvent.hover(edit)
      await expect(
        await screen.findByRole("menuitem", { name: COPY })
      ).toBeInTheDocument()
      await waitFor(() =>
        expect(screen.queryByRole("menuitem", { name: NEW_TAB })).toBeNull()
      )
    })

    await step("running an action closes the menu", async () => {
      await userEvent.click(screen.getByRole("menuitem", { name: COPY }))
      await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
    })

    await step("Escape closes and returns focus to the trigger", async () => {
      await userEvent.click(file)
      await screen.findByRole("menu")
      await userEvent.keyboard("{Escape}")
      await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
      await waitFor(() => expect(file).toHaveFocus())
    })
  },
}

export const WithIcons: Story = {
  render: (args) => (
    <ActionBar {...args}>
      <FileMenu />
      <EditMenu withIcons />
      <ViewMenu />
    </ActionBar>
  ),
  play: async ({ canvas, step }) => {
    const edit = canvas.getByRole("menuitem", { name: "Edit" })

    await step("shows an icon beside each edit action", async () => {
      await userEvent.click(edit)
      await screen.findByRole("menu")
      const cut = await screen.findByRole("menuitem", { name: CUT })
      await waitFor(() => expect(cut).toBeVisible())
      for (const name of [CUT, COPY, DELETE]) {
        await expect(
          screen.getByRole("menuitem", { name }).querySelector("svg")
        ).not.toBeNull()
      }
    })

    await step("running an action closes the menu", async () => {
      await userEvent.click(screen.getByRole("menuitem", { name: DELETE }))
      await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
    })
  },
}

export const OpenByDefault: Story = {
  render: (args) => (
    <ActionBar {...args} defaultOpen>
      <FileMenu defaultOpen />
      <EditMenu />
      <ViewMenu />
    </ActionBar>
  ),
  play: async ({ step }) => {
    await step("renders the first menu open and runs an action", async () => {
      await userEvent.click(
        await screen.findByRole("menuitem", { name: PRINT })
      )
      await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
    })
  },
}

export const NotDismissible: Story = {
  render: (args) => (
    <ActionBar {...args} dismissible={false}>
      <FileMenu />
      <EditMenu />
    </ActionBar>
  ),
  play: async ({ canvas, step }) => {
    const file = canvas.getByRole("menuitem", { name: "File" })

    await step("opens a menu from the menubar", async () => {
      await expect(canvas.getByRole("menubar")).toBeVisible()
      await userEvent.click(file)
      await screen.findByRole("menu")
      await waitFor(() =>
        expect(screen.getByRole("menuitem", { name: NEW_TAB })).toBeVisible()
      )
    })

    await step("Escape closes and returns focus to the trigger", async () => {
      await userEvent.keyboard("{Escape}")
      await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
      await waitFor(() => expect(file).toHaveFocus())
    })

    await step("running an action closes the menu", async () => {
      await userEvent.click(canvas.getByRole("menuitem", { name: "Edit" }))
      await userEvent.click(await screen.findByRole("menuitem", { name: COPY }))
      await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
    })
  },
}

export const CustomLabels: Story = {
  render: (args) => (
    <ActionBar {...args} moreLabel="Document actions" cancelLabel="Close">
      <FileMenu />
      <EditMenu />
    </ActionBar>
  ),
}

export const Floating: Story = {
  render: (args) => (
    <ActionBar {...args} floating>
      <FileMenu />
      <EditMenu />
      <ViewMenu />
    </ActionBar>
  ),
}
