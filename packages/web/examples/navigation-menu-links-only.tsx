import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

export default function NavigationMenuLinksOnly() {
  return (
    <div className="flex min-h-96 items-start justify-center">
      <NavigationMenu align="start">
        <NavigationMenuList>
          {["Overview", "Customers", "Changelog", "Blog"].map(
            (label, index) => (
              <NavigationMenuItem key={label}>
                <NavigationMenuLink
                  href="#"
                  active={index === 0}
                  className={navigationMenuTriggerStyle()}
                >
                  {label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            )
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}
