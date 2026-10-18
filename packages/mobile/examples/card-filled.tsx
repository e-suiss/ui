import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Text } from "@/components/ui/text"

export default function CardFilled() {
  return (
    <Card variant="filled" className="w-full">
      <CardHeader>
        <CardTitle>Storage</CardTitle>
        <CardDescription>42 GB of 128 GB used</CardDescription>
      </CardHeader>
      <CardContent>
        <Text className="text-sm text-muted-foreground">
          Photos and backups take up most of your space.
        </Text>
      </CardContent>
    </Card>
  )
}
