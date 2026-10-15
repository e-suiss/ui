import {
  Flyout,
  FlyoutBody,
  FlyoutContent,
  FlyoutDescription,
  FlyoutHeader,
  FlyoutTitle,
  FlyoutTrigger,
} from "@/components/patterns/flyout"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function FlyoutFloating() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <Flyout floating>
        <FlyoutTrigger className={buttonVariants({ variant: "outline" })}>
          Dimensions
        </FlyoutTrigger>
        <FlyoutContent>
          <FlyoutHeader>
            <FlyoutTitle>Dimensions</FlyoutTitle>
            <FlyoutDescription>
              Set the dimensions for the layer.
            </FlyoutDescription>
          </FlyoutHeader>
          <FlyoutBody className="grid gap-3">
            <div className="grid grid-cols-3 items-center gap-3">
              <Label htmlFor="flyout-width">Width</Label>
              <Input
                id="flyout-width"
                defaultValue="100%"
                className="col-span-2"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-3">
              <Label htmlFor="flyout-height">Height</Label>
              <Input
                id="flyout-height"
                defaultValue="25px"
                className="col-span-2"
              />
            </div>
          </FlyoutBody>
        </FlyoutContent>
      </Flyout>
    </div>
  )
}
