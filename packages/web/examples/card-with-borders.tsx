import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function CardWithBorders() {
  return (
    <div className="w-96">
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Choose what you want to hear about.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>You have three unread messages and one pending invite.</p>
        </CardContent>
        <CardFooter className="justify-end border-t">
          <Button variant="outline">Mark all as read</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
