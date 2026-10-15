import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"

function RadioGroupExample(props: React.ComponentProps<typeof DropdownMenu>) {
  const [position, setPosition] = React.useState("bottom")

  return (
    <DropdownMenu {...props}>
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

export default function DropdownMenuRadioGroupExample() {
  return <RadioGroupExample />
}
