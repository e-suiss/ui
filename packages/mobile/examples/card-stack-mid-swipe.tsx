import { View } from "react-native"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Text } from "@/components/ui/text"

export default function CardStackMidSwipe() {
  return (
    <View className="h-96 w-full">
      <View
        className="absolute inset-0"
        style={{ transform: [{ translateY: 14.4 }, { scale: 0.94 }] }}
      >
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Night Market</CardTitle>
            <CardDescription>Taipei</CardDescription>
          </CardHeader>
          <CardContent className="grow">
            <View className="grow rounded-xl bg-muted" />
          </CardContent>
          <CardContent>
            <Text className="text-sm text-muted-foreground">
              Street food stalls open until two in the morning.
            </Text>
          </CardContent>
        </Card>
      </View>
      <View
        className="absolute inset-0"
        style={{ transform: [{ translateY: 2.4 }, { scale: 0.99 }] }}
      >
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Garden Library</CardTitle>
            <CardDescription>Kyoto</CardDescription>
          </CardHeader>
          <CardContent className="grow">
            <View className="grow rounded-xl bg-muted" />
          </CardContent>
          <CardContent>
            <Text className="text-sm text-muted-foreground">
              Quiet reading rooms around a moss garden.
            </Text>
          </CardContent>
        </Card>
      </View>
      <View
        className="absolute inset-0"
        style={{
          transform: [
            { translateX: 96 },
            { translateY: 12 },
            { rotate: "3deg" },
          ],
        }}
      >
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Harbor Café</CardTitle>
            <CardDescription>Lisbon</CardDescription>
          </CardHeader>
          <CardContent className="grow">
            <View className="grow rounded-xl bg-muted" />
          </CardContent>
          <CardContent>
            <Text className="text-sm text-muted-foreground">
              Slow mornings, strong coffee and a view of the river.
            </Text>
          </CardContent>
        </Card>
      </View>
    </View>
  )
}
