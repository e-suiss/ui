import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"

export default function InputGroupBlockAddons() {
  return (
    <div className="flex w-96 flex-col gap-4">
      <InputGroup>
        <InputGroupInput placeholder="Enter a title" />
        <InputGroupAddon align="block-start">
          <InputGroupText>Title</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="Enter an amount" />
        <InputGroupAddon align="block-end">
          <InputGroupText>Minimum payment is $5.00</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
