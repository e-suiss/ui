import { MagnifyingGlassIcon } from "phosphor-react-native"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Icon } from "@/components/ui/icon"
import { Input } from "@/components/ui/input"

export default function ButtonGroupWithInput() {
  return (
    <ButtonGroup className="self-stretch">
      <Input
        accessibilityLabel="Search"
        placeholder="Search..."
        className="w-auto flex-1"
      />
      <Button variant="secondary" size="icon-lg" accessibilityLabel="Search">
        <Icon as={MagnifyingGlassIcon} />
      </Button>
    </ButtonGroup>
  )
}
