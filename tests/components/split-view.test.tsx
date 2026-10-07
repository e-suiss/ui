import * as React from "react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { page } from "vitest/browser"
import { render } from "vitest-browser-react"

import {
  SplitView,
  type SplitViewColumn,
  SplitViewDetail,
  SplitViewItem,
  SplitViewList,
  SplitViewSidebar,
} from "@/components/patterns/split-view"

afterEach(async () => {
  await page.viewport(1280, 800)
})

const mailboxes = ["Inbox", "Sent", "Archive"]

const messages = [
  { id: "order", from: "Acme Store", subject: "Your order has shipped" },
  { id: "meeting", from: "Jordan Lee", subject: "Tomorrow's meeting" },
]

type MailProps = Omit<React.ComponentProps<typeof SplitView>, "children"> & {
  withSidebar?: boolean
}

function Mail({ withSidebar = true, ...props }: MailProps) {
  const [mailbox, setMailbox] = React.useState("Inbox")
  const [messageId, setMessageId] = React.useState("order")
  const message = messages.find((item) => item.id === messageId) ?? messages[0]

  return (
    <SplitView className="h-96" {...props}>
      {withSidebar && (
        <SplitViewSidebar title="Mailboxes">
          {mailboxes.map((name) => (
            <SplitViewItem
              key={name}
              isActive={mailbox === name}
              onClick={() => setMailbox(name)}
            >
              {name}
            </SplitViewItem>
          ))}
        </SplitViewSidebar>
      )}
      <SplitViewList title={mailbox}>
        {messages.map((item) => (
          <SplitViewItem
            key={item.id}
            isActive={item.id === messageId}
            onClick={() => setMessageId(item.id)}
          >
            {item.from}
          </SplitViewItem>
        ))}
      </SplitViewList>
      <SplitViewDetail title={message?.subject}>
        <p>From {message?.from}</p>
      </SplitViewDetail>
    </SplitView>
  )
}

function Controlled({ onColumnChange }: { onColumnChange: () => void }) {
  const [column, setColumn] = React.useState<SplitViewColumn>("sidebar")
  return (
    <>
      <span>Column {column}</span>
      <button type="button" onClick={() => setColumn("detail")}>
        Show detail
      </button>
      <Mail
        column={column}
        onColumnChange={(next) => {
          onColumnChange()
          setColumn(next)
        }}
      />
    </>
  )
}

const heading = (name: string) => page.getByRole("heading", { name })
const item = (name: string) => page.getByRole("button", { name })
const back = () =>
  document.querySelector<HTMLElement>("[data-slot=split-view-back]")
const backButton = (name: string) => page.getByRole("button", { name })

function shownPanes() {
  return Array.from(
    document.querySelectorAll<HTMLElement>(
      "[data-slot=split-view-sidebar], [data-slot=split-view-list], [data-slot=split-view-detail]"
    ),
    (pane) => pane.dataset.slot?.replace("split-view-", "")
  )
}

function column() {
  return document.querySelector<HTMLElement>("[data-slot=split-view]")?.dataset
    .column
}

describe("SplitView on desktop", () => {
  it("shows every pane side by side with resize handles", async () => {
    await render(<Mail />)
    await expect.element(heading("Mailboxes")).toBeVisible()
    await expect.element(heading("Inbox")).toBeInTheDocument()
    await expect.element(heading("Your order has shipped")).toBeVisible()
    expect(shownPanes()).toEqual(["sidebar", "list", "detail"])
    expect(page.getByRole("separator").elements()).toHaveLength(2)
    expect(back()).toBeNull()
    const [sidebar, list, detail] = [
      "split-view-sidebar",
      "split-view-list",
      "split-view-detail",
    ].map(
      (slot) =>
        document
          .querySelector<HTMLElement>(`[data-slot=${slot}]`)
          ?.getBoundingClientRect().left ?? 0
    )
    expect(sidebar).toBeLessThan(list ?? 0)
    expect(list).toBeLessThan(detail ?? 0)
  })

  it("labels each pane with its title", async () => {
    await render(<Mail />)
    await expect
      .element(page.getByRole("region", { name: "Mailboxes" }))
      .toBeVisible()
    await expect
      .element(page.getByRole("region", { name: "Inbox" }))
      .toBeVisible()
    await expect
      .element(page.getByRole("region", { name: "Your order has shipped" }))
      .toBeVisible()
  })

  it("updates the panes in place when an item is picked", async () => {
    const onColumnChange = vi.fn()
    await render(<Mail onColumnChange={onColumnChange} />)
    await expect
      .element(item("Acme Store"))
      .toHaveAttribute("aria-current", "true")
    await item("Jordan Lee").click()
    await expect.element(heading("Tomorrow's meeting")).toBeVisible()
    await expect
      .element(item("Jordan Lee"))
      .toHaveAttribute("aria-current", "true")
    await expect.element(item("Acme Store")).not.toHaveAttribute("aria-current")
    await item("Sent").click()
    await expect.element(heading("Sent")).toBeInTheDocument()
    expect(shownPanes()).toEqual(["sidebar", "list", "detail"])
    expect(onColumnChange.mock.calls).toEqual([["detail"], ["list"]])
  })
})

