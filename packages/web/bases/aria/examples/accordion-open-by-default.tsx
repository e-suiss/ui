import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const items = [
  {
    value: "shipping",
    title: "How long does shipping take?",
    content:
      "Orders ship within two business days and arrive in three to five days.",
  },
  {
    value: "returns",
    title: "Can I return an item?",
    content:
      "Items can be returned within 14 days of delivery for a full refund.",
  },
  {
    value: "support",
    title: "How do I contact support?",
    content:
      "Reach the support team from the help center, available around the clock.",
  },
]

export default function AccordionOpenByDefault() {
  return (
    <div className="w-96">
      <Accordion defaultExpandedKeys={["shipping"]}>
        {items.map((item) => (
          <AccordionItem key={item.value} id={item.value}>
            <AccordionTrigger>{item.title}</AccordionTrigger>
            <AccordionContent>{item.content}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
