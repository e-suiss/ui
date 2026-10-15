import * as React from "react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLabel,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const panelMenus = [
  {
    value: "pos",
    label: "POS",
    explore: ["Terminals", "Handhelds", "Compare models"],
    shop: ["Shop POS", "Accessories", "Financing", "Trade in"],
    more: ["POS support", "Setup guide", "Integrations"],
  },
  {
    value: "kitchen",
    label: "Kitchen",
    explore: ["Displays", "Printers"],
    shop: ["Shop Kitchen", "Mounts", "Cables"],
    more: ["Kitchen support", "Station layouts"],
  },
  {
    value: "reservations",
    label: "Reservations",
    explore: ["Floor plans", "Waitlist", "Guest profiles", "Online booking"],
    shop: ["Plans", "Add-ons"],
    more: ["Reservations support", "Booking widget", "Calendar sync"],
  },
  {
    value: "analytics",
    label: "Analytics",
    explore: ["Reports", "Forecasts"],
    shop: ["Plans", "Data exports"],
    more: ["Analytics support"],
  },
]

function PanelColumn({
  label,
  links,
  size,
}: {
  label: string
  links: string[]
  size?: "default" | "lg"
}) {
  return (
    <div className="flex flex-col">
      <NavigationMenuLabel>{label}</NavigationMenuLabel>
      <ul className="flex flex-col gap-1.5">
        {links.map((link) => (
          <li key={link}>
            <NavigationMenuLink href="#" size={size}>
              {link}
            </NavigationMenuLink>
          </li>
        ))}
      </ul>
    </div>
  )
}

function PanelExample() {
  const ref = React.useRef<HTMLDivElement>(null)

  return (
    <div className="w-full">
      <div
        ref={ref}
        className="sticky top-0 z-50 flex w-full justify-center bg-background/80 backdrop-blur-xl transition-colors duration-300 has-data-popup-open:bg-background dark:bg-muted/80 dark:has-data-popup-open:bg-muted"
      >
        <NavigationMenu layout="panel" anchor={ref}>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                href="#"
                className={navigationMenuTriggerStyle()}
              >
                Store
              </NavigationMenuLink>
            </NavigationMenuItem>
            {panelMenus.map((menu) => (
              <NavigationMenuItem key={menu.value} value={menu.value}>
                <NavigationMenuTrigger>{menu.label}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="mx-auto flex max-w-245 gap-16 px-6 pt-10 pb-16">
                    <PanelColumn
                      label={`Explore ${menu.label}`}
                      links={menu.explore}
                      size="lg"
                    />
                    <PanelColumn
                      label={`Shop ${menu.label}`}
                      links={menu.shop}
                    />
                    <PanelColumn
                      label={`More from ${menu.label}`}
                      links={menu.more}
                    />
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ))}
            <NavigationMenuItem>
              <NavigationMenuLink
                href="#"
                className={navigationMenuTriggerStyle()}
              >
                Support
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="mx-auto flex max-w-245 flex-col items-center gap-3 px-6 py-24 text-center">
        <h2 className="text-5xl font-semibold">Hestia POS</h2>
        <p className="text-xl text-muted-foreground">
          Orders, kitchen and tables in one place.
        </p>
        <div className="mt-8 grid w-full grid-cols-3 gap-4">
          {["bg-blue-500", "bg-orange-500", "bg-green-500"].map((tint) => (
            <div key={tint} className={`aspect-4/3 rounded-3xl ${tint}`} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function NavigationMenuPanel() {
  return (
    <div className="flex min-h-96 items-start justify-center">
      <PanelExample />
    </div>
  )
}
