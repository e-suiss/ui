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

export default function AccordionFilled() {
  return (
    <Accordion variant="filled">
      <AccordionItems />
    </Accordion>
  )
}
