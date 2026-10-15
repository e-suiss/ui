import type { MDXComponents } from "mdx/types";
import type * as React from "react";

import { Anchor } from "@/components/site/anchor";
import { Callout } from "@/components/site/callout";
import { CodeBlock } from "@/components/site/code-block";
import { Example } from "@/components/site/example";
import { NativeExample } from "@/components/site/native-example";
import { Only } from "@/components/site/platform";
import { Tabs } from "@/components/site/tabs";
import { Anatomy, ApiPart } from "@/components/site/api-reference";
import { PropsTable } from "@/components/site/props-table";
import { Code, SourceFile } from "@/components/site/source-file";
import { RegistryIndex } from "@/components/site/registry-index";

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
    NativeExample,
    Only,
    Tabs,
    Anatomy,
    ApiPart,
    PropsTable,
    SourceFile,
    Code,
    RegistryIndex,
    ...components,
  } satisfies MDXComponents;
}

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
