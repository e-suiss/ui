import { ExamplePreview } from "@/components/site/example-preview"
import type { CreateItem } from "@/lib/create/items"
import { cn } from "@/lib/utils"

export function ItemView({ group, item }: { group: string; item: CreateItem }) {
  const wide = item.examples.some((example) => example.type === "block")
  const charts = item.examples.every((example) => example.type === "chart")
  return (
    <div className="flex min-h-svh flex-col gap-8 bg-muted p-4 md:p-8 dark:bg-background">
      <div className="flex flex-col gap-1">
        <p className="font-mono text-[11px] tracking-[0.02em] text-muted-foreground uppercase">
          {group}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">{item.title}</h1>
      </div>
      <div
        className={cn(
          "grid items-start gap-x-6 gap-y-8",
          !wide && "md:grid-cols-2",
          !wide && !charts && "2xl:grid-cols-3"
        )}
      >
        {item.examples.map((example) => (
          <section
            key={example.name}
            className="flex min-w-0 flex-col *:data-not-prose:mt-3"
          >
            {item.examples.length > 1 && (
              <h2 className="text-sm font-medium text-muted-foreground">
                {example.title}
              </h2>
            )}
            <ExamplePreview
              type={example.type}
              name={example.name}
              layout={example.layout}
            />
          </section>
        ))}
      </div>
    </div>
  )
}
