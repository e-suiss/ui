// @ts-nocheck
import { CalendarBlankIcon } from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, screen, userEvent, waitFor } from "storybook/test"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { buttonVariants } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

const meta = {
  title: "Components/Hover Card",
  component: HoverCard,
  render: (args) => (
    <HoverCard {...args}>
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
            <div className="text-label-secondary mt-1 flex items-center gap-1.5 text-xs">
              <CalendarBlankIcon />
              Joined December 2021
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
} satisfies Meta<typeof HoverCard>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas, step }) => {
    const trigger = canvas.getByRole("link", { name: "@nextjs" })

    await step(
      "opens on hover and closes when the pointer leaves",
      async () => {
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
      }
    )

    await step("opens on keyboard focus", async () => {
      await userEvent.tab()
      await expect(trigger).toHaveFocus()
      await waitFor(
        () => expect(screen.getByText("Joined December 2021")).toBeVisible(),
        { timeout: 3000 }
      )
    })
  },
}

export const OpenByDefault: Story = {
  args: { defaultOpen: true },
  play: async ({ step }) => {
    await step("renders the card open on mount", async () => {
      await waitFor(
        () => expect(screen.getByText("Joined December 2021")).toBeVisible(),
        { timeout: 3000 }
      )
    })
  },
}

export const Sides: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3 p-24">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <HoverCard key={side} {...args}>
          <HoverCardTrigger
            href="#"
            className={buttonVariants({ variant: "outline" })}
          >
            {side.charAt(0).toUpperCase() + side.slice(1)}
          </HoverCardTrigger>
          <HoverCardContent side={side} className="w-56">
            <p className="text-sm">
              This card opens on the {side} side of its trigger.
            </p>
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  ),
  play: async ({ canvas, step }) => {
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
  },
}
