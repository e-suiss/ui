import { BellIcon, GearIcon, UserIcon } from "@phosphor-icons/react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const tabs = [
  {
    value: "account",
    label: "Account",
    icon: UserIcon,
    content: "Update your name, email address, and profile photo.",
  },
  {
    value: "notifications",
    label: "Notifications",
    icon: BellIcon,
    content: "Choose which updates you receive by email and push.",
  },
  {
    value: "settings",
    label: "Settings",
    icon: GearIcon,
    content: "Manage language, time zone, and privacy preferences.",
  },
] as const

export default function TabsDemo() {
  return (
    <div className="w-full max-w-96">
      <Tabs defaultValue="account" orientation="horizontal">
        <TabsList variant="default">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent
            key={tab.value}
            value={tab.value}
            className="text-label-secondary"
          >
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
