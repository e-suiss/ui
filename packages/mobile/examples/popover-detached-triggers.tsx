import { View } from "react-native"
import { createHandle } from "@/components/primitives/popover"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Text } from "@/components/ui/text"

const members = [
  { id: "ada", name: "Ada", role: "Design lead" },
  { id: "linus", name: "Linus", role: "Platform engineer" },
  { id: "grace", name: "Grace", role: "Product manager" },
]

const memberPopover = createHandle<(typeof members)[number]>()

export default function PopoverDetachedTriggers() {
  return (
    <View className="flex-row items-start gap-2">
      {members.map((member) => (
        <PopoverTrigger
          key={member.id}
          id={member.id}
          handle={memberPopover}
          payload={member}
          render={<Button variant="outline" />}
        >
          <Text>{member.name}</Text>
        </PopoverTrigger>
      ))}
      <Popover handle={memberPopover}>
        {({ payload }) => (
          <PopoverContent align="start">
            <PopoverHeader>
              <PopoverTitle>{payload?.name}</PopoverTitle>
              <PopoverDescription>{payload?.role}</PopoverDescription>
            </PopoverHeader>
          </PopoverContent>
        )}
      </Popover>
    </View>
  )
}
