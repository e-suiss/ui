import { afterEach, describe, expect, it, vi } from "vitest"
import { page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import {
  createToastManager,
  Toaster,
  toast,
  useToastManager,
} from "@/components/ui/toast"

type Manager = ReturnType<typeof createToastManager>

const region = () => page.getByRole("region", { name: "Notifications" })
const card = (name: string) => page.getByRole("dialog", { name })
const outside = () => page.getByRole("button", { name: "Outside" })

const toasts = () =>
  Array.from(document.querySelectorAll<HTMLElement>("[data-slot=toast]"))

const titles = () =>
  toasts()
    .filter((node) => !node.hasAttribute("data-ending-style"))
    .map(
      (node) => node.querySelector("[data-slot=toast-title]")?.textContent ?? ""
    )

function toastNamed(name: string) {
  const node = toasts().find(
    (item) =>
      item.querySelector("[data-slot=toast-title]")?.textContent === name
  )
  if (!node) throw new Error(`toast ${name} not rendered`)
  return node
}

const icon = (name: string) =>
  toastNamed(name).querySelector<HTMLElement>("[data-slot=toast-icon]")

const frame = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))

const wait = (ms: number) =>
  new Promise((resolve) => window.setTimeout(resolve, ms))

async function settled(element: () => HTMLElement) {
  let last = ""
  let still = 0
  while (still < 6) {
    await frame()
    const rect = element().getBoundingClientRect()
    const current = `${rect.left},${rect.top},${rect.width},${rect.height}`
    still = current === last ? still + 1 : 0
    last = current
  }
  return element().getBoundingClientRect()
}

function pointer(target: HTMLElement, type: string, x: number, y: number) {
  target.dispatchEvent(
    new PointerEvent(type, {
      pointerId: 1,
      pointerType: "mouse",
      isPrimary: true,
      button: 0,
      buttons: type === "pointerup" ? 0 : 1,
      clientX: x,
      clientY: y,
      bubbles: true,
      cancelable: true,
    })
  )
}

async function swipe(target: HTMLElement, dx: number, dy: number) {
  const rect = target.getBoundingClientRect()
  const x = rect.left + 24
  const y = rect.top + rect.height / 2
  pointer(target, "pointerdown", x, y)
  for (let step = 1; step <= 8; step++) {
    await frame()
    pointer(target, "pointermove", x + (dx * step) / 8, y + (dy * step) / 8)
  }
  await frame()
  pointer(target, "pointerup", x + dx, y + dy)
}

let manager: Manager

async function renderToaster(props?: { limit?: number; timeout?: number }) {
  manager = createToastManager()
  return await render(
    <Toaster toastManager={manager} {...props}>
      <button type="button">Outside</button>
    </Toaster>
  )
}

function Launcher() {
  const manager = useToastManager()
  return (
    <button
      type="button"
      onClick={() =>
        manager.add({ title: "Event created", description: "Friday at 9" })
      }
    >
      Show toast
    </button>
  )
}

afterEach(async () => {
  manager?.close()
  toast.close()
  await outside()
    .hover()
    .catch(() => undefined)
  await expect.poll(toasts).toEqual([])
  await page.viewport(1280, 800)
})

describe("Toast basics", () => {
  it("announces a toast with its title and description", async () => {
    await renderToaster()
    manager.add({ title: "Event created", description: "Friday at 9" })
    await expect.element(card("Event created")).toBeVisible()
    await expect
      .element(card("Event created"))
      .toHaveAccessibleDescription("Friday at 9")
    await expect.element(region()).toHaveAttribute("aria-live", "polite")
    expect(region().element().contains(card("Event created").element())).toBe(
      true
    )
  })

  it("adds toasts from a component through the manager hook", async () => {
    manager = createToastManager()
    await render(
      <Toaster toastManager={manager}>
        <Launcher />
        <button type="button">Outside</button>
      </Toaster>
    )
    await page.getByRole("button", { name: "Show toast" }).click()
    await expect.element(card("Event created")).toBeVisible()
  })

  it("uses the shared toast manager by default", async () => {
    await render(
      <Toaster>
        <button type="button">Outside</button>
      </Toaster>
    )
    toast.add({ title: "Shared" })
    await expect.element(card("Shared")).toBeVisible()
  })

  it("slides up from the bottom corner", async () => {
    await renderToaster()
    manager.add({ title: "Saved" })
    await expect.element(card("Saved")).toBeInTheDocument()
    const start = toastNamed("Saved").getBoundingClientRect().top
    const end = await settled(() => toastNamed("Saved"))
    expect(start).toBeGreaterThan(end.top)
    expect(Math.round(window.innerHeight - end.bottom)).toBe(16)
    expect(Math.round(window.innerWidth - end.right)).toBe(16)
    expect(end.width).toBe(384)
  })

  it("spans the screen width on a phone", async () => {
    await page.viewport(390, 844)
    await renderToaster()
    manager.add({ title: "Saved" })
    const rect = await settled(() => toastNamed("Saved"))
    expect([Math.round(rect.left), Math.round(rect.width)]).toEqual([16, 358])
  })

  it.each([
    ["success", "bg-green"],
    ["info", "bg-accent"],
    ["warning", "bg-orange"],
    ["error", "bg-danger"],
  ])("shows a %s badge", async (type, tint) => {
    await renderToaster()
    manager.add({ type, title: type })
    await expect.element(card(type)).toBeVisible()
    const badge = icon(type)
    expect(badge?.getAttribute("aria-hidden")).toBe("true")
    expect(badge?.className).toContain(tint)
    expect(badge?.querySelector("svg")).not.toBeNull()
    expect(badge?.getBoundingClientRect().width).toBe(32)
  })

  it("shows no icon without a type", async () => {
    await renderToaster()
    manager.add({ title: "Plain" })
    await expect.element(card("Plain")).toBeVisible()
    expect(icon("Plain")).toBeNull()
  })

  it("shows a progress ring while loading", async () => {
    await renderToaster()
    manager.add({ type: "loading", title: "Uploading" })
    await expect.element(card("Uploading")).toBeVisible()
    const ring = icon("Uploading")?.querySelector("circle[pathLength]")
    expect(ring).not.toBeNull()
    expect(icon("Uploading")?.querySelector("span")).toBeNull()
    const start = ring ? getComputedStyle(ring).strokeDasharray : ""
    await wait(400)
    const later = ring ? getComputedStyle(ring).strokeDasharray : ""
    expect(Number.parseFloat(later)).toBeGreaterThan(Number.parseFloat(start))
    expect(Number.parseFloat(later)).toBeLessThan(94)
  })
})

