import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"

export default function DropdownMenuCheckboxes() {
  const [statusBar, setStatusBar] = React.useState(true)
  const [activityBar, setActivityBar] = React.useState(false)
  const [panel, setPanel] = React.useState(false)

  return (
    <DropdownMenu>
      <Button variant="outline">View</Button>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Appearance</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            isSelected={statusBar}
            onChange={setStatusBar}
          >
            Status bar
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            isSelected={activityBar}
            onChange={setActivityBar}
          >
            Activity bar
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            isSelected={panel}
            onChange={setPanel}
            isDisabled
          >
            Panel
          </DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
