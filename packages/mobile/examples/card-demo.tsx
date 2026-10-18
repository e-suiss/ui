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
import { Text } from "@/components/ui/text"

export default function CardDemo() {
  return (
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
  )
}
