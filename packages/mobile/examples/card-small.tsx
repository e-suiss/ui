import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Text } from "@/components/ui/text"

export default function CardSmall() {
  return (
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
  )
}
