import * as React from "react"
import { describe, expect, it } from "vitest"
import { render } from "vitest-browser-react"

import {
  PreviewMenu,
  PreviewMenuContent,
  PreviewMenuItem,
  PreviewMenuTrigger,
} from "@/components/interactions/preview-menu"
import { SearchReveal } from "@/components/interactions/search-reveal"
import {
  SectionIndex,
  SectionIndexBar,
} from "@/components/interactions/section-index"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  WheelPicker,
  WheelPickerColumn,
  WheelPickerItem,
} from "@/components/ui/wheel-picker"

describe("forwarded refs", () => {
  it("reaches the consumer without replacing the internal ref", async () => {
    const tabs = React.createRef<HTMLDivElement>()
    const toggle = React.createRef<HTMLDivElement>()
    const wheel = React.createRef<HTMLDivElement>()
    const reveal = React.createRef<HTMLDivElement>()
    const bar = React.createRef<HTMLDivElement>()
    let trigger: HTMLDivElement | null = null

    await render(
      <>
        <Tabs defaultValue="a">
          <TabsList ref={tabs}>
            <TabsTrigger value="a">A</TabsTrigger>
            <TabsTrigger value="b">B</TabsTrigger>
          </TabsList>
        </Tabs>
        <ToggleGroup ref={toggle} spacing={0}>
          <ToggleGroupItem value="a">A</ToggleGroupItem>
        </ToggleGroup>
        <WheelPicker>
          <WheelPickerColumn ref={wheel} aria-label="Fruit" defaultValue="b">
            <WheelPickerItem value="a">A</WheelPickerItem>
            <WheelPickerItem value="b">B</WheelPickerItem>
          </WheelPickerColumn>
        </WheelPicker>
        <SearchReveal ref={reveal} />
        <SectionIndex>
          <SectionIndexBar ref={bar} />
        </SectionIndex>
        <PreviewMenu>
          <PreviewMenuTrigger
            ref={(node: HTMLDivElement | null) => {
              trigger = node
            }}
          >
            Photo
          </PreviewMenuTrigger>
          <PreviewMenuContent>
            <PreviewMenuItem>Copy</PreviewMenuItem>
          </PreviewMenuContent>
        </PreviewMenu>
      </>
    )

    expect(tabs.current?.dataset.slot).toBe("tabs-list")
    expect(toggle.current?.dataset.slot).toBe("toggle-group")
    expect(wheel.current?.dataset.slot).toBe("wheel-picker-column")
    expect(reveal.current?.dataset.slot).toBe("search-reveal")
    expect(bar.current?.getAttribute("role")).toBe("slider")
    expect((trigger as HTMLDivElement | null)?.dataset.slot).toBe(
      "preview-menu-trigger"
    )
    await expect
      .poll(
        () =>
          document
            .querySelector<HTMLElement>("[data-slot=tabs-indicator]")
            ?.getBoundingClientRect().width
      )
      .toBeGreaterThan(0)
  })
})