describe("Toast dismissal", () => {
  it("closes on its own after the timeout", async () => {
    await renderToaster()
    manager.add({ title: "Copied", timeout: 600 })
    await expect.element(card("Copied")).toBeVisible()
    await wait(300)
    await expect.element(card("Copied")).toBeVisible()
    await expect.poll(toasts, { timeout: 3000 }).toEqual([])
  })

  it("uses the provider timeout as the default", async () => {
    await renderToaster({ timeout: 500 })
    manager.add({ title: "Copied" })
    await expect.element(card("Copied")).toBeVisible()
    await expect.poll(toasts, { timeout: 3000 }).toEqual([])
  })

  it("keeps a toast with a zero timeout until it is closed", async () => {
    await renderToaster({ timeout: 300 })
    manager.add({ title: "Connection lost", timeout: 0 })
    await wait(900)
    await expect.element(card("Connection lost")).toBeVisible()
  })

  it("pauses the timeout while hovered", async () => {
    await renderToaster()
    manager.add({ title: "Copied", timeout: 1500 })
    await card("Copied").hover()
    await wait(2000)
    await expect.element(card("Copied")).toBeVisible()
    await outside().hover()
    await expect.poll(toasts, { timeout: 3000 }).toEqual([])
  })

  it("closes from its close button", async () => {
    await renderToaster()
    manager.add({ title: "Saved", timeout: 0 })
    await card("Saved").hover()
    const close = page.getByRole("button", { name: "Close toast" })
    await expect.element(close).toBeVisible()
    await close.click()
    await expect.poll(titles).toEqual([])
    await expect.poll(toasts).toEqual([])
  })

  it("closes one toast by id or all at once", async () => {
    await renderToaster()
    const first = manager.add({ title: "First", timeout: 0 })
    manager.add({ title: "Second", timeout: 0 })
    manager.add({ title: "Third", timeout: 0 })
    await expect.poll(titles).toEqual(["Third", "Second", "First"])
    manager.close(first)
    await expect.poll(titles).toEqual(["Third", "Second"])
    manager.close()
    await expect.poll(toasts).toEqual([])
  })

  it("can be dismissed with Escape when focused", async () => {
    await renderToaster()
    manager.add({ title: "Saved", timeout: 0 })
    await expect.element(card("Saved")).toBeVisible()
    toastNamed("Saved").focus()
    await userEvent.keyboard("{Escape}")
    await expect.poll(toasts).toEqual([])
  })

  it("is dismissed by swiping it down", async () => {
    await renderToaster()
    manager.add({ title: "Saved", timeout: 0 })
    await settled(() => toastNamed("Saved"))
    await swipe(toastNamed("Saved"), 0, 120)
    await expect.poll(titles).toEqual([])
  })

  it("is dismissed by swiping it to the right", async () => {
    await renderToaster()
    manager.add({ title: "Saved", timeout: 0 })
    await settled(() => toastNamed("Saved"))
    await swipe(toastNamed("Saved"), 200, 0)
    await expect.poll(titles).toEqual([])
  })

  it("stays after a short swipe", async () => {
    await renderToaster()
    manager.add({ title: "Saved", timeout: 0 })
    const before = await settled(() => toastNamed("Saved"))
    await swipe(toastNamed("Saved"), 0, 6)
    await wait(300)
    const after = await settled(() => toastNamed("Saved"))
    expect(titles()).toEqual(["Saved"])
    expect(after.top).toBe(before.top)
  })
})

