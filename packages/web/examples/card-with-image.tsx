import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function CardWithImage() {
  return (
    <Card className="w-96">
      <img
        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80"
        alt="Mountain lake at sunrise"
        className="aspect-video w-full object-cover"
      />
      <CardHeader>
        <CardTitle>Lake Louise</CardTitle>
        <CardDescription>Banff National Park, Canada</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="w-full">Book a stay</Button>
      </CardFooter>
    </Card>
  )
}
