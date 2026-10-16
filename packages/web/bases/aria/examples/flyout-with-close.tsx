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
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function FlyoutWithClose() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <Flyout>
        <FlyoutTrigger className={buttonVariants({ variant: "outline" })}>
          Share
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
              defaultValue="https://example.com/p/1042"
            />
            <FlyoutClose className={buttonVariants()}>Copy link</FlyoutClose>
          </FlyoutBody>
        </FlyoutContent>
      </Flyout>
    </div>
  )
}
