import { CalendarBlankIcon } from "@phosphor-icons/react"
import { screen, waitFor } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import {
  Preview,
  PreviewContent,
  PreviewTrigger,
} from "@/components/patterns/preview"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import PreviewDemo from "@/examples/preview-demo"
import { renderExample } from "@/tests/render-example"

function ProfileCard() {
  return (
    <div className="flex gap-4">
      <Avatar size="lg">
        <AvatarImage src="https://github.com/vercel.png" alt="@nextjs" />
        <AvatarFallback>NJ</AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-1">
        <h4 className="text-sm font-semibold">@nextjs</h4>
        <p className="text-sm">
          The React framework, created and maintained by @vercel.
        </p>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarBlankIcon />
          Joined December 2021
        </div>
      </div>
    </div>
  )
}
const cardText = "The React framework, created and maintained by @vercel."

function PreviewOpenByDefault() {
  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <Preview defaultOpen>
        <PreviewTrigger href="#">@nextjs</PreviewTrigger>
        <PreviewContent>
          <ProfileCard />
        </PreviewContent>
      </Preview>
    </div>
  )
}

test("Default", async () => {
  const { canvas, step } = await renderExample(<PreviewDemo />)

  const trigger = canvas.getByRole("link", { name: "@nextjs" })

  await step("opens the preview card on hover", async () => {
    await userEvent.hover(trigger)
    const card = await screen.findByText(cardText, {}, { timeout: 3000 })
    await waitFor(() => expect(card).toBeVisible())
  })

  await step("closes the card when the pointer leaves", async () => {
    await userEvent.unhover(trigger)
    await waitFor(() => expect(screen.queryByText(cardText)).toBeNull(), {
      timeout: 3000,
    })
  })

  await step("opens the card on keyboard focus", async () => {
    await userEvent.tab()
    await expect(trigger).toHaveFocus()
    const card = await screen.findByText(cardText, {}, { timeout: 3000 })
    await waitFor(() => expect(card).toBeVisible())
  })
})
test("Open By Default", async () => {
  const { step } = await renderExample(<PreviewOpenByDefault />)

  await step("starts with the card shown", async () => {
    const card = await screen.findByText(cardText)
    await waitFor(() => expect(card).toBeVisible())
    await expect(screen.getByText("Joined December 2021")).toBeVisible()
  })
})
