import ts from "typescript";

const STORYBOOK = new Set(["storybook/test", "@storybook/react-vite"]);
const OPEN_ARGS = new Set(["defaultOpen", "open"]);

function parse(file, source) {
  return ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
}

function unwrap(node) {
  let current = node;
  while (
    current &&
    (ts.isSatisfiesExpression(current) ||
      ts.isAsExpression(current) ||
      ts.isParenthesizedExpression(current) ||
      ts.isTypeAssertionExpression(current))
  ) {
    current = current.expression;
  }
  return current;
}

function property(object, name) {
  return object?.properties.find(
    (member) => ts.isPropertyAssignment(member) && member.name.getText() === name,
  );
}

function objectArgs(literal, source) {
  const args = new Map();
  if (!literal || !ts.isObjectLiteralExpression(literal)) return args;
  for (const member of literal.properties) {
    if (ts.isPropertyAssignment(member)) args.set(ts.isStringLiteral(member.name) ? member.name.text : member.name.getText(source), member.initializer);
    else if (ts.isShorthandPropertyAssignment(member)) args.set(member.name.getText(source), member.name);
  }
  return args;
}

function dedent(text) {
  const lines = text.split("\n");
  const indents = lines
    .slice(1)
    .filter((line) => line.trim())
    .map((line) => line.match(/^ */)[0].length);
  const cut = indents.length ? Math.min(...indents) : 0;
  return [lines[0], ...lines.slice(1).map((line) => line.slice(cut))].join("\n");
}

function indent(text, spaces) {
  const pad = " ".repeat(spaces);
  return text
    .split("\n")
    .map((line) => (line.trim() ? pad + line : line))
    .join("\n");
}

function attributes(args, source, skipOpen) {
  const parts = [];
  const list = [];
  let children;
  for (const [name, value] of args) {
    if (skipOpen && OPEN_ARGS.has(name)) continue;
    if (value.kind === ts.SyntaxKind.FalseKeyword) continue;
    if (ts.isStringLiteral(value) && value.text === "default" && name !== "children") continue;
    if (name === "children") {
      const element = ts.isJsxElement(value) || ts.isJsxSelfClosingElement(value) || ts.isJsxFragment(value);
      children = ts.isStringLiteral(value) ? value.text : element ? value.getText(source) : `{${value.getText(source)}}`;
      continue;
    }
    let attr;
    if (value.kind === ts.SyntaxKind.TrueKeyword) attr = name;
    else if (ts.isStringLiteral(value) || ts.isNoSubstitutionTemplateLiteral(value)) attr = `${name}="${value.text}"`;
    else attr = `${name}={${value.getText(source)}}`;
    parts.push(attr);
    list.push([name, attr]);
  }
  return { text: parts.join(" "), list, children };
}

const pascal = (name) => name.replace(/(^|-)([a-z0-9])/g, (_, __, letter) => letter.toUpperCase());

