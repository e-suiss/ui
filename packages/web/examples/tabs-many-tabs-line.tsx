import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const settings = [
  { value: "general", label: "General" },
  { value: "account", label: "Account" },
  { value: "notifications", label: "Notifications" },
  { value: "privacy", label: "Privacy" },
  { value: "appearance", label: "Appearance" },
  { value: "language", label: "Language" },
  { value: "billing", label: "Billing" },
]

export default function TabsManyTabsLine() {
  return (
    <div className="w-full">
      <Tabs
        orientation="horizontal"
        defaultValue="general"
        className="w-full max-w-3xl"
      >
        <TabsList variant="line">
          {settings.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {settings.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <p className="text-muted-foreground">{tab.label} settings</p>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
