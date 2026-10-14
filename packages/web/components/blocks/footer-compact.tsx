import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const sections = [
  {
    title: "Explore Products",
    links: ["Store", "Book", "Pad", "Phone", "Watch", "Pods", "Accessories"],
  },
  { title: "Wallet", links: ["Wallet", "suiss Pay"] },
  {
    title: "Account",
    links: ["Manage Your suiss Account", "suiss Store Account", "suiss Cloud"],
  },
  {
    title: "Entertainment",
    links: ["suiss One", "suiss TV", "suiss Music", "App Store"],
  },
  {
    title: "suiss Store",
    links: ["Find a Store", "Help Desk", "Order Status", "Shopping Help"],
  },
  {
    title: "For Business",
    links: ["suiss and Business", "Shop for Business"],
  },
  {
    title: "For Education",
    links: ["suiss and Education", "Shop for University"],
  },
  {
    title: "suiss Values",
    links: ["Accessibility", "Environment", "Privacy", "Supply Chain"],
  },
  {
    title: "About suiss",
    links: ["Newsroom", "Leadership", "Careers", "Investors", "Contact suiss"],
  },
]

const slug = (text: string) =>
  `#${text.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}`

export function FooterCompact() {
  return (
    <footer className="bg-surface-secondary text-xs text-label-secondary">
      <div className="mx-auto flex max-w-md flex-col gap-3 px-4 py-5">
        <Breadcrumb className="border-b border-separator pb-3">
          <BreadcrumbList className="gap-2 text-xs">
            <BreadcrumbItem>
              <BreadcrumbLink href="#home" className="font-semibold text-label">
                suiss
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#phone" className="text-label">
                Phone
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Phone Pro</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Accordion aria-label="Directory">
          {sections.map((section) => (
            <AccordionItem
              key={section.title}
              value={section.title}
              className="ms-0 border-b border-separator not-first:border-t-0"
            >
              <AccordionTrigger className="pe-0 text-sm text-label hover:no-underline">
                {section.title}
              </AccordionTrigger>
              <AccordionContent className="pe-0 pb-3.5 [&_a]:no-underline [&_a]:hover:underline">
                <ul className="flex flex-col gap-2.5 ps-3">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a href={slug(link)} className="text-sm text-label">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <p className="mt-2">
          More ways to shop:{" "}
          <a href="#stores" className="text-link underline">
            Find a suiss Store near you
          </a>{" "}
          or call <span className="whitespace-nowrap">1-800-555-0199</span>.
        </p>
        <p>Copyright © 2026 suiss Inc. All rights reserved.</p>
        <a href="#region" className="w-fit text-label hover:underline">
          United States
        </a>
      </div>
    </footer>
  )
}
