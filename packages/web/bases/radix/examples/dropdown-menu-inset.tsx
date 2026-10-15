import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function DropdownMenuInset() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel inset>Clipboard</DropdownMenuLabel>
          <DropdownMenuItem inset>
            Cut
            <DropdownMenuShortcut mod>X</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem inset>
            Copy
            <DropdownMenuShortcut mod>C</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem inset>
            Paste
            <DropdownMenuShortcut mod>V</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
