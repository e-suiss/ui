import { Image } from "react-native"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Text } from "@/components/ui/text"

export default function CardWithImage() {
  return (
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
  )
}
