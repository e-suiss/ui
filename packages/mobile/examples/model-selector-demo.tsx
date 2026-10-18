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

const providers = [
  { name: "Anthropic", models: ["Claude Opus 5.5", "Claude Sonnet 5.5"] },
  { name: "OpenAI", models: ["GPT-5", "GPT-5 mini"] },
]

function ModelSelector() {
  const [model, setModel] = React.useState("Claude Opus 5.5")
  return (
    <View className="items-start">
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
          <Text>{model}</Text>
          <Icon as={CaretDownIcon} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          {providers.map((provider, index) => (
            <View key={provider.name}>
              {index > 0 ? <DropdownMenuSeparator /> : null}
              <DropdownMenuLabel>{provider.name}</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={model} onValueChange={setModel}>
                {provider.models.map((name) => (
                  <DropdownMenuRadioItem key={name} value={name}>
                    <Text>{name}</Text>
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </View>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </View>
  )
}

export default function ModelSelectorDemo() {
  return <ModelSelector />
}
