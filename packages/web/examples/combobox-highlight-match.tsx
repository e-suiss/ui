import * as React from "react"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"

const frameworks = ["Next.js", "Remix", "Astro", "SvelteKit", "Nuxt", "Gatsby"]

function HighlightedMatch({ text, query }: { text: string; query: string }) {
  const start = query ? text.toLowerCase().indexOf(query.toLowerCase()) : -1
  if (start < 0) return text
  return (
    <span>
      {text.slice(0, start)}
      <span className="font-semibold">
        {text.slice(start, start + query.length)}
      </span>
      {text.slice(start + query.length)}
    </span>
  )
}

export default function ComboboxHighlightMatch() {
  const [query, setQuery] = React.useState("")
  return (
    <div className="w-72">
      <Combobox
        items={frameworks}
        inputValue={query}
        onInputValueChange={setQuery}
      >
        <ComboboxInput placeholder="Type to filter" />
        <ComboboxContent>
          <ComboboxEmpty>No framework found.</ComboboxEmpty>
          <ComboboxList>
            {(item: string) => (
              <ComboboxItem key={item} value={item}>
                <HighlightedMatch text={item} query={query} />
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}
