import { CaretDownIcon } from "phosphor-react-native"
import * as React from "react"
import { View } from "react-native"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

export default function ModelSelectorDemo() {
  const [model, setModel] = React.useState("Claude Opus 5.5")
  return (
    <View className="items-start">
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
          <Text>{model}</Text>
          <Icon as={CaretDownIcon} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuLabel>Anthropic</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={model} onValueChange={setModel}>
            <DropdownMenuRadioItem value="Claude Opus 5.5">
              <Text>Claude Opus 5.5</Text>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="Claude Sonnet 5.5">
              <Text>Claude Sonnet 5.5</Text>
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>OpenAI</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={model} onValueChange={setModel}>
            <DropdownMenuRadioItem value="GPT-5">
              <Text>GPT-5</Text>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="GPT-5 mini">
              <Text>GPT-5 mini</Text>
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </View>
  )
}
