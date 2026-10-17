import { LocalNav } from "@/components/site/local-nav"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function CreateLayout(props: LayoutProps<"/create">) {
  return (
    <SidebarProvider className="min-h-0 flex-1 flex-col">
      <LocalNav />
      {props.children}
    </SidebarProvider>
  )
}
