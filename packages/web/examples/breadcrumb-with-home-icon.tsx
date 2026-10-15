import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function BreadcrumbWithHomeIcon() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
            href="#"
            aria-label="Home"
            className="text-foreground"
          >
            <IconPlaceholder
              lucide="HouseIcon"
              tabler="IconHome"
              hugeicons="Home01Icon"
              phosphor="HouseIcon"
              remixicon="RiHomeLine"
            />
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Menu</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Main Courses</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Grilled Meatballs</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
