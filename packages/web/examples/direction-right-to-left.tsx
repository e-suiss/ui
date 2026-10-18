import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DirectionProvider, useDirection } from "@/components/ui/direction"

function DirectionPreview() {
  const direction = useDirection()

  return (
    <Card dir={direction} className="w-80">
      <CardHeader>
        <CardTitle>Reading direction</CardTitle>
        <CardDescription>
          <bdi>Current direction is {direction.toUpperCase()}.</bdi>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          <bdi>
            Components that use logical properties flip their layout when the
            direction changes.
          </bdi>
        </p>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="ghost">Cancel</Button>
        <Button>
          Continue
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
            data-icon="inline-end"
            className="rtl:rotate-180"
          />
        </Button>
      </CardFooter>
    </Card>
  )
}

export default function DirectionRightToLeft() {
  return (
    <DirectionProvider direction="rtl">
      <DirectionPreview />
    </DirectionProvider>
  )
}
