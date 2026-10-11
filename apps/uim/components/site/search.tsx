"use client";

import { FileTextIcon, HashIcon, MagnifyingGlassIcon, TextAlignLeftIcon } from "@phosphor-icons/react";
import { useDocsSearch } from "fumadocs-core/search/client";
import { fetchClient } from "fumadocs-core/search/client/fetch";
import { cn } from "cn";
import { useRouter } from "next/navigation";
import * as React from "react";

import {
  CommandPalette,
  CommandPaletteContent,
  CommandPaletteTrigger,
} from "@/components/patterns/command-palette";
import { strings } from "@/lib/strings";
import { Button } from "@/components/ui/button";
import { CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

const MARK = /<mark>|<\/mark>/;

function Highlighted({ text }: { text: string }) {
  return text.split(MARK).map((part, index) =>
    index % 2 === 1 ? (
      // biome-ignore lint/suspicious/noArrayIndexKey: parts have no identity
      <mark key={index} className="bg-transparent font-semibold text-label">
        {part}
      </mark>
    ) : (
      // biome-ignore lint/suspicious/noArrayIndexKey: parts have no identity
      <React.Fragment key={index}>{part}</React.Fragment>
    ),
  );
}

const icons = {
  page: FileTextIcon,
  heading: HashIcon,
  text: TextAlignLeftIcon,
};

export function Search({
  className,
  variant = "icon",
  hotkey = true,
}: {
  className?: string;
  variant?: "icon" | "field";
  hotkey?: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const client = React.useMemo(() => fetchClient(), []);
  const { search, setSearch, query } = useDocsSearch({ client });
  const results = query.data === "empty" ? [] : (query.data ?? []);

  return (
    <CommandPalette open={open} onOpenChange={setOpen} hotkey={hotkey ? "k" : false}>
      {variant === "field" ? (
        <CommandPaletteTrigger
          render={<button type="button" />}
          className={cn("flex items-center gap-3 text-start outline-none focus-visible:focus-ring", className)}
        >
          <MagnifyingGlassIcon className="size-5 shrink-0" />
          <span className="flex-1 truncate">{strings.searchPlaceholder}</span>
          <kbd className="shrink-0 rounded-md bg-current/10 px-2 py-0.5 font-sans text-xs font-medium">⌘K</kbd>
        </CommandPaletteTrigger>
      ) : (
        <CommandPaletteTrigger
          render={<Button variant="ghost" size="icon-sm" aria-label={strings.search} />}
          className={className}
        >
          <MagnifyingGlassIcon className="size-4" />
        </CommandPaletteTrigger>
      )}
      <CommandPaletteContent
        title={strings.search}
        description={strings.searchPlaceholder}
        shouldFilter={false}
      >
        <CommandInput
          value={search}
          onValueChange={setSearch}
          placeholder={strings.searchPlaceholder}
        />
        {search.length > 0 && (
          <CommandList>
            <CommandEmpty>
              {query.isLoading ? strings.searching : strings.searchEmpty}
            </CommandEmpty>
            {results.map((result) => {
              const Icon = icons[result.type];
              return (
                <CommandItem
                  key={result.id}
                  value={result.id}
                  onSelect={() => {
                    setOpen(false);
                    router.push(result.url);
                  }}
                  className={result.type === "page" ? undefined : "ps-8"}
                >
                  <Icon className="text-label-secondary" />
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate">
                      <Highlighted text={result.content} />
                    </span>
                    {result.type === "page" && result.breadcrumbs && (
                      <span className="truncate text-xs text-label-secondary">
                        {result.breadcrumbs.join(" › ")}
                      </span>
                    )}
                  </span>
                </CommandItem>
              );
            })}
          </CommandList>
        )}
      </CommandPaletteContent>
    </CommandPalette>
  );
}
