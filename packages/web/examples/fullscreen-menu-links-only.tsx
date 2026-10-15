import * as React from "react"
import {
  FullscreenMenu,
  FullscreenMenuContent,
  FullscreenMenuGroup,
  FullscreenMenuLabel,
  FullscreenMenuLink,
  FullscreenMenuTitle,
  FullscreenMenuTrigger,
} from "@/components/ui/fullscreen-menu"

const primary = ["Store", "Products", "Services", "Company", "Support"]

const sections = [
  { label: "Explore", links: ["Overview", "Compare", "Accessories"] },
  { label: "Shop", links: ["Shop online", "Find a store", "Order status"] },
]

function MenuExample({
  defaultOpen,
  closeLabel,
  withSections = true,
}: {
  defaultOpen?: boolean
  closeLabel?: string
  withSections?: boolean
}) {
  const [active, setActive] = React.useState("Store")

  return (
    <div className="flex h-14 items-center justify-between px-4">
      <span className="font-semibold">Acme</span>
      <FullscreenMenu defaultOpen={defaultOpen}>
        <FullscreenMenuTrigger aria-label="Menu" />
        <FullscreenMenuContent closeLabel={closeLabel}>
          <FullscreenMenuTitle>Menu</FullscreenMenuTitle>
          <FullscreenMenuGroup>
            {primary.map((link) => (
              <FullscreenMenuLink
                key={link}
                href={`#${link.toLowerCase()}`}
                isActive={active === link}
                onClick={() => setActive(link)}
              >
                {link}
              </FullscreenMenuLink>
            ))}
          </FullscreenMenuGroup>
          {withSections &&
            sections.map((section) => (
              <FullscreenMenuGroup key={section.label}>
                <FullscreenMenuLabel>{section.label}</FullscreenMenuLabel>
                {section.links.map((link) => (
                  <FullscreenMenuLink
                    key={link}
                    href={`#${link.toLowerCase().replaceAll(" ", "-")}`}
                  >
                    {link}
                  </FullscreenMenuLink>
                ))}
              </FullscreenMenuGroup>
            ))}
        </FullscreenMenuContent>
      </FullscreenMenu>
    </div>
  )
}

export default function FullscreenMenuLinksOnly() {
  return <MenuExample withSections={false} />
}
