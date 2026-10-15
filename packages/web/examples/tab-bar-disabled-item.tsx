import {
  TabBar,
  TabBarContent,
  TabBarItem,
  TabBarList,
  TabBarTrigger,
} from "@/components/ui/tab-bar"

function Backdrop() {
  return (
    <div className="grid grid-cols-2 gap-3 p-4 md:grid-cols-4">
      {Array.from({ length: 16 }, (_, index) => `Card ${index + 1}`).map(
        (card) => (
          <div
            key={card}
            className="flex aspect-[4/3] items-end rounded-2xl bg-accent/15 p-4 text-sm font-semibold text-link odd:bg-surface-tertiary odd:text-label"
          >
            {card}
          </div>
        )
      )}
    </div>
  )
}

export default function TabBarDisabledItem() {
  return (
    <div className="h-[32rem] transform-gpu overflow-hidden">
      <div className="h-full min-h-svh bg-surface">
        <Backdrop />
        <TabBar aria-label="Main">
          <TabBarList>
            <TabBarItem isActive>Home</TabBarItem>
            <TabBarItem>Nominees</TabBarItem>
            <TabBarItem disabled>Directory</TabBarItem>
          </TabBarList>
          <TabBarContent />
          <TabBarTrigger>More</TabBarTrigger>
        </TabBar>
      </div>
    </div>
  )
}
