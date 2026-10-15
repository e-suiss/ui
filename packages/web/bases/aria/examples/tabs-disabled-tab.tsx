import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const tabs = [
  {
    value: "account",
    label: "Account",
    content: "Update your name, email address, and profile photo.",
  },
  {
    value: "notifications",
    label: "Notifications",
    content: "Choose which updates you receive by email and push.",
  },
  {
    value: "settings",
    label: "Settings",
    content: "Manage language, time zone, and privacy preferences.",
  },
] as const

export default function TabsDisabledTab() {
  return (
    <div className="w-full max-w-96">
      <Tabs defaultSelectedKey="account" orientation="horizontal">
        <TabsList variant="default">
          <TabsTrigger id="account">Account</TabsTrigger>
          <TabsTrigger id="notifications">Notifications</TabsTrigger>
          <TabsTrigger id="billing" isDisabled>
            Billing
          </TabsTrigger>
        </TabsList>
        <TabsContent id="account" className="text-muted-foreground">
          {tabs[0].content}
        </TabsContent>
        <TabsContent id="notifications" className="text-muted-foreground">
          {tabs[1].content}
        </TabsContent>
      </Tabs>
    </div>
  )
}
