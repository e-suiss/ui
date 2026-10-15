import * as React from "react"
import {
  TabBar,
  TabBarContent,
  TabBarItem,
  TabBarLink,
  TabBarList,
  TabBarSection,
  TabBarSectionTitle,
  TabBarTrigger,
} from "@/components/ui/tab-bar"

const defaultItems = ["Home", "Nominees", "Directory", "Collections"]

const sections = [
  { title: "Awards", links: ["Winners", "Site of the Day", "Nominees"] },
  { title: "Inspiration", links: ["Collections", "Elements", "Resources"] },
  { title: "Directory", links: ["Professionals", "Agencies", "Freelancers"] },
  { title: "Market", links: ["Jobs", "New Events", "Products"] },
]

function TabBarExample({
  defaultOpen,
  items = defaultItems,
  withSections = true,
}: {
  defaultOpen?: boolean
  items?: string[]
  withSections?: boolean
}) {
  const [value, setValue] = React.useState("Home")

  return (
    <div className="h-full min-h-svh bg-background">
      <Backdrop />
      <TabBar aria-label="Main" defaultOpen={defaultOpen}>
        <TabBarList>
          {items.map((item) => (
            <TabBarItem
              key={item}
              isActive={value === item}
              onClick={() => setValue(item)}
            >
              {item}
            </TabBarItem>
          ))}
        </TabBarList>
        <TabBarContent>
          {withSections &&
            sections.map((section) => (
              <TabBarSection key={section.title}>
                <TabBarSectionTitle>{section.title}</TabBarSectionTitle>
                {section.links.map((link) => (
                  <TabBarLink
                    key={link}
                    href={`#${link.toLowerCase().replaceAll(" ", "-")}`}
                    isActive={value === link}
                    onClick={() => setValue(link)}
                  >
                    {link}
                  </TabBarLink>
                ))}
              </TabBarSection>
            ))}
        </TabBarContent>
        <TabBarTrigger>More</TabBarTrigger>
      </TabBar>
    </div>
  )
}

function Backdrop() {
  return (
    <div className="grid grid-cols-2 gap-3 p-4 md:grid-cols-4">
      {Array.from({ length: 16 }, (_, index) => `Card ${index + 1}`).map(
        (card) => (
          <div
            key={card}
            className="flex aspect-[4/3] items-end rounded-2xl bg-primary/15 p-4 text-sm font-semibold text-primary odd:bg-secondary odd:text-foreground"
          >
            {card}
          </div>
        )
      )}
    </div>
  )
}

export default function TabBarFitsWithoutMore() {
  return (
    <div className="h-[32rem] transform-gpu overflow-hidden">
      <TabBarExample items={defaultItems.slice(0, 3)} withSections={false} />
    </div>
  )
}