export function storyExamples(file, source, { itemName, overlay }) {
  const tree = parse(file, source);
  const imports = [];
  const declarations = new Map();
  let meta;
  const stories = [];

  for (const statement of tree.statements) {
    if (ts.isImportDeclaration(statement)) {
      const from = statement.moduleSpecifier.text;
      if (!STORYBOOK.has(from)) imports.push(statement);
      continue;
    }
    if (ts.isVariableStatement(statement)) {
      const exported = statement.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
      for (const declaration of statement.declarationList.declarations) {
        const name = declaration.name.getText(tree);
        const value = unwrap(declaration.initializer);
        if (name === "meta") meta = value;
        else if (exported && value && ts.isObjectLiteralExpression(value)) stories.push({ key: name, value });
        else declarations.set(name, statement);
      }
      continue;
    }
    if (
      (ts.isFunctionDeclaration(statement) || ts.isTypeAliasDeclaration(statement) || ts.isInterfaceDeclaration(statement)) &&
      statement.name
    ) {
      declarations.set(statement.name.text, statement);
    }
  }

  const metaArgs = objectArgs(unwrap(property(meta, "args")?.initializer), tree);
  const component = property(meta, "component")?.initializer?.getText(tree);
  const byKey = new Map(stories.map((story) => [story.key, story]));

  const metaRender = unwrap(property(meta, "render")?.initializer);
  function renderOf(story, depth = 0) {
    const render = unwrap(property(story.value, "render")?.initializer) ?? metaRender;
    if (render && ts.isPropertyAccessExpression(render) && depth < 3) {
      const other = byKey.get(render.expression.getText(tree));
      return other ? renderOf(other, depth + 1) : undefined;
    }
    return render;
  }

  const examples = [];
  for (const story of stories) {
    const storyName = property(story.value, "name")?.initializer;
    const args = new Map([...metaArgs, ...objectArgs(unwrap(property(story.value, "args")?.initializer), tree)]);
    const { text: attrs, list: attrList, children } = attributes(args, tree, overlay);
    const render = renderOf(story);

    const bound = new Map();
    let restName = "args";
    const first = render && (ts.isArrowFunction(render) || ts.isFunctionExpression(render)) ? render.parameters[0] : undefined;
    if (first && ts.isObjectBindingPattern(first.name)) {
      for (const element of first.name.elements) {
        if (element.dotDotDotToken) restName = element.name.getText(tree);
        else bound.set(element.name.getText(tree), (element.propertyName ?? element.name).getText(tree));
      }
    }
    const valueText = (key) => {
      const value = args.get(key);
      if (!value) return undefined;
      return ts.isStringLiteral(value) ? JSON.stringify(value.text) : value.getText(tree);
    };

    let jsx;
    let helper = "";
    if (!render) {
      if (!component) continue;
      const open = `<${component}${attrs ? ` ${attrs}` : ""}`;
      jsx = children !== undefined ? `${open}>${children}</${component}>` : `${open} />`;
    } else if ((ts.isArrowFunction(render) || ts.isFunctionExpression(render)) && !ts.isBlock(render.body)) {
      jsx = dedent(unwrap(render.body).getText(tree));
    } else {
      const body = ts.isBlock(render.body) ? render.body.getText(tree) : `{ return ${render.body.getText(tree)} }`;
      const params = render.parameters.map((p) => p.getText(tree)).join(", ");
      let helperName = `${pascal(story.key)}Preview`;
      while (declarations.has(helperName)) helperName += "Story";
      helper = dedent(`function ${helperName}(${params ? "args" : ""}) ${body}`);
      jsx = `<${helperName} />`;
    }

    const decorators = [
      ...(unwrap(property(story.value, "decorators")?.initializer)?.elements ?? []),
      ...(unwrap(property(meta, "decorators")?.initializer)?.elements ?? []),
    ];
    for (const decorator of decorators) {
      const fn = unwrap(decorator);
      if (!fn || !(ts.isArrowFunction(fn) || ts.isFunctionExpression(fn)) || ts.isBlock(fn.body) || fn.parameters.length > 1) continue;
      const wrapper = dedent(unwrap(fn.body).getText(tree));
      const slot = wrapper.match(/^([ \t]*)<Story\s*\/>/m);
      if (!slot) continue;
      const pad = slot[1].length;
      jsx = wrapper.replace(/<Story\s*\/>/, indent(jsx, pad).trimStart());
    }

    const spreadInto = (text) =>
      text.replace(new RegExp(`\\s*\\{\\s*\\.\\.\\.${restName}\\s*\\}`, "g"), (match, offset) => {
        const start = text.lastIndexOf("<", offset);
        const end = text.indexOf(">", offset);
        const tag = text.slice(start, end === -1 ? undefined : end) .replace(match, "");
        const kept = attrList.filter(
          ([name]) => ![...bound.values()].includes(name) && !new RegExp(`\\s${name}(?=[=\\s/>]|$)`).test(tag),
        );
        return kept.length ? ` ${kept.map(([, attr]) => attr).join(" ")}` : "";
      });
    const inline = (text) => {
      let out = text.replace(/\bargs\.(\w+)\b/g, (match, key) => valueText(key) ?? "undefined");
      for (const [local, key] of bound) {
        const value = valueText(key);
        out = out.replace(new RegExp(`=\\{\\s*${local}\\s*\\}`, "g"), value === undefined ? "={undefined}" : value.startsWith('"') ? `=${value}` : `={${value}}`);
        out = out.replace(new RegExp(`\\{\\s*${local}\\s*\\}`, "g"), value === undefined ? "" : `{${value}}`);
      }
      return out;
    };
    const tidy = (text) =>
      text
        .replace(/\{\s*!undefined\s*&&\s*/g, "{")
        .replace(/\{\s*undefined\s*&&[^{}]*\}/g, "");
    jsx = tidy(inline(spreadInto(jsx)));
    helper = tidy(inline(spreadInto(helper))).replace(/\(args\)/, "()");
    if (overlay) jsx = jsx.replace(/\sdefaultOpen(?:=\{true\})?(?=[\s>/])/g, "");

    let body = `${helper}\n${jsx}`;
    const uses = (text, identifier) => new RegExp(`\\b${identifier}\\b`).test(text);
    const picked = new Set();
    for (let pass = 0; pass < 4; pass++) {
      for (const [name] of declarations) if (uses(body, name)) picked.add(name);
      body = [helper, jsx, ...[...declarations].filter(([name]) => picked.has(name)).map(([, s]) => s.getText(tree))].join("\n");
    }
    const used = (identifier) => uses(body, identifier);
    const lines = [];
    for (const statement of imports) {
      const clause = statement.importClause;
      const from = statement.moduleSpecifier.text;
      if (!clause) continue;
      const named = clause.namedBindings && ts.isNamedImports(clause.namedBindings)
        ? clause.namedBindings.elements.map((e) => e.getText(tree)).filter((e) => used(e.replace(/^type\s+/, "").split(" as ").pop()))
        : [];
      const namespace = clause.namedBindings && ts.isNamespaceImport(clause.namedBindings)
        ? clause.namedBindings.name.text
        : undefined;
      const fallback = clause.name?.text;
      if (named.length) lines.push(`import { ${named.join(", ")} } from "${from}"`);
      if (namespace && used(namespace)) lines.push(`import * as ${namespace} from "${from}"`);
      if (fallback && used(fallback)) lines.push(`import ${fallback} from "${from}"`);
    }
    const locals = [...declarations]
      .filter(([name]) => picked.has(name))
      .map(([, statement]) => statement)
      .filter((statement, index, all) => all.indexOf(statement) === index)
      .map((statement) => dedent(statement.getText(tree)));

    let exampleName = `${pascal(itemName)}${story.key === "Default" ? "" : pascal(story.key)}Example`;
    while (declarations.has(exampleName)) exampleName += "Demo";
    const code = [
      lines.join("\n"),
      locals.join("\n\n"),
      helper,
      `export function ${exampleName}() {\n  return (\n${indent(jsx, 4)}\n  )\n}`,
    ]
      .filter(Boolean)
      .join("\n\n");

    examples.push({
      key: story.key,
      name: storyName && ts.isStringLiteral(storyName) ? storyName.text : undefined,
      code,
      jsx,
    });
  }
  return examples;
}

function variantsOf(tree) {
  const map = new Map();
  for (const statement of tree.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      const call = unwrap(declaration.initializer);
      if (!call || !ts.isCallExpression(call) || call.expression.getText(tree) !== "cva") continue;
      const config = unwrap(call.arguments[1]);
      const variants = unwrap(property(config, "variants")?.initializer);
      const defaults = objectArgs(unwrap(property(config, "defaultVariants")?.initializer), tree);
      const props = [];
      for (const member of variants?.properties ?? []) {
        if (!ts.isPropertyAssignment(member)) continue;
        const name = member.name.getText(tree);
        const options = unwrap(member.initializer).properties.map((option) => option.name.getText(tree).replace(/^"|"$/g, ""));
        const fallback = defaults.get(name);
        props.push({
          name,
          type: options.map((option) => (option === "true" || option === "false" ? option : `"${option}"`)).join(" | "),
          default: fallback ? fallback.getText(tree) : undefined,
        });
      }
      map.set(declaration.name.getText(tree), props);
    }
  }
  return map;
}

