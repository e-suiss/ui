import * as React from "react"
import { View } from "react-native"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Text } from "@/components/ui/text"

export default function TabsDemoExample() {
  const [value, setValue] = React.useState("account")
  return (
    <Tabs value={value} onValueChange={setValue} className="w-full">
      <TabsList>
        <TabsTrigger value="account">
          <Text>Account</Text>
        </TabsTrigger>
        <TabsTrigger value="password">
          <Text>Password</Text>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Make changes to your account here.
            </CardDescription>
          </CardHeader>
          <CardContent className="gap-4">
            <View className="gap-2">
              <Label nativeID="tabs-name">Name</Label>
              <Input
                accessibilityLabelledBy="tabs-name"
                defaultValue="Pedro Duarte"
              />
            </View>
            <View className="gap-2">
              <Label nativeID="tabs-username">Username</Label>
              <Input
                accessibilityLabelledBy="tabs-username"
                defaultValue="@peduarte"
                autoCapitalize="none"
              />
            </View>
          </CardContent>
          <CardFooter>
            <Button>
              <Text>Save changes</Text>
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Change your password here. You will be logged out after saving.
            </CardDescription>
          </CardHeader>
          <CardContent className="gap-4">
            <View className="gap-2">
              <Label nativeID="tabs-current">Current password</Label>
              <Input accessibilityLabelledBy="tabs-current" secureTextEntry />
            </View>
            <View className="gap-2">
              <Label nativeID="tabs-new">New password</Label>
              <Input accessibilityLabelledBy="tabs-new" secureTextEntry />
            </View>
          </CardContent>
          <CardFooter>
            <Button>
              <Text>Save password</Text>
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
