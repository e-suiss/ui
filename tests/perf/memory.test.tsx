import { afterEach, describe, expect, it } from "vitest"
import { page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { createToastManager, Toaster } from "@/components/ui/toast"

import { heapUsed, report, trackListeners, wait } from "./measure"

const CYCLES = 50
const results: Record<string, Record<string, number>> = {}
let tracker: ReturnType<typeof trackListeners> | undefined

afterEach(() => tracker?.stop())

const nodes = () => document.body.querySelectorAll("*").length

async function measure(name: string, cycle: () => Promise<void>) {
  await cycle()
  await wait(300)
  const listenersBefore = tracker?.count() ?? 0
  const nodesBefore = nodes()
  const heapBefore = await heapUsed()
  for (let index = 0; index < CYCLES; index++) await cycle()
  await wait(500)
  const heapMiddle = await heapUsed()
  for (let index = 0; index < CYCLES; index++) await cycle()
  await wait(500)
  const heapAfter = await heapUsed()
  results[name] = {
    firstRunKB: Math.round((heapMiddle - heapBefore) / 1024),
    secondRunKB: Math.round((heapAfter - heapMiddle) / 1024),
    listenersLeft: (tracker?.count() ?? 0) - listenersBefore,
    nodesLeft: nodes() - nodesBefore,
  }
  return results[name]
}

async function closed(selector: string) {
  for (let tries = 0; tries < 100; tries++) {
    if (!document.querySelector(selector)) return
    await wait(20)
  }
  throw new Error(`${selector} did not close`)
}

describe(`opening and closing ${CYCLES} times`, () => {
  it("plain button as a baseline for the test tools", async () => {
    tracker = trackListeners()
    await render(<Button>Open</Button>)
    await measure("baseline", async () => {
      await page.getByRole("button", { name: "Open" }).click()
      await expect
        .element(page.getByRole("button", { name: "Open" }))
        .toBeInTheDocument()
      await userEvent.keyboard("{Escape}")
    })
  })

  it("dialog", async () => {
    tracker = trackListeners()
    await render(
      <Dialog>
        <DialogTrigger render={<Button />}>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Edit profile</DialogTitle>
        </DialogContent>
      </Dialog>
    )
    const result = await measure("dialog", async () => {
      await page.getByRole("button", { name: "Open" }).click()
      await page.getByRole("dialog").element()
      await userEvent.keyboard("{Escape}")
      await closed('[role="dialog"]')
    })
    expect(result.listenersLeft).toBe(0)
    expect(result.nodesLeft).toBeLessThanOrEqual(0)
    expect(result.secondRunKB).toBeLessThan(1024)
  })

  it("popover", async () => {
    tracker = trackListeners()
    await render(
      <Popover>
        <PopoverTrigger render={<Button />}>Open</PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Filters</PopoverTitle>
        </PopoverContent>
      </Popover>
    )
    const result = await measure("popover", async () => {
      await page.getByRole("button", { name: "Open" }).click()
      await page.getByRole("dialog").element()
      await userEvent.keyboard("{Escape}")
      await closed('[data-slot="popover-content"]')
    })
    expect(result.listenersLeft).toBe(0)
    expect(result.nodesLeft).toBeLessThanOrEqual(0)
    expect(result.secondRunKB).toBeLessThan(1024)
  })

  it("toast", async () => {
    tracker = trackListeners()
    const manager = createToastManager()
    await render(<Toaster toastManager={manager} />)
    const result = await measure("toast", async () => {
      const id = manager.add({ title: "Saved", description: "All changes" })
      await expect.element(page.getByText("Saved")).toBeInTheDocument()
      manager.close(id)
      await closed('[data-slot="toast"]')
    })
    expect(result.listenersLeft).toBe(0)
    expect(result.nodesLeft).toBeLessThanOrEqual(0)
    expect(result.secondRunKB).toBeLessThan(1024)
  })

  it("writes the report", async () => {
    await report("memory", results)
  })
})
