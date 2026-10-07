import { describe, expect, it } from "vitest"
import { page } from "vitest/browser"
import { render } from "vitest-browser-react"

import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"
import {
  type MessageScrollerOptions,
  useMessageScroller,
  useMessageScrollerVisibility,
} from "@/hooks/use-message-scroller"

type ChatMessage = { id: string; text: string; anchor?: boolean }

const thread = (from: number, to: number): ChatMessage[] =>
  Array.from({ length: to - from + 1 }, (_, index) => ({
    id: String(from + index),
    text: `Message ${from + index}`,
  }))

type Api = ReturnType<typeof useMessageScroller> & {
  visibility: ReturnType<typeof useMessageScrollerVisibility>
}

const api = { current: null as Api | null }

function Probe() {
  const scroller = useMessageScroller()
  const visibility = useMessageScrollerVisibility()
  api.current = { ...scroller, visibility }
  return null
}

function Chat({
  messages,
  options,
}: {
  messages: ChatMessage[]
  options?: MessageScrollerOptions
}) {
  return (
    <div style={{ height: 300, width: 320 }}>
      <MessageScrollerProvider {...options}>
        <MessageScroller>
          <MessageScrollerViewport aria-label="Conversation">
            <MessageScrollerContent className="flex flex-col gap-2 p-2">
              {messages.map((message) => (
                <MessageScrollerItem
                  key={message.id}
                  messageId={message.id}
                  scrollAnchor={message.anchor}
                >
                  <p style={{ height: 40, margin: 0 }}>{message.text}</p>
                </MessageScrollerItem>
              ))}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton direction="start" />
          <MessageScrollerButton />
        </MessageScroller>
        <Probe />
      </MessageScrollerProvider>
    </div>
  )
}

function viewport() {
  const element = document.querySelector<HTMLElement>(
    "[data-slot=message-scroller-viewport]"
  )
  if (!element) throw new Error("viewport not rendered")
  return element
}

const distanceFromEnd = () => {
  const element = viewport()
  return element.scrollHeight - element.clientHeight - element.scrollTop
}

function topOf(id: string) {
  const item = document.querySelector(`[data-message-id="${id}"]`)
  if (!item) throw new Error(`message ${id} not rendered`)
  return (
    item.getBoundingClientRect().top - viewport().getBoundingClientRect().top
  )
}

async function settled() {
  let height = -1
  let stable = 0
  while (stable < 3) {
    await new Promise(requestAnimationFrame)
    const next = viewport().scrollHeight
    stable = next === height ? stable + 1 : 0
    height = next
  }
}

function firstVisibleId() {
  const top = viewport().getBoundingClientRect().top
  const item = Array.from(
    document.querySelectorAll<HTMLElement>("[data-message-id]")
  ).find((element) => element.getBoundingClientRect().top >= top)
  if (!item?.dataset.messageId) throw new Error("no visible message")
  return item.dataset.messageId
}

const toEnd = () =>
  page.getByRole("button", { name: "Scroll to end", includeHidden: true })

const isActive = (direction: "start" | "end") =>
  document
    .querySelector(
      `[data-slot=message-scroller-button][data-direction=${direction}]`
    )
    ?.getAttribute("data-active")

