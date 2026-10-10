import type { Meta, StoryObj } from "@storybook/react-native"
import * as React from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Text } from "@/components/ui/text"

const items = [
  {
    value: "item-1",
    title: "Is it accessible?",
    content: "Yes. It works with VoiceOver and TalkBack.",
  },
  {
    value: "item-2",
    title: "Is it styled?",
    content:
      "Yes. It comes with default styles that match the other components.",
  },
  {
    value: "item-3",
    title: "Is it animated?",
    content: "Yes. It animates open and closed by default.",
  },
]

function AccordionItems() {
  return items.map((item) => (
    <AccordionItem key={item.value} value={item.value}>
      <AccordionTrigger>
        <Text>{item.title}</Text>
      </AccordionTrigger>
      <AccordionContent>
        <Text>{item.content}</Text>
      </AccordionContent>
    </AccordionItem>
  ))
}

const meta = {
  title: "Components/Accordion",
  component: Accordion,
} satisfies Meta<typeof Accordion>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Accordion>
      <AccordionItems />
    </Accordion>
  ),
}

export const OpenByDefault: Story = {
  render: () => (
    <Accordion defaultValue={["item-2"]}>
      <AccordionItems />
    </Accordion>
  ),
}

function MultipleDemo() {
  const [value, setValue] = React.useState<string[]>(["item-1", "item-3"])
  return (
    <Accordion multiple value={value} onValueChange={setValue}>
      <AccordionItems />
    </Accordion>
  )
}

export const Multiple: Story = {
  render: () => <MultipleDemo />,
}