function membersOf(type, tree, variants, out) {
  if (!type) return;
  if (ts.isIntersectionTypeNode(type) || ts.isUnionTypeNode(type)) {
    for (const part of type.types) membersOf(part, tree, variants, out);
    return;
  }
  if (ts.isParenthesizedTypeNode(type)) return membersOf(type.type, tree, variants, out);
  if (ts.isTypeLiteralNode(type)) {
    for (const member of type.members) {
      if (!ts.isPropertySignature(member)) continue;
      out.props.push({
        name: member.name.getText(tree).replace(/^"|"$/g, ""),
        type: member.type ? member.type.getText(tree).replace(/\s+/g, " ") : "unknown",
        required: !member.questionToken,
      });
    }
    return;
  }
  if (ts.isTypeReferenceNode(type)) {
    const text = type.getText(tree).replace(/\s+/g, " ");
    const variant = text.match(/^VariantProps<typeof (\w+)>$/);
    if (variant) {
      for (const prop of variants.get(variant[1]) ?? []) out.props.push({ ...prop, required: false });
      return;
    }
    if (text.startsWith("Omit<") || text.startsWith("Pick<")) {
      membersOf(type.typeArguments?.[0], tree, variants, out);
      return;
    }
    out.extends.push(text);
  }
}

export function componentApi(file, source) {
  const tree = parse(file, source);
  const variants = variantsOf(tree);
  const exported = new Set();
  for (const statement of tree.statements) {
    if (ts.isExportDeclaration(statement) && statement.exportClause && ts.isNamedExports(statement.exportClause)) {
      for (const element of statement.exportClause.elements) {
        if (!statement.isTypeOnly && !element.isTypeOnly) exported.add(element.name.text);
      }
    }
    if (ts.isFunctionDeclaration(statement) && statement.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) {
      exported.add(statement.name.text);
    }
  }

  const parts = [];
  for (const statement of tree.statements) {
    if (!ts.isFunctionDeclaration(statement) || !statement.name) continue;
    const name = statement.name.text;
    if (!exported.has(name) || !/^[A-Z]/.test(name)) continue;
    const parameter = statement.parameters[0];
    const out = { name, extends: [], props: [] };
    if (parameter) {
      membersOf(parameter.type, tree, variants, out);
      if (ts.isObjectBindingPattern(parameter.name)) {
        for (const element of parameter.name.elements) {
          if (!element.initializer) continue;
          const key = (element.propertyName ?? element.name).getText(tree);
          const prop = out.props.find((p) => p.name === key);
          if (prop) prop.default = element.initializer.getText(tree);
        }
      }
    }
    parts.push(out);
  }
  return parts;
}
