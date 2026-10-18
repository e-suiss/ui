import { View } from "react-native"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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

export default function DropdownMenuInset() {
  return (
    <View className="items-start">
      <DropdownMenu>
        <OpenButton />
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuLabel inset>Actions</DropdownMenuLabel>
          <DropdownMenuItem inset>
            <Text>Copy</Text>
          </DropdownMenuItem>
          <DropdownMenuItem inset>
            <Text>Paste</Text>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem inset variant="destructive">
            <Text>Delete</Text>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </View>
  )
}
