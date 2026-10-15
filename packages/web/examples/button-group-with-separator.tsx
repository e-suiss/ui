import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group"

export default function ButtonGroupWithSeparator() {
  return (
    <ButtonGroup orientation="horizontal">
      <Button variant="secondary">
        <IconPlaceholder
          lucide="CopyIcon"
          tabler="IconCopy"
          hugeicons="Copy01Icon"
          phosphor="CopyIcon"
          remixicon="RiFileCopyLine"
          data-icon="inline-start"
        />
        Copy
      </Button>
      <ButtonGroupSeparator />
      <Button variant="secondary">
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
