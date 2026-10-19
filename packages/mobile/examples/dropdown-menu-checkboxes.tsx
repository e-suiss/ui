import * as React from "react"
import { View } from "react-native"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Text } from "@/components/ui/text"

export default function DropdownMenuCheckboxes() {
  const [statusBar, setStatusBar] = React.useState(true)
  const [activityBar, setActivityBar] = React.useState(false)
  const [panel, setPanel] = React.useState(false)
  return (
    <View className="items-start">
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="outline" />}>
          <Text>View</Text>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuLabel>Appearance</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={statusBar}
            onCheckedChange={setStatusBar}
          >
            <Text>Status bar</Text>
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={activityBar}
            onCheckedChange={setActivityBar}
            disabled
          >
            <Text>Activity bar</Text>
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem checked={panel} onCheckedChange={setPanel}>
            <Text>Panel</Text>
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </View>
  )
}
