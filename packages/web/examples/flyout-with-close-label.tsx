import {
  Flyout,
  FlyoutBody,
  FlyoutContent,
  FlyoutDescription,
  FlyoutHeader,
  FlyoutTitle,
  FlyoutTrigger,
} from "@/components/patterns/flyout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function FlyoutWithCloseLabel() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <Flyout>
        <FlyoutTrigger render={<Button variant="outline" />}>
          Filters
        </FlyoutTrigger>
        <FlyoutContent showCloseButton closeLabel="Done">
          <FlyoutHeader>
            <FlyoutTitle>Filters</FlyoutTitle>
            <FlyoutDescription>Narrow down the orders list.</FlyoutDescription>
          </FlyoutHeader>
          <FlyoutBody className="grid gap-2">
            <Label htmlFor="flyout-search">Customer</Label>
            <Input id="flyout-search" placeholder="Search by name" />
          </FlyoutBody>
        </FlyoutContent>
      </Flyout>
    </div>
  )
}
