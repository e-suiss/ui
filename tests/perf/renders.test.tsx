import * as React from "react"
import { describe, expect, it } from "vitest"
import { page } from "vitest/browser"
import { render } from "vitest-browser-react"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
} from "@/components/ui/carousel"
import {
  MessageScroller,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"
import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import { report, wait } from "./measure"

const counts = new Map<string, number>()
const results: Record<string, Record<string, number>> = {}

function Counted({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <React.Profiler
      id={id}
      onRender={() => counts.set(id, (counts.get(id) ?? 0) + 1)}
    >
      {children}
    </React.Profiler>
  )
}

function rendersDuring(prefix: string) {
  let total = 0
  for (const [id, count] of counts) if (id.startsWith(prefix)) total += count
  return total
}

async function measure(action: () => Promise<void>) {
  await wait(300)
  counts.clear()
  await action()
  await wait(600)
  return new Map(counts)
}

const SLIDES = [1, 2, 3, 4, 5]
const MENU = ["Home", "Inbox", "Calendar", "Settings"]

describe("re-renders caused by one interaction", () => {
  it("carousel: moving to the next slide", async () => {
    await render(
      <Carousel className="w-80">
        <CarouselContent>
          {SLIDES.map((slide) => (
            <Counted key={slide} id={`slide-${slide}`}>
              <CarouselItem>
                <div className="aspect-square">{slide}</div>
              </CarouselItem>
            </Counted>
          ))}
        </CarouselContent>
        <CarouselNext />
      </Carousel>
    )
    await measure(() =>
      page.getByRole("button", { name: "Next slide" }).click()
    )
    results.carousel = {
      slides: SLIDES.length,
      slideRenders: rendersDuring("slide-"),
    }
    expect(results.carousel.slideRenders).toBe(0)
  })

  it("sidebar: collapsing the sidebar", async () => {
    await render(
      <SidebarProvider>
        <Sidebar collapsible="icon">
          <SidebarContent>
            <SidebarMenu>
              {MENU.map((label) => (
                <Counted key={label} id={`menu-${label}`}>
                  <SidebarMenuItem>
                    <SidebarMenuButton>{label}</SidebarMenuButton>
                  </SidebarMenuItem>
                </Counted>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <SidebarTrigger />
          <Counted id="page">
            <p>Page content</p>
          </Counted>
        </SidebarInset>
      </SidebarProvider>
    )
    await measure(() =>
      page.getByRole("button", { name: "Toggle Sidebar" }).first().click()
    )
    results.sidebar = {
      menuItems: MENU.length,
      menuRenders: rendersDuring("menu-"),
      pageRenders: rendersDuring("page"),
    }
    expect(results.sidebar.pageRenders).toBe(0)
  })

  it("tabs: switching tabs", async () => {
    await render(
      <Tabs defaultValue="a">
        <TabsList>
          {["a", "b", "c"].map((value) => (
            <Counted key={value} id={`trigger-${value}`}>
              <TabsTrigger value={value}>{value.toUpperCase()}</TabsTrigger>
            </Counted>
          ))}
        </TabsList>
        {["a", "b", "c"].map((value) => (
          <TabsContent key={value} value={value}>
            Panel {value}
          </TabsContent>
        ))}
      </Tabs>
    )
    await measure(() => page.getByRole("tab", { name: "B" }).click())
    results.tabs = { triggers: 3, triggerRenders: rendersDuring("trigger-") }
  })

  it("toggle group: choosing an option", async () => {
    await render(
      <ToggleGroup defaultValue={["day"]} aria-label="Range">
        {["day", "week", "month", "year"].map((value) => (
          <Counted key={value} id={`option-${value}`}>
            <ToggleGroupItem value={value}>{value}</ToggleGroupItem>
          </Counted>
        ))}
      </ToggleGroup>
    )
    await measure(() => page.getByRole("button", { name: "week" }).click())
    results["toggle group"] = {
      options: 4,
      optionRenders: rendersDuring("option-"),
    }
  })

  it("message scroller: scrolling", async () => {
    const messages = Array.from({ length: 40 }, (_, index) => `m${index}`)
    await render(
      <div className="h-72 w-80">
        <MessageScrollerProvider>
          <MessageScroller>
            <MessageScrollerViewport>
              <MessageScrollerContent className="gap-2 p-4">
                {messages.map((id) => (
                  <Counted key={id} id={`message-${id}`}>
                    <MessageScrollerItem messageId={id}>
                      <p className="h-10">{id}</p>
                    </MessageScrollerItem>
                  </Counted>
                ))}
              </MessageScrollerContent>
            </MessageScrollerViewport>
          </MessageScroller>
        </MessageScrollerProvider>
      </div>
    )
    const viewport = document.querySelector(
      '[data-slot="message-scroller-viewport"]'
    )
    if (!viewport) throw new Error("viewport is not rendered")
    await measure(async () => {
      for (let step = 0; step < 20; step++) {
        viewport.scrollTop -= 60
        await wait(30)
      }
    })
    results["message scroller"] = {
      messages: messages.length,
      messageRenders: rendersDuring("message-"),
    }
  })

  it("writes the report", async () => {
    await report("renders", results)
  })
})
