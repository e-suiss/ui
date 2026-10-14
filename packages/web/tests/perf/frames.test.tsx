import { afterEach, describe, expect, it } from "vitest"
import { page } from "vitest/browser"
import { render } from "vitest-browser-react"

import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
} from "@/components/ui/carousel"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Slider } from "@/components/ui/slider"
import { Widget, WidgetTitle } from "@/components/ui/widget"

import {
  drag,
  type FrameStats,
  frameStats,
  report,
  throttle,
  wait,
} from "./measure"

const RATES = [4, 6]
const results: Record<string, FrameStats> = {}

afterEach(() => throttle(1))

function bySlot(slot: string) {
  const element = document.querySelector(`[data-slot="${slot}"]`)
  if (!element) throw new Error(`${slot} is not rendered`)
  return element
}

const scenarios: Record<string, () => Promise<FrameStats>> = {
  "slider drag": async () => {
    await render(
      <div className="w-96 p-8">
        <Slider aria-label="Volume" defaultValue={[20]} />
      </div>
    )
    return frameStats(() => drag(bySlot("slider-thumb"), 240, 0))
  },
  "resizable drag": async () => {
    await render(
      <ResizablePanelGroup className="h-64 w-[40rem]">
        <ResizablePanel defaultSize="50%">Inbox</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize="50%">Message</ResizablePanel>
      </ResizablePanelGroup>
    )
    return frameStats(() => drag(page.getByRole("separator").element(), 200, 0))
  },
  "widget resize": async () => {
    await render(
      <div className="p-8">
        <Widget resizable defaultSize="small">
          <WidgetTitle>Sales</WidgetTitle>
        </Widget>
      </div>
    )
    return frameStats(() => drag(bySlot("widget-handle"), 220, 220))
  },
  "dialog open": async () => {
    await render(
      <Dialog>
        <DialogTrigger render={<Button />}>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Edit profile</DialogTitle>
        </DialogContent>
      </Dialog>
    )
    return frameStats(async () => {
      await page.getByRole("button", { name: "Open" }).click()
      await wait(600)
    })
  },
  "carousel next": async () => {
    await render(
      <Carousel className="w-80">
        <CarouselContent>
          {[1, 2, 3, 4, 5].map((slide) => (
            <CarouselItem key={slide}>
              <div className="flex aspect-square items-center justify-center rounded-xl bg-control">
                {slide}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext />
      </Carousel>
    )
    return frameStats(async () => {
      await page.getByRole("button", { name: "Next slide" }).click()
      await wait(800)
    })
  },
}

describe("frame times under CPU throttling", () => {
  for (const rate of RATES) {
    for (const [name, scenario] of Object.entries(scenarios)) {
      it(`${name} at ${rate}x`, async () => {
        await throttle(rate)
        const stats = await scenario()
        results[`${name} @ ${rate}x`] = stats
        expect(stats.frames).toBeGreaterThan(0)
        expect(stats.long).toBe(0)
      })
    }
  }

  it("writes the report", async () => {
    await report("frames", results)
  })
})
