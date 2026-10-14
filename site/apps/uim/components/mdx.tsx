import type { MDXComponents } from "mdx/types";
import type * as React from "react";

import { Anchor } from "@/components/site/anchor";
import { Callout } from "@/components/site/callout";
import { ApiPart } from "@/components/site/api-reference";
import { CodeBlock } from "@/components/site/code-block";
import { Example } from "@/components/site/example";
import { PropsTable } from "@/components/site/props-table";
import { RegistryIndex } from "@/components/site/registry-index";
import { SourceCode } from "@/components/site/source-code";
import { Code, SourceFile } from "@/components/site/source-file";
import { Tabs } from "@/components/site/tabs";

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
    Example,
    ApiPart,
    PropsTable,
    SourceCode,
    SourceFile,
    Code,
    RegistryIndex,
    Tabs,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
