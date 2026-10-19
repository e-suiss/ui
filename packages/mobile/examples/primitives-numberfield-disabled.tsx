import { cn } from "cn"
import { MinusIcon, PlusIcon } from "phosphor-react-native"
import * as NumberField from "@/components/primitives/number-field"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

export default function PrimitivesNumberfieldDisabled() {
  return (
    <NumberField.Root
      className={(state) => cn("w-full gap-2", state.disabled && "opacity-50")}
      defaultValue={1}
      min={0}
      max={10}
      disabled
    >
      <Text className="text-sm font-medium">Quantity</Text>
      <NumberField.Group className="h-11 flex-row items-center overflow-hidden rounded-lg bg-secondary">
        <NumberField.Decrement className="h-full w-12 items-center justify-center">
          <Icon as={MinusIcon} className="size-4" />
        </NumberField.Decrement>
        <NumberField.Input
          accessibilityLabel="Quantity"
          className="h-full flex-1 text-center text-base text-foreground"
        />
        <NumberField.Increment className="h-full w-12 items-center justify-center">
          <Icon as={PlusIcon} className="size-4" />
        </NumberField.Increment>
      </NumberField.Group>
    </NumberField.Root>
  )
}
