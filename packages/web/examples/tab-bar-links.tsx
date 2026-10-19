import {
  TabBar,
  TabBarContent,
  TabBarItem,
  TabBarList,
  TabBarTrigger,
} from "@/components/ui/tab-bar"

export default function TabBarLinks() {
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
            <TabBarItem isActive render={<a href="#home" />}>
              Home
            </TabBarItem>
            <TabBarItem render={<a href="#nominees" />}>Nominees</TabBarItem>
            <TabBarItem render={<a href="#directory" />}>Directory</TabBarItem>
            <TabBarItem render={<a href="#collections" />}>
              Collections
            </TabBarItem>
          </TabBarList>
          <TabBarContent />
          <TabBarTrigger>More</TabBarTrigger>
        </TabBar>
      </div>
    </div>
  )
}