describe("Toast actions and updates", () => {
  it("runs the action and can close itself from it", async () => {
    await renderToaster()
    const onUndo = vi.fn()
    const id = manager.add({
      title: "Message archived",
      timeout: 0,
      actionProps: {
        children: "Undo",
        onClick: () => {
          onUndo()
          manager.close(id)
        },
      },
    })
    const undo = page.getByRole("button", { name: "Undo" })
    await expect.element(undo).toBeVisible()
    await undo.click()
    expect(onUndo).toHaveBeenCalledTimes(1)
    await expect.poll(toasts).toEqual([])
  })

  it("hides the action button when there is no action", async () => {
    await renderToaster()
    manager.add({ title: "Saved", timeout: 0 })
    await expect.element(card("Saved")).toBeVisible()
    expect(
      toastNamed("Saved").querySelector("[data-slot=toast-action]")
    ).toBeNull()
  })

  it("updates a toast in place", async () => {
    await renderToaster()
    const id = manager.add({ type: "loading", title: "Uploading", timeout: 0 })
    await expect.element(card("Uploading")).toBeVisible()
    manager.update(id, { type: "success", title: "Uploaded" })
    await expect.element(card("Uploaded")).toBeVisible()
    expect(toasts()).toHaveLength(1)
    await expect
      .poll(() => icon("Uploaded")?.querySelector("span")?.className ?? "")
      .toContain("bg-green")
  })

  it("follows a promise from loading to success", async () => {
    await renderToaster()
    let resolve: (value: string) => void = () => undefined
    const result = manager.promise(
      new Promise<string>((done) => {
        resolve = done
      }),
      {
        loading: { title: "Publishing post" },
        success: (value) => ({ title: `Post ${value}` }),
        error: { title: "Publishing failed" },
      }
    )
    await expect.element(card("Publishing post")).toBeVisible()
    expect(toastNamed("Publishing post").dataset.type).toBe("loading")
    resolve("published")
    await expect(result).resolves.toBe("published")
    await expect.element(card("Post published")).toBeVisible()
    expect(toastNamed("Post published").dataset.type).toBe("success")
    await expect
      .poll(() => {
        const ring = icon("Post published")?.querySelector("circle[pathLength]")
        return ring ? getComputedStyle(ring).strokeDasharray : ""
      })
      .toBe("100px, 100px")
  })

  it("follows a promise from loading to error", async () => {
    await renderToaster()
    let reject: (error: Error) => void = () => undefined
    const result = manager.promise(
      new Promise<string>((_, fail) => {
        reject = fail
      }),
      {
        loading: { title: "Publishing post" },
        success: { title: "Post published" },
        error: (error: Error) => ({
          title: "Publishing failed",
          description: error.message,
        }),
      }
    )
    await expect.element(card("Publishing post")).toBeVisible()
    reject(new Error("Network error"))
    await expect(result).rejects.toThrow("Network error")
    await expect.element(card("Publishing failed")).toBeVisible()
    await expect
      .element(card("Publishing failed"))
      .toHaveAccessibleDescription("Network error")
    expect(toastNamed("Publishing failed").dataset.type).toBe("error")
  })
})

describe("Toast stack", () => {
  it("stacks the newest toast in front and peeks the others behind", async () => {
    await renderToaster()
    manager.add({ title: "First", timeout: 0 })
    manager.add({ title: "Second", timeout: 0 })
    await expect.poll(titles).toEqual(["Second", "First"])
    const front = await settled(() => toastNamed("Second"))
    const back = await settled(() => toastNamed("First"))
    expect(back.top).toBeLessThan(front.top)
    expect(front.top - back.top).toBeLessThan(front.height / 2)
    expect(back.width).toBeLessThan(front.width)
    expect(toastNamed("First").querySelector("[data-behind]")).not.toBeNull()
  })

  it("fans the stack out while hovered", async () => {
    await renderToaster()
    manager.add({ title: "First", timeout: 0 })
    manager.add({ title: "Second", timeout: 0 })
    await settled(() => toastNamed("First"))
    await card("Second").hover()
    await expect
      .poll(() => toastNamed("First").hasAttribute("data-expanded"))
      .toBe(true)
    const front = await settled(() => toastNamed("Second"))
    const back = await settled(() => toastNamed("First"))
    expect(back.bottom).toBeLessThanOrEqual(front.top)
    expect(back.width).toBe(front.width)
    await outside().hover()
    await expect
      .poll(() => toastNamed("First").hasAttribute("data-expanded"))
      .toBe(false)
  })

  it("limits the visible toasts and hides older ones", async () => {
    await renderToaster({ limit: 2 })
    manager.add({ title: "First", timeout: 0 })
    manager.add({ title: "Second", timeout: 0 })
    manager.add({ title: "Third", timeout: 0 })
    await expect
      .poll(() => toastNamed("First").hasAttribute("data-limited"))
      .toBe(true)
    await expect
      .poll(() => getComputedStyle(toastNamed("First")).opacity)
      .toBe("0")
    expect(toastNamed("Third").hasAttribute("data-limited")).toBe(false)
    manager.close()
  })
})
