import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Text } from "@/components/ui/text"

export default function TabsDisabledTabLine() {
  const [value, setValue] = React.useState("overview")
  return (
    <Tabs value={value} onValueChange={setValue}>
      <TabsList variant="line">
        <TabsTrigger value="overview">
          <Text>Overview</Text>
        </TabsTrigger>
        <TabsTrigger value="analytics">
          <Text>Analytics</Text>
        </TabsTrigger>
        <TabsTrigger value="reports" disabled>
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
    </Tabs>
  )
}
