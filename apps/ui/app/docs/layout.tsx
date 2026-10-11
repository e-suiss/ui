import { DocsSidebar } from "@/components/site/docs-sidebar";
import { LocalNav } from "@/components/site/local-nav";
import { SidebarProvider } from "@/components/ui/sidebar";
import { source } from "@/lib/source";

export default function DocsLayout(props: LayoutProps<"/docs">) {
  return (
    <SidebarProvider className="min-h-0 flex-1 flex-col">
      <LocalNav />
      <div className="mx-auto flex w-full max-w-[1680px] flex-1 md:ps-6">
        <DocsSidebar nodes={source.getPageTree().children} />
        <div className="min-w-0 flex-1">{props.children}</div>
      </div>
    </SidebarProvider>
  );
}
