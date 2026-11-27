import { DocsSidebar } from "@/components/site/docs-sidebar"
import { LocalNav } from "@/components/site/local-nav"
import { SidebarProvider } from "@/components/ui/sidebar"
import { hubWeights } from "@/lib/hubs"
import { source } from "@/lib/source"

export default function DocsLayout(props: LayoutProps<"/docs">) {
  return (
    <SidebarProvider className="min-h-0 flex-1 flex-col has-[[data-slot=sidebar][data-variant=inset]]:bg-transparent">
      <LocalNav />
      <div className="flex w-full flex-1 md:ps-6">
        <DocsSidebar
          nodes={source.getPageTree().children}
          weights={hubWeights()}
        />
        <div className="min-w-0 flex-1">{props.children}</div>
      </div>
    </SidebarProvider>
  )
}
