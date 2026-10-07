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
    links: [
      "Store",
      "Book",
      "Pad",
      "Phone",
      "Watch",
      "Vision",
      "Pods",
      "TV & Home",
      "Tag",
      "Accessories",
      "Gift Cards",
    ],
  },
  { title: "Wallet", links: ["Wallet", "suiss Pay"] },
  {
    title: "Account",
    links: ["Manage Your suiss Account", "suiss Store Account", "suiss Cloud"],
  },
  {
    title: "Entertainment",
    links: [
      "suiss One",
      "suiss TV",
      "suiss Music",
      "suiss Arcade",
      "suiss Podcasts",
      "App Store",
    ],
  },
  {
    title: "suiss Store",
    links: [
      "Find a Store",
      "Help Desk",
      "Today at suiss",
      "Trade In",
      "Order Status",
      "Shopping Help",
    ],
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
    links: [
      "Newsroom",
      "Leadership",
      "Careers",
      "Investors",
      "Ethics & Compliance",
      "Events",
      "Contact suiss",
    ],
  },
]

const columns = [[0], [1, 2, 3], [4], [5, 6], [7, 8]]

const legal = [
  "Privacy Policy",
  "Terms of Use",
  "Sales Policy",
  "Legal",
  "Site Map",
]

const slug = (text: string) =>
  `#${text.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}`

export function FooterDirectory() {
  return (
    <footer className="bg-surface-secondary text-xs text-label-secondary">
      <div className="mx-auto flex max-w-245 flex-col gap-4 px-5.5 pt-6 pb-5.5">
        <div className="flex flex-col gap-2 border-b border-separator pb-4">
          <p>
            1. Payment plans are subject to credit approval. Installment options
            vary by bank.
          </p>
          <p>
            2. Battery life varies by use and configuration. See
            suiss.com/batteries for more information.
          </p>
          <p>Some features may not be available in all regions or languages.</p>
        </div>
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
        <nav
          aria-label="Directory"
          className="hidden grid-cols-5 gap-5 md:grid"
        >
          {columns.map((group) => (
            <div key={group[0]} className="flex flex-col gap-6">
              {group.map((index) => {
                const section = sections[index]
                if (!section) return null
                return (
                  <div key={section.title} className="flex flex-col gap-2">
                    <h3 className="font-semibold text-label">
                      {section.title}
                    </h3>
                    <ul className="flex flex-col gap-2">
                      {section.links.map((link) => (
                        <li key={link}>
                          <a href={slug(link)} className="hover:underline">
                            {link}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          ))}
        </nav>
        <Accordion aria-label="Directory" className="md:hidden">
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
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-separator pt-2.5">
          <span>Copyright © 2026 suiss Inc. All rights reserved.</span>
          <ul className="flex flex-wrap leading-6">
            {legal.map((link) => (
              <li
                key={link}
                className="border-separator-strong px-2 text-label not-first:border-s first:ps-0"
              >
                <a href={slug(link)} className="hover:underline">
                  {link}
                </a>
              </li>
            ))}
          </ul>
          <a href="#region" className="text-label hover:underline md:ms-auto">
            United States
          </a>
        </div>
      </div>
    </footer>
  )
}
