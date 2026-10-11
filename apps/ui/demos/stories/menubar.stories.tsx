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
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar"

const NEW_WINDOW = /^New window/
const PASTE = /^Paste/

const meta = {
  title: "Components/Menubar",
  component: Menubar,
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div className="min-h-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Menubar>

export default meta

type Story = StoryObj<typeof meta>

function MenubarExample({ fileOpen = false }: { fileOpen?: boolean }) {
  return (
    <>
      <MenubarMenu defaultOpen={fileOpen}>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarItem>
              New tab
              <MenubarShortcut mod>T</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              New window
              <MenubarShortcut mod>N</MenubarShortcut>
            </MenubarItem>
            <MenubarItem disabled>New private window</MenubarItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Share</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Email link</MenubarItem>
              <MenubarItem>Messages</MenubarItem>
              <MenubarItem>Notes</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>
            Print
            <MenubarShortcut mod>P</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarItem>
              <ScissorsIcon />
              Cut
              <MenubarShortcut mod>X</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              <CopyIcon />
              Copy
              <MenubarShortcut mod>C</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              <ClipboardTextIcon />
              Paste
              <MenubarShortcut mod>V</MenubarShortcut>
            </MenubarItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarItem variant="destructive">
            <TrashIcon />
            Delete
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarCheckboxItem defaultChecked>
              Show bookmarks bar
            </MenubarCheckboxItem>
            <MenubarCheckboxItem>Show full URLs</MenubarCheckboxItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarItem inset>Reload</MenubarItem>
          <MenubarItem inset>Toggle full screen</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Profiles</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarLabel>Switch profile</MenubarLabel>
            <MenubarRadioGroup defaultValue="alex">
              <MenubarRadioItem value="alex">Alex</MenubarRadioItem>
              <MenubarRadioItem value="sam">Sam</MenubarRadioItem>
              <MenubarRadioItem value="taylor">Taylor</MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarItem inset>Manage profiles</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </>
  )
}

export const Default: Story = {
  render: (args) => (
    <Menubar {...args}>
      <MenubarExample />
    </Menubar>
  ),
  play: async ({ canvas, step }) => {
    const file = canvas.getByRole("menuitem", { name: "File" })
    const edit = canvas.getByRole("menuitem", { name: "Edit" })

    await step("opens a menu from its trigger", async () => {
      await expect(canvas.getByRole("menubar")).toBeVisible()
      await userEvent.click(file)
      await expect(
        await screen.findByRole("menuitem", { name: NEW_WINDOW })
      ).toBeInTheDocument()
      await expect(file).toHaveAttribute("aria-expanded", "true")
      await expect(
        screen.getByRole("menuitem", { name: "New private window" })
      ).toHaveAttribute("aria-disabled", "true")
    })

    await step("moves to the next menu with ArrowRight", async () => {
      await userEvent.keyboard("{ArrowRight}")
      await expect(
        await screen.findByRole("menuitem", { name: PASTE })
      ).toBeInTheDocument()
      await waitFor(() =>
        expect(screen.queryByRole("menuitem", { name: NEW_WINDOW })).toBeNull()
      )
      await expect(edit).toHaveAttribute("aria-expanded", "true")
    })

    await step("closes with Escape and returns focus", async () => {
      await userEvent.keyboard("{Escape}")
      await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
      await expect(edit).toHaveFocus()
    })

    await step("toggles a checkbox item", async () => {
      await userEvent.click(canvas.getByRole("menuitem", { name: "View" }))
      const urls = await screen.findByRole("menuitemcheckbox", {
        name: "Show full URLs",
      })
      await expect(urls).toHaveAttribute("aria-checked", "false")
      await userEvent.click(urls)
      await expect(urls).toHaveAttribute("aria-checked", "true")
      await expect(
        screen.getByRole("menuitemcheckbox", { name: "Show bookmarks bar" })
      ).toHaveAttribute("aria-checked", "true")
      await userEvent.keyboard("{Escape}")
      await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
    })

    await step("switches the radio item", async () => {
      await userEvent.click(canvas.getByRole("menuitem", { name: "Profiles" }))
      const sam = await screen.findByRole("menuitemradio", { name: "Sam" })
      await userEvent.click(sam)
      await expect(sam).toHaveAttribute("aria-checked", "true")
      await expect(
        screen.getByRole("menuitemradio", { name: "Alex" })
      ).toHaveAttribute("aria-checked", "false")
      await userEvent.keyboard("{Escape}")
    })
  },
}

export const OpenByDefault: Story = {
  render: (args) => (
    <Menubar {...args}>
      <MenubarExample fileOpen />
    </Menubar>
  ),
  play: async ({ step }) => {
    await step("opens the submenu with ArrowRight", async () => {
      const share = await screen.findByRole("menuitem", { name: "Share" })
      share.focus()
      await userEvent.keyboard("{ArrowRight}")
      await expect(
        await screen.findByRole("menuitem", { name: "Email link" })
      ).toBeInTheDocument()
    })
  },
}

export const Disabled: Story = {
  args: { disabled: true },
  render: Default.render,
  play: async ({ canvas, step }) => {
    await step("does not open menus while disabled", async () => {
      await userEvent.click(canvas.getByRole("menuitem", { name: "File" }), {
        pointerEventsCheck: 0,
      })
      await expect(screen.queryByRole("menu")).toBeNull()
    })
  },
}
