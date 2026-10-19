import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

export default function NavigationMenuDemo() {
  return (
    <div className="flex min-h-96 items-start justify-center">
      <NavigationMenu align="start">
        <NavigationMenuList>
          <NavigationMenuItem value="products">
            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-96 gap-1">
                <li>
                  <NavigationMenuLink href="#" className="items-start gap-3">
                    <IconPlaceholder
                      lucide="ChartLineIcon"
                      tabler="IconChartLine"
                      hugeicons="ChartLineData01Icon"
                      phosphor="ChartLineIcon"
                      remixicon="RiLineChartLine"
                      className="mt-0.5"
                    />
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">Analytics</span>
                      <span className="text-muted-foreground">
                        Track traffic and conversions in real time.
                      </span>
                    </div>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink href="#" className="items-start gap-3">
                    <IconPlaceholder
                      lucide="ZapIcon"
                      tabler="IconBolt"
                      hugeicons="ZapIcon"
                      phosphor="LightningIcon"
                      remixicon="RiFlashlightLine"
                      className="mt-0.5"
                    />
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">Automations</span>
                      <span className="text-muted-foreground">
                        Run workflows when events happen.
                      </span>
                    </div>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink href="#" className="items-start gap-3">
                    <IconPlaceholder
                      lucide="ShieldCheckIcon"
                      tabler="IconShieldCheck"
                      hugeicons="SecurityCheckIcon"
                      phosphor="ShieldCheckIcon"
                      remixicon="RiShieldCheckLine"
                      className="mt-0.5"
                    />
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">Security</span>
                      <span className="text-muted-foreground">
                        Single sign-on, audit logs, and roles.
                      </span>
                    </div>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem value="resources">
            <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-56 gap-1">
                <li>
                  <NavigationMenuLink href="#">
                    <IconPlaceholder
                      lucide="BookOpenIcon"
                      tabler="IconBook"
                      hugeicons="BookOpen02Icon"
                      phosphor="BookOpenIcon"
                      remixicon="RiBookOpenLine"
                    />
                    Documentation
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink href="#">
                    <IconPlaceholder
                      lucide="CodeIcon"
                      tabler="IconCode"
                      hugeicons="CodeIcon"
                      phosphor="CodeIcon"
                      remixicon="RiCodeLine"
                    />
                    API reference
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink href="#">
                    <IconPlaceholder
                      lucide="LifeBuoyIcon"
                      tabler="IconLifebuoy"
                      hugeicons="LifebuoyIcon"
                      phosphor="LifebuoyIcon"
                      remixicon="RiLifebuoyLine"
                    />
                    Help center
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              href="#"
              className={navigationMenuTriggerStyle()}
            >
              Pricing
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}
