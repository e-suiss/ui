import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"

export default function ButtonGroupPlain() {
  return (
    <ButtonGroup orientation="horizontal">
      <Button variant="plain">
        <IconPlaceholder
          lucide="ArrowLeftIcon"
          tabler="IconArrowLeft"
          hugeicons="ArrowLeft02Icon"
          phosphor="ArrowLeftIcon"
          remixicon="RiArrowLeftLine"
          data-icon="inline-start"
        />
        Back
      </Button>
      <Button variant="plain">
        Forward
        <IconPlaceholder
          lucide="ArrowRightIcon"
          tabler="IconArrowRight"
          hugeicons="ArrowRight02Icon"
          phosphor="ArrowRightIcon"
          remixicon="RiArrowRightLine"
          data-icon="inline-end"
        />
      </Button>
      <Button variant="plain">
        <IconPlaceholder
          lucide="ShareIcon"
          tabler="IconShare2"
          hugeicons="Share01Icon"
          phosphor="ShareIcon"
          remixicon="RiShareForwardBoxLine"
          data-icon="inline-start"
        />
        Share
      </Button>
    </ButtonGroup>
  )
}
