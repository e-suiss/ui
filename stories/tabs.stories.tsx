import type { Meta, StoryObj } from "@storybook/react-native"
import { GearIcon, UserIcon } from "phosphor-react-native"
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
import { Icon } from "@/components/ui/icon"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Text } from "@/components/ui/text"

function TabsDemo() {
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

function WithIconsDemo() {
  const [value, setValue] = React.useState("profile")
  return (
    <Tabs value={value} onValueChange={setValue}>
      <TabsList>
        <TabsTrigger value="profile">
          <Icon as={UserIcon} className="size-4" />
          <Text>Profile</Text>
        </TabsTrigger>
        <TabsTrigger value="settings">
          <Icon as={GearIcon} className="size-4" />
          <Text>Settings</Text>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <Text variant="muted">Your public profile information.</Text>
      </TabsContent>
      <TabsContent value="settings">
        <Text variant="muted">Manage your preferences.</Text>
      </TabsContent>
    </Tabs>
  )
}

function DisabledTabDemo() {
  const [value, setValue] = React.useState("overview")
  return (
    <Tabs value={value} onValueChange={setValue}>
      <TabsList>
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
        <Text variant="muted">A summary of your activity.</Text>
      </TabsContent>
      <TabsContent value="analytics">
        <Text variant="muted">Detailed metrics and trends.</Text>
      </TabsContent>
    </Tabs>
  )
}

const meta = {
  title: "Components/Tabs",
  component: Tabs,
  args: {
    value: "account",
    onValueChange: () => {},
  },
} satisfies Meta<typeof Tabs>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <TabsDemo />,
}

export const WithIcons: Story = {
  render: () => <WithIconsDemo />,
}

export const DisabledTab: Story = {
  render: () => <DisabledTabDemo />,
}
