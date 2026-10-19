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

export default function FullscreenMenuWithCloseLabel() {
  const [active, setActive] = React.useState("Store")

  return (
    <div className="flex h-14 items-center justify-between px-4">
      <span className="font-semibold">Acme</span>
      <FullscreenMenu>
        <FullscreenMenuTrigger aria-label="Menu" />
        <FullscreenMenuContent closeLabel="Done">
          <FullscreenMenuTitle>Menu</FullscreenMenuTitle>
          <FullscreenMenuGroup>
            <FullscreenMenuLink
              href="#store"
              isActive={active === "Store"}
              onClick={() => setActive("Store")}
            >
              Store
            </FullscreenMenuLink>
            <FullscreenMenuLink
              href="#products"
              isActive={active === "Products"}
              onClick={() => setActive("Products")}
            >
              Products
            </FullscreenMenuLink>
            <FullscreenMenuLink
              href="#services"
              isActive={active === "Services"}
              onClick={() => setActive("Services")}
            >
              Services
            </FullscreenMenuLink>
            <FullscreenMenuLink
              href="#company"
              isActive={active === "Company"}
              onClick={() => setActive("Company")}
            >
              Company
            </FullscreenMenuLink>
            <FullscreenMenuLink
              href="#support"
              isActive={active === "Support"}
              onClick={() => setActive("Support")}
            >
              Support
            </FullscreenMenuLink>
          </FullscreenMenuGroup>
          <FullscreenMenuGroup>
            <FullscreenMenuLabel>Explore</FullscreenMenuLabel>
            <FullscreenMenuLink href="#overview">Overview</FullscreenMenuLink>
            <FullscreenMenuLink href="#compare">Compare</FullscreenMenuLink>
            <FullscreenMenuLink href="#accessories">
              Accessories
            </FullscreenMenuLink>
          </FullscreenMenuGroup>
          <FullscreenMenuGroup>
            <FullscreenMenuLabel>Shop</FullscreenMenuLabel>
            <FullscreenMenuLink href="#shop-online">
              Shop online
            </FullscreenMenuLink>
            <FullscreenMenuLink href="#find-a-store">
              Find a store
            </FullscreenMenuLink>
            <FullscreenMenuLink href="#order-status">
              Order status
            </FullscreenMenuLink>
          </FullscreenMenuGroup>
        </FullscreenMenuContent>
      </FullscreenMenu>
    </div>
  )
}
