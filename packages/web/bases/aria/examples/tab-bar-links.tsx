import {
  TabBar,
  TabBarContent,
  TabBarItem,
  TabBarList,
  TabBarTrigger,
} from "@/components/ui/tab-bar"

const defaultItems = ["Home", "Nominees", "Directory", "Collections"]

function Backdrop() {
  return (
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
  )
}

export default function TabBarLinks() {
  return (
    <div className="h-[32rem] transform-gpu overflow-hidden">
      <div className="h-full min-h-svh bg-background">
        <Backdrop />
        <TabBar aria-label="Main">
          <TabBarList>
            {defaultItems.map((item, index) => (
              <TabBarItem
                key={item}
                isActive={index === 0}
                render={(props) => (
                  <a href={`#${item.toLowerCase()}`} {...props} />
                )}
              >
                {item}
              </TabBarItem>
            ))}
          </TabBarList>
          <TabBarContent />
          <TabBarTrigger>More</TabBarTrigger>
        </TabBar>
      </div>
    </div>
  )
}
