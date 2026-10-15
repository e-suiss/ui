import { MagnifyingGlassIcon, XCircleIcon } from "@phosphor-icons/react"
import * as React from "react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"

function SearchField() {
  const [query, setQuery] = React.useState("MacBook")
  return (
    <InputGroup>
      <InputGroupInput
        aria-label="Search"
        placeholder="Search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <InputGroupAddon>
        <MagnifyingGlassIcon />
      </InputGroupAddon>
      {query && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            aria-label="Clear search"
            className="text-label-secondary"
            onClick={() => setQuery("")}
          >
            <XCircleIcon weight="fill" />
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  )
}

export default function InputGroupSearch() {
  return (
    <div className="w-96">
      <SearchField />
    </div>
  )
}
