import * as React from "react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import {
  CommandPalette,
  CommandPaletteContent,
  CommandPaletteTrigger,
} from "@/components/patterns/command-palette"
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command"
import { isMacPlatform } from "@/hooks/use-platform"

afterEach(async () => {
  await page.viewport(1280, 800)
})

type PaletteProps = React.ComponentProps<typeof CommandPalette> & {
  onRun?: (value: string) => void
  content?: Omit<React.ComponentProps<typeof CommandPaletteContent>, "children">
}

function Palette({ onRun, content, ...props }: PaletteProps) {
  return (
    <CommandPalette {...props}>
      <CommandPaletteTrigger>Search</CommandPaletteTrigger>
      <CommandPaletteContent {...content}>
        <CommandInput placeholder="Type a command" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem onSelect={onRun}>Calendar</CommandItem>
            <CommandItem disabled onSelect={onRun}>
              Calculator
            </CommandItem>
            <CommandItem onSelect={onRun}>Search emoji</CommandItem>
          </CommandGroup>
          <CommandGroup heading="Settings">
            <CommandItem onSelect={onRun}>
              Profile
              <CommandShortcut>P</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={onRun}>Billing</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandPaletteContent>
    </CommandPalette>
  )
}

const trigger = () => page.getByRole("button", { name: "Search" })
const dialog = () => page.getByRole("dialog")
const input = () => page.getByRole("combobox")
const option = (name: string | RegExp) => page.getByRole("option", { name })
const PROFILE = /^Profile/

function visibleOptions() {
  return Array.from(
    document.querySelectorAll<HTMLElement>("[cmdk-item]"),
    (item) => item.textContent
  )
}

function selectedOption() {
  return document.querySelector<HTMLElement>("[cmdk-item][data-selected=true]")
    ?.textContent
}

const modifier = () => (isMacPlatform() ? "Meta" : "Control")

async function hotkey(key: string) {
  await userEvent.keyboard(`{${modifier()}>}${key}{/${modifier()}}`)
}

const wait = (ms: number) =>
  new Promise((resolve) => window.setTimeout(resolve, ms))

