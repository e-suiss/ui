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

export default function TabsDisabledTab() {
  return (
    <div className="w-full max-w-96">
      <Tabs defaultValue="account" orientation="horizontal">
        <TabsList variant="default">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="billing" disabled>
            Billing
          </TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="text-label-secondary">
          {tabs[0].content}
        </TabsContent>
        <TabsContent value="notifications" className="text-label-secondary">
          {tabs[1].content}
        </TabsContent>
      </Tabs>
    </div>
  )
}
