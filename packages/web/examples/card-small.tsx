import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function CardSmall() {
  return (
    <Card className="w-96" size="sm">
      <CardHeader>
        <CardTitle>Team plan</CardTitle>
        <CardDescription>
          Everything your team needs to ship faster.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          Unlimited projects, shared workspaces, and priority support for up to
          ten members.
        </p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button>Upgrade</Button>
        <Button variant="ghost">Learn more</Button>
      </CardFooter>
    </Card>
  )
}
