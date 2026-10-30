import { notFound } from "next/navigation"
import { DocsSidebar } from "@/components/docs-sidebar"
import { getProduct } from "@/lib/products"
import { docsTree } from "@/lib/source"

export default async function DocsLayout({
  params,
  children,
}: LayoutProps<"/[product]/docs">) {
  const { product: slug } = await params
  const product = getProduct(slug)
  const tree = docsTree(slug)
  if (!product || !tree) notFound()

  return (
    <div className="mx-auto flex w-full max-w-[1680px] flex-1 flex-col pt-11 md:flex-row md:px-10 md:pt-20">
      <DocsSidebar tree={tree} label={`${product.name} docs`} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}
