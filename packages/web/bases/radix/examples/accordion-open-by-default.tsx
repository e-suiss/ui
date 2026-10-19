import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function AccordionOpenByDefault() {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue="shipping"
      className="w-96"
    >
      <AccordionItem value="shipping">
        <AccordionTrigger>How long does shipping take?</AccordionTrigger>
        <AccordionContent>
          Orders ship within two business days and arrive in three to five days.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="returns">
        <AccordionTrigger>Can I return an item?</AccordionTrigger>
        <AccordionContent>
          Items can be returned within 14 days of delivery for a full refund.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="support">
        <AccordionTrigger>How do I contact support?</AccordionTrigger>
        <AccordionContent>
          Reach the support team from the help center, available around the
          clock.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
