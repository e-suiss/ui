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
import { Text } from "@/components/ui/text"

function OpenButton({ label = "Open menu" }: { label?: string }) {
  return (
    <DropdownMenuTrigger render={<Button variant="outline" />}>
      <Text>{label}</Text>
    </DropdownMenuTrigger>
  )
}

function RadioGroupDemo() {
  const [position, setPosition] = React.useState("bottom")
  return (
    <View className="items-start">
      <DropdownMenu>
        <OpenButton label="Panel position" />
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuLabel>Panel position</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
            <DropdownMenuRadioItem value="top">
              <Text>Top</Text>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="bottom">
              <Text>Bottom</Text>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="right">
              <Text>Right</Text>
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </View>
  )
}

export default function DropdownMenuRadioGroupExample() {
  return <RadioGroupDemo />
}
