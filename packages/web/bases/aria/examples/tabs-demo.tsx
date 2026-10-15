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

export default function TabsDemo() {
  return (
    <div className="w-full max-w-96">
      <Tabs defaultSelectedKey="account" orientation="horizontal">
        <TabsList variant="default">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} id={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent
            key={tab.value}
            id={tab.value}
            className="text-muted-foreground"
          >
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
