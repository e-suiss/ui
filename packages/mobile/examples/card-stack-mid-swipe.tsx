import { View } from "react-native"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Text } from "@/components/ui/text"

type Place = { id: string; name: string; city: string; detail: string }

const places: Place[] = [
  {
    id: "harbor",
    name: "Harbor Café",
    city: "Lisbon",
    detail: "Slow mornings, strong coffee and a view of the river.",
  },
  {
    id: "garden",
    name: "Garden Library",
    city: "Kyoto",
    detail: "Quiet reading rooms around a moss garden.",
  },
  {
    id: "market",
    name: "Night Market",
    city: "Taipei",
    detail: "Street food stalls open until two in the morning.",
  },
]

function PlaceCard({ place }: { place: Place }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{place.name}</CardTitle>
        <CardDescription>{place.city}</CardDescription>
      </CardHeader>
      <CardContent className="grow">
        <View className="grow rounded-xl bg-muted" />
      </CardContent>
      <CardContent>
        <Text className="text-sm text-muted-foreground">{place.detail}</Text>
      </CardContent>
    </Card>
  )
}

export default function CardStackMidSwipe() {
  return (
    <View className="gap-6">
      <View className="h-96 w-full">
        <View
          className="absolute inset-0"
          style={{ transform: [{ translateY: 14.4 }, { scale: 0.94 }] }}
        >
          <PlaceCard place={places[2]} />
        </View>
        <View
          className="absolute inset-0"
          style={{ transform: [{ translateY: 2.4 }, { scale: 0.99 }] }}
        >
          <PlaceCard place={places[1]} />
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
          <PlaceCard place={places[0]} />
        </View>
      </View>
    </View>
  )
}