describe("MessageScroller", () => {
  it("opens at the latest message", async () => {
    await render(<Chat messages={thread(1, 30)} />)
    await expect.poll(distanceFromEnd).toBeLessThanOrEqual(1)
    expect(viewport().scrollTop).toBeGreaterThan(0)
  })

  it("can open at the first message instead", async () => {
    await render(
      <Chat
        messages={thread(1, 30)}
        options={{ defaultScrollPosition: "start" }}
      />
    )
    await expect.poll(() => isActive("end")).toBe("true")
    expect(viewport().scrollTop).toBe(0)
  })

  it("can open at the last scroll anchor", async () => {
    const messages = thread(1, 30).map((message) =>
      message.id === "20" ? { ...message, anchor: true } : message
    )
    await render(
      <Chat
        messages={messages}
        options={{ defaultScrollPosition: "last-anchor" }}
      />
    )
    await settled()
    expect(topOf("20")).toBeGreaterThanOrEqual(0)
    expect(topOf("20")).toBeLessThan(80)
  })

  it("only enables the buttons that can move the view", async () => {
    await render(<Chat messages={thread(1, 30)} />)
    await expect.poll(() => isActive("start")).toBe("true")
    expect(isActive("end")).toBe("false")

    viewport().scrollTop = 0
    await expect.poll(() => isActive("end")).toBe("true")
    expect(isActive("start")).toBe("false")
  })

  it("scrolls back to the end from the button", async () => {
    await render(<Chat messages={thread(1, 30)} />)
    await expect.poll(distanceFromEnd).toBeLessThanOrEqual(1)
    viewport().scrollTop = 0
    await expect.poll(() => isActive("end")).toBe("true")
    await toEnd().click()
    await expect.poll(distanceFromEnd).toBeLessThanOrEqual(1)
  })

  it("follows new messages when autoScroll is on", async () => {
    const screen = await render(
      <Chat messages={thread(1, 30)} options={{ autoScroll: true }} />
    )
    await expect.poll(distanceFromEnd).toBeLessThanOrEqual(1)
    await screen.rerender(
      <Chat messages={thread(1, 34)} options={{ autoScroll: true }} />
    )
    await expect.poll(distanceFromEnd).toBeLessThanOrEqual(1)
  })

  it("leaves a reader alone when new messages arrive", async () => {
    const screen = await render(
      <Chat messages={thread(1, 30)} options={{ autoScroll: true }} />
    )
    await expect.poll(distanceFromEnd).toBeLessThanOrEqual(1)
    viewport().dispatchEvent(
      new WheelEvent("wheel", { deltaY: -400, bubbles: true })
    )
    viewport().scrollTop = 200
    await expect.poll(() => isActive("end")).toBe("true")
    await screen.rerender(
      <Chat messages={thread(1, 34)} options={{ autoScroll: true }} />
    )
    await expect.poll(() => viewport().scrollTop).toBe(200)
    expect(isActive("end")).toBe("true")
  })

  it("keeps the visible message in place when older ones load above", async () => {
    const screen = await render(<Chat messages={thread(20, 50)} />)
    await settled()
    viewport().scrollTop = 300
    await settled()
    const id = firstVisibleId()
    const before = Math.round(topOf(id))
    await screen.rerender(<Chat messages={thread(1, 50)} />)
    await settled()
    expect(Math.round(topOf(id))).toBe(before)
    expect(viewport().scrollTop).toBeGreaterThan(300)
  })

  it("brings a message to the top on request", async () => {
    await render(<Chat messages={thread(1, 30)} />)
    await expect.poll(distanceFromEnd).toBeLessThanOrEqual(1)
    api.current?.scrollToMessage("5", { align: "start" })
    await expect.poll(() => Math.round(topOf("5"))).toBeLessThan(20)
    expect(topOf("5")).toBeGreaterThanOrEqual(0)
  })

  it("reports the messages below the top peek area as visible", async () => {
    await render(
      <Chat
        messages={thread(1, 30)}
        options={{ defaultScrollPosition: "start" }}
      />
    )
    await expect
      .poll(() => api.current?.visibility.visibleMessageIds.slice(0, 2))
      .toEqual(["2", "3"])
    expect(api.current?.visibility.visibleMessageIds).not.toContain("30")
  })

  it("counts every message on screen when there is no peek area", async () => {
    await render(
      <Chat
        messages={thread(1, 30)}
        options={{ defaultScrollPosition: "start", scrollPreviousItemPeek: 0 }}
      />
    )
    await expect
      .poll(() => api.current?.visibility.visibleMessageIds.slice(0, 2))
      .toEqual(["1", "2"])
  })
})
