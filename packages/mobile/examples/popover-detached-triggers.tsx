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

const memberPopover = createHandle<{ id: string; name: string; role: string }>()

export default function PopoverDetachedTriggers() {
  return (
    <View className="flex-row items-start gap-2">
      <PopoverTrigger
        id="ada"
        handle={memberPopover}
        payload={{ id: "ada", name: "Ada", role: "Design lead" }}
        render={<Button variant="outline" />}
      >
        <Text>Ada</Text>
      </PopoverTrigger>
      <PopoverTrigger
        id="linus"
        handle={memberPopover}
        payload={{ id: "linus", name: "Linus", role: "Platform engineer" }}
        render={<Button variant="outline" />}
      >
        <Text>Linus</Text>
      </PopoverTrigger>
      <PopoverTrigger
        id="grace"
        handle={memberPopover}
        payload={{ id: "grace", name: "Grace", role: "Product manager" }}
        render={<Button variant="outline" />}
      >
        <Text>Grace</Text>
      </PopoverTrigger>
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