describe("CommandPalette on desktop", () => {
  it("opens a dialog from the trigger with the search field focused", async () => {
    await render(<Palette />)
    await expect.element(dialog()).not.toBeInTheDocument()
    await trigger().click()
    await expect.element(dialog()).toBeVisible()
    await expect.element(dialog()).toHaveAccessibleName("Command Palette")
    await expect
      .element(dialog())
      .toHaveAccessibleDescription("Search for a command to run...")
    await expect.element(input()).toHaveFocus()
    expect(visibleOptions()).toEqual([
      "Calendar",
      "Calculator",
      "Search emoji",
      "ProfileP",
      "Billing",
    ])
  })

  it("uses a custom title and description", async () => {
    await render(
      <Palette
        defaultOpen
        content={{ title: "Go to", description: "Jump anywhere" }}
      />
    )
    await expect.element(dialog()).toHaveAccessibleName("Go to")
    await expect.element(dialog()).toHaveAccessibleDescription("Jump anywhere")
  })

  it("filters the commands as you type and shows the empty state", async () => {
    await render(<Palette defaultOpen />)
    await expect.element(input()).toHaveFocus()
    await userEvent.keyboard("cal")
    await expect
      .poll(() => visibleOptions().sort())
      .toEqual(["Calculator", "Calendar"])
    await expect.element(page.getByText("Settings")).not.toBeVisible()
    await userEvent.fill(input(), "zzz")
    await expect.poll(visibleOptions).toEqual([])
    await expect.element(page.getByText("No results found.")).toBeVisible()
    await userEvent.clear(input())
    await expect.poll(visibleOptions).toHaveLength(5)
  })

  it("moves the highlight with the arrow keys and skips disabled items", async () => {
    await render(<Palette defaultOpen />)
    await expect.element(input()).toHaveFocus()
    await expect.poll(selectedOption).toBe("Calendar")
    await userEvent.keyboard("{ArrowDown}")
    await expect.poll(selectedOption).toBe("Search emoji")
    await userEvent.keyboard("{ArrowDown}")
    await expect.poll(selectedOption).toBe("ProfileP")
    await userEvent.keyboard("{ArrowUp}{ArrowUp}")
    await expect.poll(selectedOption).toBe("Calendar")
    await expect
      .element(option("Calculator"))
      .toHaveAttribute("aria-disabled", "true")
  })

  it("runs the highlighted command with Enter and the clicked one on click", async () => {
    const onRun = vi.fn()
    await render(<Palette defaultOpen onRun={onRun} />)
    await expect.element(input()).toHaveFocus()
    await userEvent.keyboard("bil")
    await expect.poll(selectedOption).toBe("Billing")
    await userEvent.keyboard("{Enter}")
    expect(onRun).toHaveBeenLastCalledWith("Billing")
    await expect.element(option(PROFILE)).not.toBeInTheDocument()
    await userEvent.clear(input())
    await option(PROFILE).click()
    expect(onRun).toHaveBeenLastCalledWith("ProfileP")
  })

  it("does not run a disabled command", async () => {
    const onRun = vi.fn()
    await render(<Palette defaultOpen onRun={onRun} />)
    await option("Calculator").click({ force: true })
    await wait(100)
    expect(onRun).not.toHaveBeenCalled()
  })

  it("closes with Escape and returns focus to the trigger", async () => {
    const onOpenChange = vi.fn()
    await render(<Palette onOpenChange={onOpenChange} />)
    await trigger().click()
    await expect.element(input()).toHaveFocus()
    expect(onOpenChange).toHaveBeenLastCalledWith(true)
    await userEvent.keyboard("{Escape}")
    await expect.element(dialog()).not.toBeInTheDocument()
    expect(onOpenChange).toHaveBeenLastCalledWith(false)
    await expect.element(trigger()).toHaveFocus()
  })

  it("toggles with the modifier K hotkey", async () => {
    const onOpenChange = vi.fn()
    await render(<Palette onOpenChange={onOpenChange} />)
    await hotkey("k")
    await expect.element(dialog()).toBeVisible()
    expect(onOpenChange).toHaveBeenLastCalledWith(true)
    await expect.element(input()).toHaveFocus()
    await hotkey("k")
    await expect.element(dialog()).not.toBeInTheDocument()
    expect(onOpenChange).toHaveBeenLastCalledWith(false)
  })

  it("ignores the key without the modifier", async () => {
    await render(<Palette />)
    await trigger().hover()
    await userEvent.keyboard("k")
    await wait(200)
    await expect.element(dialog()).not.toBeInTheDocument()
  })

  it("uses a custom hotkey", async () => {
    await render(<Palette hotkey="j" />)
    await hotkey("k")
    await wait(200)
    await expect.element(dialog()).not.toBeInTheDocument()
    await hotkey("J")
    await expect.element(dialog()).toBeVisible()
  })

  it("turns the hotkey off", async () => {
    await render(<Palette hotkey={false} />)
    await hotkey("k")
    await wait(200)
    await expect.element(dialog()).not.toBeInTheDocument()
  })

  it("follows a controlled open state", async () => {
    const onOpenChange = vi.fn()
    function Controlled() {
      const [open, setOpen] = React.useState(true)
      return (
        <>
          <span>{open ? "Shown" : "Hidden"}</span>
          <Palette
            open={open}
            onOpenChange={(next) => {
              onOpenChange(next)
              setOpen(next)
            }}
          />
        </>
      )
    }
    await render(<Controlled />)
    await expect.element(dialog()).toBeVisible()
    await userEvent.keyboard("{Escape}")
    await expect.element(dialog()).not.toBeInTheDocument()
    await expect.element(page.getByText("Hidden")).toBeInTheDocument()
    await hotkey("k")
    await expect.element(dialog()).toBeVisible()
    await expect.element(page.getByText("Shown")).toBeInTheDocument()
    expect(onOpenChange.mock.calls).toEqual([[false], [true]])
  })

  it("stays closed when the controlled state does not change", async () => {
    const onOpenChange = vi.fn()
    await render(<Palette open={false} onOpenChange={onOpenChange} />)
    await trigger().click()
    await hotkey("k")
    await wait(200)
    await expect.element(dialog()).not.toBeInTheDocument()
    expect(onOpenChange.mock.calls).toEqual([[true], [true]])
  })

  it("renders an icon close button or a labelled one", async () => {
    const { rerender } = await render(
      <Palette defaultOpen content={{ showCloseButton: true }} />
    )
    const close = page.getByRole("button", { name: "Close" })
    await expect.element(close).toBeVisible()
    await close.click()
    await expect.element(dialog()).not.toBeInTheDocument()
    await rerender(
      <Palette
        defaultOpen
        content={{ showCloseButton: true, closeLabel: "Cancel" }}
      />
    )
    await trigger().click()
    await expect
      .element(page.getByRole("button", { name: "Cancel" }))
      .toBeVisible()
  })

  it("has no close button by default", async () => {
    await render(<Palette defaultOpen />)
    await expect.element(dialog()).toBeVisible()
    await expect
      .element(page.getByRole("button", { name: "Close" }))
      .not.toBeInTheDocument()
  })
})

describe("CommandPalette on mobile", () => {
  it("opens a drawer from the trigger", async () => {
    await page.viewport(390, 844)
    await render(<Palette />)
    await trigger().click()
    await expect.element(dialog()).toBeVisible()
    await expect.element(dialog()).toHaveAccessibleName("Command Palette")
    expect(
      document.querySelector("[data-slot=drawer-swipe-handle]")
    ).not.toBeNull()
    await expect.element(input()).toBeVisible()
    await expect.element(page.getByText("P", { exact: true })).not.toBeVisible()
  })

  it("filters and runs commands in the drawer", async () => {
    const onRun = vi.fn()
    await page.viewport(390, 844)
    await render(<Palette defaultOpen onRun={onRun} />)
    await input().click()
    await userEvent.keyboard("emo")
    await expect.poll(visibleOptions).toEqual(["Search emoji"])
    await userEvent.keyboard("{Enter}")
    expect(onRun).toHaveBeenLastCalledWith("Search emoji")
  })

  it("toggles the drawer with the hotkey", async () => {
    await page.viewport(390, 844)
    await render(<Palette />)
    await hotkey("k")
    await expect.element(dialog()).toBeVisible()
    await hotkey("k")
    await expect.element(dialog()).not.toBeInTheDocument()
  })

  it("closes with Escape and the close button", async () => {
    const onOpenChange = vi.fn()
    await page.viewport(390, 844)
    await render(
      <Palette
        onOpenChange={onOpenChange}
        content={{ showCloseButton: true, closeLabel: "Done" }}
      />
    )
    await trigger().click()
    await expect.element(dialog()).toBeVisible()
    await userEvent.keyboard("{Escape}")
    await expect.element(dialog()).not.toBeInTheDocument()
    await trigger().click()
    await page.getByRole("button", { name: "Done" }).click()
    await expect.element(dialog()).not.toBeInTheDocument()
    expect(onOpenChange.mock.calls).toEqual([[true], [false], [true], [false]])
  })
})
