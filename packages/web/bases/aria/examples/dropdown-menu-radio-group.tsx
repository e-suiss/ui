import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"

export default function DropdownMenuRadioGroupExample() {
  const [position, setPosition] = React.useState("bottom")

  return (
    <DropdownMenu>
      <Button variant="outline">Panel position</Button>
      <DropdownMenuContent className="w-56">
        <DropdownMenuRadioGroup value={position} onChange={setPosition}>
          <DropdownMenuLabel>Position</DropdownMenuLabel>
          <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
