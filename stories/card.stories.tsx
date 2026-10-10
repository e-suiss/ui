import type { Meta, StoryObj } from "@storybook/react-native"
import { BellIcon } from "phosphor-react-native"
import { Image, View } from "react-native"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Icon } from "@/components/ui/icon"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Text } from "@/components/ui/text"

const meta = {
  title: "Components/Card",
  component: Card,
} satisfies Meta<typeof Card>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="gap-4">
        <View className="gap-2">
          <Label nativeID="card-email">Email</Label>
          <Input
            accessibilityLabelledBy="card-email"
            placeholder="m@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <View className="gap-2">
          <Label nativeID="card-password">Password</Label>
          <Input accessibilityLabelledBy="card-password" secureTextEntry />
        </View>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button block>
          <Text>Login</Text>
        </Button>
        <Button block variant="secondary">
          <Text>Login with Google</Text>
        </Button>
      </CardFooter>
    </Card>
  ),
}

export const Small: Story = {
  render: () => (
    <Card size="sm" className="w-full">
      <CardHeader>
        <CardTitle>Team plan</CardTitle>
        <CardDescription>Up to 10 members</CardDescription>
      </CardHeader>
      <CardContent>
        <Text className="text-sm">
          Shared workspaces, unlimited projects and priority support.
        </Text>
      </CardContent>
    </Card>
  ),
}

export const WithAction: Story = {
  render: () => (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>You have 3 unread messages.</CardDescription>
        <CardAction>
          <Button size="icon" variant="ghost">
            <Icon as={BellIcon} />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Text className="text-sm">
          Your call has been confirmed for tomorrow at 10:00.
        </Text>
      </CardContent>
      <CardFooter>
        <Button block>
          <Text>Mark all as read</Text>
        </Button>
      </CardFooter>
    </Card>
  ),
}

export const WithImage: Story = {
  render: () => (
    <Card className="w-full pt-0">
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80",
        }}
        className="aspect-video w-full"
      />
      <CardHeader>
        <CardTitle>Mountain retreat</CardTitle>
        <CardDescription>A quiet cabin with a view.</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button block variant="tinted">
          <Text>Book now</Text>
        </Button>
      </CardFooter>
    </Card>
  ),
}

export const Filled: Story = {
  render: () => (
    <Card variant="filled" className="w-full">
      <CardHeader>
        <CardTitle>Storage</CardTitle>
        <CardDescription>42 GB of 128 GB used</CardDescription>
      </CardHeader>
      <CardContent>
        <Text className="text-sm text-label-secondary">
          Photos and backups take up most of your space.
        </Text>
      </CardContent>
    </Card>
  ),
}
