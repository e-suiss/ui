import { CookingPotIcon } from "@phosphor-icons/react"
import type * as React from "react"
import {
  Widget,
  WidgetDescription,
  WidgetHeader,
  WidgetIcon,
  WidgetTitle,
  WidgetValue,
} from "@/components/ui/widget"

const tickets = [
  { id: "#1042", place: "Table 4", minutes: 18 },
  { id: "#1043", place: "Takeaway", minutes: 15 },
  { id: "#1044", place: "Table 12", minutes: 9 },
  { id: "#1045", place: "Pickup", minutes: 7 },
  { id: "#1046", place: "Garden 3", minutes: 5 },
  { id: "#1047", place: "Table 7", minutes: 3 },
  { id: "#1048", place: "Takeaway", minutes: 1 },
]

function Hint({ children }: { children: React.ReactNode }) {
  return <p className="mt-6 text-xs text-label-secondary">{children}</p>
}

export default function WidgetKitchen() {
  return (
    <div>
      <Widget
        resizable
        handle="inside"
        defaultSize="large"
        className="flex-row gap-4"
      >
        <div className="flex w-32 shrink-0 flex-col gap-1 group-data-[size=small]/widget:w-full">
          <WidgetHeader className="gap-1.5 text-warning">
            <WidgetIcon size="sm" className="text-warning">
              <CookingPotIcon weight="fill" />
            </WidgetIcon>
            <WidgetTitle>Kitchen</WidgetTitle>
          </WidgetHeader>
          <WidgetValue className="mt-2 text-5xl">7</WidgetValue>
          <WidgetDescription className="text-xs">
            pending orders
          </WidgetDescription>
          <p className="text-xs font-medium text-danger">2 running late</p>
        </div>
        <ul className="flex min-w-0 flex-1 flex-col group-data-[size=small]/widget:hidden">
          {tickets.map((ticket) => (
            <li
              key={ticket.id}
              className="flex items-center gap-2 border-b py-1.5 text-sm group-data-[size=medium]/widget:nth-[n+4]:hidden"
            >
              <span
                aria-hidden="true"
                data-late={ticket.minutes >= 15}
                className="size-1.5 shrink-0 rounded-full bg-orange data-[late=true]:bg-red"
              />
              <span className="min-w-0 flex-1 truncate">
                {ticket.id} · {ticket.place}
              </span>
              <span
                data-late={ticket.minutes >= 15}
                className="text-xs text-label-secondary tabular-nums data-[late=true]:font-medium data-[late=true]:text-danger"
              >
                {ticket.minutes} min
              </span>
            </li>
          ))}
        </ul>
      </Widget>
      <Hint>Handle inside the corner. Hover the corner to reveal it.</Hint>
    </div>
  )
}
