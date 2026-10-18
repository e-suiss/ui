import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Text } from "@/components/ui/text"

type ListVariant = "default" | "line"

function SectionsDemo({
  variant,
  orientation,
}: {
  variant?: ListVariant
  orientation?: "horizontal" | "vertical"
}) {
  const [value, setValue] = React.useState("overview")
  return (
    <Tabs value={value} onValueChange={setValue} orientation={orientation}>
      <TabsList variant={variant}>
        <TabsTrigger value="overview">
          <Text>Overview</Text>
        </TabsTrigger>
        <TabsTrigger value="analytics">
          <Text>Analytics</Text>
        </TabsTrigger>
        <TabsTrigger value="reports">
          <Text>Reports</Text>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <Text className="text-sm text-muted-foreground">
          A summary of your activity.
        </Text>
      </TabsContent>
      <TabsContent value="analytics">
        <Text className="text-sm text-muted-foreground">
          Detailed metrics and trends.
        </Text>
      </TabsContent>
      <TabsContent value="reports">
        <Text className="text-sm text-muted-foreground">
          Exported reports and schedules.
        </Text>
      </TabsContent>
    </Tabs>
  )
}

export default function TabsVerticalLine() {
  return <SectionsDemo variant="line" orientation="vertical" />
}
