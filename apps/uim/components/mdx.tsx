import type { MDXComponents } from "mdx/types";
import type * as React from "react";

import { Anchor } from "@/components/site/anchor";
import { Callout } from "@/components/site/callout";
import { CodeBlock } from "@/components/site/code-block";

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
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
