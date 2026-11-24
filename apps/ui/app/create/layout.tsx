import { DocsSidebar } from "@/components/site/docs-sidebar"
import { LocalNav } from "@/components/site/local-nav"
import { SidebarProvider } from "@/components/ui/sidebar"
import { source } from "@/lib/source"

export default function CreateLayout(props: LayoutProps<"/create">) {
  return (
    <SidebarProvider className="min-h-0 flex-1 flex-col">
      <LocalNav />
      <div className="md:hidden">
        <DocsSidebar nodes={source.getPageTree().children} />
      </div>
      {props.children}
    </SidebarProvider>
  )
}
