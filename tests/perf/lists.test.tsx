import { afterEach, describe, expect, it } from "vitest"
import { page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  MessageScroller,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { frameStats, report, throttle, wait } from "./measure"

const COUNT = 1000
const ITEMS = Array.from({ length: COUNT }, (_, index) => ({
  id: `item-${index}`,
  label: `Item ${index}`,
}))
const results: Record<string, Record<string, number>> = {}

afterEach(() => throttle(1))

const nextFrame = () =>
  new Promise((resolve) => requestAnimationFrame(() => resolve(undefined)))

async function timed(action: () => Promise<unknown>) {
  const start = performance.now()
  await action()
  await nextFrame()
  return Math.round(performance.now() - start)
}

async function scrollThrough(element: Element) {
  const stats = await frameStats(async () => {
    for (let step = 1; step <= 30; step++) {
      element.scrollTop = (element.scrollHeight * step) / 30
      await nextFrame()
    }
  })
  return {
    scrollP95: stats.p95,
    scrollWorst: stats.worst,
    longFrames: stats.long,
  }
}

describe(`lists with ${COUNT} items at 4x CPU`, () => {
  it("table", async () => {
    await throttle(4)
    const mount = await timed(() =>
      render(
        <div data-testid="frame" className="h-96 w-[40rem] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ITEMS.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.label}</TableCell>
                  <TableCell>Active</TableCell>
                  <TableCell>$120.00</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )
    )
    const scroll = await scrollThrough(page.getByTestId("frame").element())
    results.table = { mount, ...scroll }
    expect(mount).toBeLessThan(1500)
    expect(scroll.longFrames).toBeLessThanOrEqual(2)
    expect(document.querySelectorAll("tbody tr")).toHaveLength(COUNT)
  })

  it("message scroller", async () => {
    await throttle(4)
    const mount = await timed(() =>
      render(
        <div className="h-96 w-96">
          <MessageScrollerProvider>
            <MessageScroller>
              <MessageScrollerViewport>
                <MessageScrollerContent className="gap-2 p-4">
                  {ITEMS.map((item) => (
                    <MessageScrollerItem key={item.id} messageId={item.id}>
                      <p>{item.label}</p>
                    </MessageScrollerItem>
                  ))}
                </MessageScrollerContent>
              </MessageScrollerViewport>
            </MessageScroller>
          </MessageScrollerProvider>
        </div>
      )
    )
    const viewport = document.querySelector(
      '[data-slot="message-scroller-viewport"]'
    )
    if (!viewport) throw new Error("viewport is not rendered")
    const scroll = await scrollThrough(viewport)
    results["message scroller"] = { mount, ...scroll }
    expect(mount).toBeLessThan(1500)
    expect(scroll.longFrames).toBeLessThanOrEqual(2)
  })

  it("command", async () => {
    await throttle(4)
    const mount = await timed(() =>
      render(
        <Command className="w-96">
          <CommandInput placeholder="Search" />
          <CommandList>
            {ITEMS.map((item) => (
              <CommandItem key={item.id}>{item.label}</CommandItem>
            ))}
          </CommandList>
        </Command>
      )
    )
    const input = page.getByPlaceholder("Search")
    const filter = await timed(async () => {
      await userEvent.type(input, "99")
      await wait(0)
    })
    results.command = { mount, filterTwoKeys: filter }
    expect(mount).toBeLessThan(1500)
    expect(filter).toBeLessThan(800)
    expect(document.querySelectorAll("[cmdk-item]").length).toBeLessThan(COUNT)
  })

  it("select", async () => {
    await throttle(4)
    const mount = await timed(() =>
      render(
        <Select>
          <SelectTrigger aria-label="Item" className="w-48">
            <SelectValue placeholder="Pick one" />
          </SelectTrigger>
          <SelectContent>
            {ITEMS.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    )
    const open = await timed(async () => {
      await page.getByRole("combobox", { name: "Item" }).click()
      await page.getByRole("listbox").element()
    })
    const list = document.querySelector('[role="listbox"]')
    if (!list) throw new Error("listbox is not open")
    const scroller =
      list
        .closest("[data-slot=select-content]")
        ?.querySelector("[data-slot=select-viewport], [role=listbox]") ?? list
    const scroll = await scrollThrough(scroller)
    results.select = { mount, open, ...scroll }
    expect(open).toBeLessThan(2000)
    expect(scroll.longFrames).toBeLessThanOrEqual(2)
  })

  it("writes the report", async () => {
    await report("lists", results)
  })
})
