import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Text } from "@/components/ui/text"

export default function AccordionDemo() {
  return (
    <Accordion>
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <Text>Is it accessible?</Text>
        </AccordionTrigger>
        <AccordionContent>
          <Text>Yes. It works with VoiceOver and TalkBack.</Text>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>
          <Text>Is it styled?</Text>
        </AccordionTrigger>
        <AccordionContent>
          <Text>
            Yes. It comes with default styles that match the other components.
          </Text>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>
          <Text>Is it animated?</Text>
        </AccordionTrigger>
        <AccordionContent>
          <Text>Yes. It animates open and closed by default.</Text>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
