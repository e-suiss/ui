import * as React from "react"
import {
  TabBar,
  TabBarContent,
  TabBarItem,
  TabBarList,
  TabBarTrigger,
} from "@/components/ui/tab-bar"

export default function TabBarFitsWithoutMore() {
  const [value, setValue] = React.useState("Home")

  return (
    <div className="h-[32rem] transform-gpu overflow-hidden">
      <div className="h-full min-h-svh bg-background">
        <div className="grid grid-cols-2 gap-3 p-4 md:grid-cols-4">
          {Array.from({ length: 16 }, (_, index) => `Card ${index + 1}`).map(
            (card) => (
              <div
                key={card}
                className="flex aspect-[4/3] items-end rounded-2xl bg-primary/15 p-4 text-sm font-semibold text-[color-mix(in_oklab,var(--primary)_80%,var(--foreground))] odd:bg-secondary odd:text-foreground"
              >
                {card}
              </div>
            )
          )}
        </div>
        <TabBar aria-label="Main">
          <TabBarList>
            <TabBarItem
              isActive={value === "Home"}
              onClick={() => setValue("Home")}
            >
              Home
            </TabBarItem>
            <TabBarItem
              isActive={value === "Nominees"}
              onClick={() => setValue("Nominees")}
            >
              Nominees
            </TabBarItem>
            <TabBarItem
              isActive={value === "Directory"}
              onClick={() => setValue("Directory")}
            >
              Directory
            </TabBarItem>
          </TabBarList>
          <TabBarContent />
          <TabBarTrigger>More</TabBarTrigger>
        </TabBar>
      </div>
    </div>
  )
}
