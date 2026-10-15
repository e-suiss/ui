import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

export default function InputGroupInvalid() {
  return (
    <div className="w-96">
      <InputGroup>
        <InputGroupInput defaultValue="jane@" aria-label="Email" aria-invalid />
        <InputGroupAddon align="inline-end">
          <IconPlaceholder
            lucide="InfoIcon"
            tabler="IconInfoCircle"
            hugeicons="InformationCircleIcon"
            phosphor="InfoIcon"
            remixicon="RiInformationLine"
            className="text-destructive"
          />
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
