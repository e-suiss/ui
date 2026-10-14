import type { MDXComponents } from "mdx/types";
import type * as React from "react";

import { Anchor } from "@/components/site/anchor";
import { Callout } from "@/components/site/callout";
import { CodeBlock } from "@/components/site/code-block";
import { ComponentPreview } from "@/components/site/component-preview";
import { Example } from "@/components/site/example";
import { Anatomy, ApiPart } from "@/components/site/api-reference";
import { PropsTable } from "@/components/site/props-table";
import { SourceCode } from "@/components/site/source-code";
import { Code, SourceFile } from "@/components/site/source-file";
import { RegistryIndex } from "@/components/site/registry-index";
import { Button } from "@/components/ui/button";

function Preview({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-slot="preview"
      data-not-prose
      className="mt-[1.2em] flex min-h-44 flex-wrap items-center justify-center gap-3 rounded-[24px] bg-surface p-10 ring-1 ring-label/10"
    >
      {children}
    </div>
  );
}

function Table(props: React.ComponentProps<"table">) {
  return (
    <div className="mt-[1.2em] overflow-x-auto">
      <table {...props} />
    </div>
  );
}

export function getMDXComponents(components?: MDXComponents) {
  return {
    a: ({ href, ...props }) => <Anchor href={href} {...props} />,
    pre: (props) => <CodeBlock {...props} />,
    table: Table,
    Callout,
    ComponentPreview,
    Example,
    Anatomy,
    ApiPart,
    PropsTable,
    SourceCode,
    SourceFile,
    Code,
    RegistryIndex,
    Preview,
    Button,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
