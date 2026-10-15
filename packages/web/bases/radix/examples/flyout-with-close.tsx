import {
  Flyout,
  FlyoutBody,
  FlyoutClose,
  FlyoutContent,
  FlyoutDescription,
  FlyoutHeader,
  FlyoutTitle,
  FlyoutTrigger,
} from "@/components/patterns/flyout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function FlyoutWithClose() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <Flyout>
        <FlyoutTrigger asChild>
          <Button variant="outline">Share</Button>
        </FlyoutTrigger>
        <FlyoutContent>
          <FlyoutHeader>
            <FlyoutTitle>Share link</FlyoutTitle>
            <FlyoutDescription>
              Anyone with the link can view this project.
            </FlyoutDescription>
          </FlyoutHeader>
          <FlyoutBody className="grid gap-3">
            <Input
              readOnly
              aria-label="Project link"
              defaultValue="https://esuiss.dev/p/1042"
            />
            <FlyoutClose asChild>
              <Button>Copy link</Button>
            </FlyoutClose>
          </FlyoutBody>
        </FlyoutContent>
      </Flyout>
    </div>
  )
}
