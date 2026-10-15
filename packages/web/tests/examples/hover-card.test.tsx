import { screen, waitFor } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { buttonVariants } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import HoverCardDemo from "@/examples/hover-card-demo"
import HoverCardSides from "@/examples/hover-card-sides"
import { renderExample } from "@/tests/render-example"

function HoverCardOpenByDefault() {
  return (
    <HoverCard defaultOpen>
      <HoverCardTrigger
        href="#"
        className={buttonVariants({ variant: "link" })}
      >
        @nextjs
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
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
            <div className="text-muted-foreground mt-1 flex items-center gap-1.5 text-xs">
              <IconPlaceholder
                lucide="CalendarIcon"
                tabler="IconCalendar"
                hugeicons="Calendar01Icon"
                phosphor="CalendarBlankIcon"
                remixicon="RiCalendarLine"
              />
              Joined December 2021
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

test("Default", async () => {
  const { canvas, step } = await renderExample(<HoverCardDemo />)

  const trigger = canvas.getByRole("link", { name: "@nextjs" })

  await step("opens on hover and closes when the pointer leaves", async () => {
    await userEvent.hover(trigger)
    await waitFor(
      () =>
        expect(
          screen.getByText(
            "The React framework, created and maintained by @vercel."
          )
        ).toBeVisible(),
      { timeout: 3000 }
    )
    await userEvent.unhover(trigger)
    await waitFor(
      () => expect(screen.queryByText("Joined December 2021")).toBeNull(),
      { timeout: 3000 }
    )
  })

  await step("opens on keyboard focus", async () => {
    await userEvent.tab()
    await expect(trigger).toHaveFocus()
    await waitFor(
      () => expect(screen.getByText("Joined December 2021")).toBeVisible(),
      { timeout: 3000 }
    )
  })
})
test("Open By Default", async () => {
  const { step } = await renderExample(<HoverCardOpenByDefault />)

  await step("renders the card open on mount", async () => {
    await waitFor(
      () => expect(screen.getByText("Joined December 2021")).toBeVisible(),
      { timeout: 3000 }
    )
  })
})
test("Sides", async () => {
  const { canvas, step } = await renderExample(<HoverCardSides />)

  for (const side of ["top", "right", "bottom", "left"]) {
    const label = side.charAt(0).toUpperCase() + side.slice(1)

    await step(`opens the ${side} card on its side`, async () => {
      const trigger = canvas.getByRole("link", { name: label })
      await userEvent.hover(trigger)
      const text = `This card opens on the ${side} side of its trigger.`
      await waitFor(() => expect(screen.getByText(text)).toBeVisible(), {
        timeout: 3000,
      })
      await expect(
        screen.getByText(text).closest('[data-slot="hover-card-content"]')
      ).toHaveAttribute("data-side", side)
      await userEvent.unhover(trigger)
      await waitFor(() => expect(screen.queryByText(text)).toBeNull(), {
        timeout: 3000,
      })
    })
  }
})
