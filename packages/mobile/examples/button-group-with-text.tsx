import { LinkIcon } from "phosphor-react-native"
import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupText } from "@/components/ui/button-group"
import { Icon } from "@/components/ui/icon"
import { Input } from "@/components/ui/input"
import { Text } from "@/components/ui/text"

export default function ButtonGroupWithText() {
  return (
    <ButtonGroup className="self-stretch">
      <ButtonGroupText>
        <Icon as={LinkIcon} />
        <Text>https://</Text>
      </ButtonGroupText>
      <Input
        accessibilityLabel="Website"
        placeholder="example.com"
        className="w-auto flex-1"
      />
      <Button variant="secondary" size="lg">
        <Text>Save</Text>
      </Button>
    </ButtonGroup>
  )
}