describe("SplitView on mobile", () => {
  it("starts on the list with a back button to the sidebar", async () => {
    await page.viewport(390, 844)
    await render(<Mail />)
    expect(shownPanes()).toEqual(["list"])
    expect(column()).toBe("list")
    await expect.element(heading("Inbox")).toBeVisible()
    await expect.element(backButton("Mailboxes")).toBeVisible()
    await expect.element(item("Acme Store")).toBeVisible()
  })

  it("pushes the detail when a message is picked and focuses its heading", async () => {
    const onColumnChange = vi.fn()
    await page.viewport(390, 844)
    await render(<Mail onColumnChange={onColumnChange} />)
    await item("Jordan Lee").click()
    await expect.poll(shownPanes).toEqual(["detail"])
    expect(column()).toBe("detail")
    expect(onColumnChange).toHaveBeenLastCalledWith("detail")
    await expect.element(heading("Tomorrow's meeting")).toHaveFocus()
    await expect.element(backButton("Inbox")).toBeVisible()
    await expect.element(page.getByText("From Jordan Lee")).toBeVisible()
  })

  it("goes back from the detail to the list and from the list to the sidebar", async () => {
    await page.viewport(390, 844)
    await render(<Mail defaultColumn="detail" />)
    expect(shownPanes()).toEqual(["detail"])
    await backButton("Inbox").click()
    await expect.poll(shownPanes).toEqual(["list"])
    await expect.element(heading("Inbox")).toHaveFocus()
    await backButton("Mailboxes").click()
    await expect.poll(shownPanes).toEqual(["sidebar"])
    await expect.element(heading("Mailboxes")).toHaveFocus()
    expect(back()).toBeNull()
  })

  it("opens the picked mailbox from the sidebar", async () => {
    await page.viewport(390, 844)
    await render(<Mail defaultColumn="sidebar" />)
    expect(shownPanes()).toEqual(["sidebar"])
    await expect.element(heading("Inbox")).not.toBeInTheDocument()
    await item("Archive").click()
    await expect.poll(shownPanes).toEqual(["list"])
    await expect.element(heading("Archive")).toHaveFocus()
    await expect.element(backButton("Mailboxes")).toBeVisible()
  })

  it("does not focus a heading on the first render", async () => {
    await page.viewport(390, 844)
    await render(<Mail defaultColumn="detail" />)
    await expect.element(heading("Your order has shipped")).toBeVisible()
    await expect.element(heading("Your order has shipped")).not.toHaveFocus()
  })

  it("has no back button on the list without a sidebar", async () => {
    await page.viewport(390, 844)
    await render(<Mail withSidebar={false} />)
    expect(shownPanes()).toEqual(["list"])
    expect(back()).toBeNull()
    await item("Acme Store").click()
    await expect.poll(shownPanes).toEqual(["detail"])
    await backButton("Inbox").click()
    await expect.poll(shownPanes).toEqual(["list"])
  })

  it("follows a controlled column", async () => {
    const onColumnChange = vi.fn()
    await page.viewport(390, 844)
    await render(<Controlled onColumnChange={onColumnChange} />)
    expect(shownPanes()).toEqual(["sidebar"])
    await item("Sent").click()
    await expect.poll(shownPanes).toEqual(["list"])
    await expect.element(page.getByText("Column list")).toBeVisible()
    await page.getByRole("button", { name: "Show detail" }).click()
    await expect.poll(shownPanes).toEqual(["detail"])
    expect(onColumnChange).toHaveBeenCalledTimes(1)
  })

  it("keeps a fixed controlled column", async () => {
    const onColumnChange = vi.fn()
    await page.viewport(390, 844)
    await render(<Mail column="list" onColumnChange={onColumnChange} />)
    await item("Jordan Lee").click()
    expect(onColumnChange).toHaveBeenCalledExactlyOnceWith("detail")
    expect(shownPanes()).toEqual(["list"])
  })

  it("switches presentation when the viewport crosses the breakpoint", async () => {
    await render(<Mail />)
    expect(shownPanes()).toEqual(["sidebar", "list", "detail"])
    await page.viewport(390, 844)
    await expect.poll(shownPanes).toEqual(["list"])
    await page.viewport(1280, 800)
    await expect.poll(shownPanes).toEqual(["sidebar", "list", "detail"])
  })
})
