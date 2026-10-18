import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Widget, WidgetTitle } from "@/components/ui/widget"

const menu = [
  {
    name: "Meatballs",
    price: "₺280",
    icon: (
      <IconPlaceholder
        lucide="HamburgerIcon"
        tabler="IconBurger"
        hugeicons="Hamburger01Icon"
        phosphor="HamburgerIcon"
        remixicon="RiRestaurantLine"
      />
    ),
  },
  {
    name: "Pide",
    price: "₺220",
    icon: (
      <IconPlaceholder
        lucide="PizzaIcon"
        tabler="IconPizza"
        hugeicons="PizzaIcon"
        phosphor="PizzaIcon"
        remixicon="RiRestaurantLine"
      />
    ),
  },
  {
    name: "Soup",
    price: "₺90",
    icon: (
      <IconPlaceholder
        lucide="SoupIcon"
        tabler="IconBowlChopsticks"
        hugeicons="RiceBowl01Icon"
        phosphor="BowlFoodIcon"
        remixicon="RiBowlLine"
      />
    ),
  },
  {
    name: "Coffee",
    price: "₺75",
    icon: (
      <IconPlaceholder
        lucide="CoffeeIcon"
        tabler="IconCoffee"
        hugeicons="CoffeeIcon"
        phosphor="CoffeeIcon"
        remixicon="RiCupLine"
      />
    ),
  },
  {
    name: "Künefe",
    price: "₺160",
    icon: (
      <IconPlaceholder
        lucide="IceCreamConeIcon"
        tabler="IconIceCream"
        hugeicons="IceCream01Icon"
        phosphor="IceCreamIcon"
        remixicon="RiCake3Line"
      />
    ),
  },
  {
    name: "Lemonade",
    price: "₺70",
    icon: (
      <IconPlaceholder
        lucide="CitrusIcon"
        tabler="IconLemon"
        hugeicons="OrangeIcon"
        phosphor="OrangeSliceIcon"
        remixicon="RiRestaurantLine"
      />
    ),
  },
  {
    name: "Ayran",
    price: "₺40",
    icon: (
      <IconPlaceholder
        lucide="CoffeeIcon"
        tabler="IconCoffee"
        hugeicons="CoffeeIcon"
        phosphor="CoffeeIcon"
        remixicon="RiCupLine"
      />
    ),
  },
  {
    name: "Baklava",
    price: "₺180",
    icon: (
      <IconPlaceholder
        lucide="IceCreamConeIcon"
        tabler="IconIceCream"
        hugeicons="IceCream01Icon"
        phosphor="IceCreamIcon"
        remixicon="RiCake3Line"
      />
    ),
  },
]

function Hint({ children }: { children: React.ReactNode }) {
  return <p className="mt-6 text-xs text-muted-foreground">{children}</p>
}

function FreeResizeExample() {
  const ref = React.useRef<HTMLDivElement>(null)
  const [box, setBox] = React.useState({ width: 0, height: 0, columns: 0 })

  React.useEffect(() => {
    const widget = ref.current
    if (!widget) return
    const measure = () => {
      const grid = widget.querySelector<HTMLElement>("[data-menu-grid]")
      const columns = grid
        ? getComputedStyle(grid).gridTemplateColumns.split(" ").length
        : 0
      setBox({
        width: Math.round(widget.offsetWidth),
        height: Math.round(widget.offsetHeight),
        columns,
      })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(widget)
    return () => observer.disconnect()
  }, [])

  return (
    <div>
      <Widget
        ref={ref}
        resizable="free"
        defaultSize="large"
        className="gap-0 p-0"
      >
        <div className="flex items-baseline justify-between px-4 pt-4 pb-3">
          <WidgetTitle className="text-xl">Hestia POS</WidgetTitle>
          <span className="text-sm text-muted-foreground tabular-nums">
            {box.columns} columns
          </span>
        </div>
        <ScrollArea className="min-h-0 flex-1">
          <div
            data-menu-grid
            className="grid grid-cols-2 gap-2 px-4 pb-4 @[30rem]/widget:grid-cols-3 @[44rem]/widget:grid-cols-4"
          >
            {menu.map((item) => (
              <div
                key={item.name}
                className="flex flex-col gap-2 rounded-2xl bg-card p-3"
              >
                <span
                  aria-hidden="true"
                  className="text-amber-700 dark:text-amber-400 [&_svg]:size-6"
                >
                  {item.icon}
                </span>
                <div>
                  <p className="text-sm font-semibold">{item.name}</p>
                  <p className="text-sm text-muted-foreground tabular-nums">
                    {item.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Widget>
      <Hint>
        Free resize · {box.width} × {box.height}
      </Hint>
    </div>
  )
}

export default function WidgetFreeResize() {
  return <FreeResizeExample />
}
