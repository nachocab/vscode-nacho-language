import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerDocumentSymbolProvider(
      { language: "nacho", scheme: "file" },
      new NachoDocumentSymbolProvider()
    )
  );
}

export interface Node {
  name: string;
  level: number;
  startLine: number;
  endLine: number;
  length?: number;
  parent?: number;
  children?: Node[];
}

export class NachoDocumentSymbolProvider
  implements vscode.DocumentSymbolProvider
{
  public provideDocumentSymbols(
    document: vscode.TextDocument,
    token: vscode.CancellationToken
  ): Promise<vscode.DocumentSymbol[]> {
    const nodes = getNodes(document);
    const tree = getTree(nodes);
    const symbols: vscode.DocumentSymbol[] = getSymbols(tree);

    return new Promise((resolve, reject) => resolve(symbols));
  }
}

function getNodes(document: vscode.TextDocument) {
  const nodes: Node[] = [];
  for (let i = 0; i < document.lineCount; i++) {
    const line = document.lineAt(i);
    let match = line.text.match("^\\s*(#{2,})\\s*(.+)?");
    if (match) {
      const level = match[1]?.length;
      const name = match[2] || `H${level}`;

      nodes.push({
        name,
        level,
        startLine: line.range.start.line,
        endLine: line.range.end.line,
        length: line.range.end.character,
      });
    } else {
      const lastNode = nodes.at(-1);
      lastNode && (lastNode.endLine = line.range.end.line);
    }
  }
  return nodes;
}

export function getTree(list: Node[]) {
  for (let i = 0, n = list.length; i < n; i++) {
    const node = list[i];
    let j = i - 1;
    while (j >= 0 && node.level <= list[j].level) {
      j -= 1;
    }
    if (j >= 0) {
      node.parent = j;
    }
    node.children = [];
  }

  const roots: Node[] = [];
  for (let i = 0, n = list.length; i < n; i++) {
    const node = list[i];
    if (typeof node.parent === "undefined") {
      // let prevRoot = roots[roots.length - 1]
      // while (prevRoot && prevRoot?.children?.length)
      // while (let prevChildren = roots[roots.length - 1]
      roots.push(node);
    } else {
      list[node.parent].children?.push(node);
      // list[node.parent].endLine = node.startLine;
      // list[node.parent].endCharacter = node.endCharacter;
    }
  }
  return roots;
}

function deepestChild(node: Node): Node {
  return node.children?.length
    ? deepestChild(node.children.at(-1) as Node)
    : node;
}

function toSymbol(node: Node) {
  const startCharacter = 0;
  const endCharacter = node.length as number;
  const numChildren = node.children?.length || 0;
  const endLine = numChildren ? deepestChild(node).endLine : node.endLine;
  const range = new vscode.Range(
    node.startLine,
    startCharacter,
    endLine,
    endCharacter
  );

  const symbol = new vscode.DocumentSymbol(
    node.name,
    "", // the outline overwrites it with the parent name
    vscode.SymbolKind.Field,
    range,
    range
  );
  numChildren && (symbol.children = (node.children as Node[]).map(toSymbol));

  return symbol;
}

export function getSymbols(roots: Node[]) {
  return roots.map(toSymbol);
}

export interface TestNode {
  name: string;
  n: number;
  children: TestNode[];
}
export function traverse(node: TestNode, out: string[]) {
  out ||= [];

  let child;
  while (node.children.length) {
    child = node.children.shift();
    return traverse(child as TestNode, out);
  }
  out.push(node.name);

  return out;
}

// This method is called when your extension is deactivated
export function deactivate() {}
