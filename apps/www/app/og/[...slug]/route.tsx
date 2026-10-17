import { notFound } from "next/navigation"

import { dictionary } from "@/lib/dictionary"
import { ogImage } from "@/lib/og"
import { getProduct, products } from "@/lib/products"

export async function GET(
  _request: Request,
  context: RouteContext<"/og/[...slug]">
) {
  const { slug } = await context.params
  const path = slug.slice(0, -1)

  if (path.length === 0)
    return ogImage({
      title: dictionary.heroTitle,
      description: dictionary.heroSubtitle,
    })

  const product = getProduct(path[0])
  if (!product) notFound()
  return ogImage({
    title: product.name,
    description: product.tagline,
    eyebrow: product.category,
  })
}

export function generateStaticParams() {
  return [
    { slug: ["image.png"] },
    ...products.map((product) => ({ slug: [product.slug, "image.png"] })),
  ]
}

export const dynamic = "force-static"
export const dynamicParams = false
