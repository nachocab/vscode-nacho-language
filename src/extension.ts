import * as vscode from "vscode";

export interface Node {
  name: string;
  level: number;
  startLine: number;
  endLine: number;
  length: number;
  parent: number;
  children: Node[];
}

export class NachoDocumentSymbolProvider
  implements vscode.DocumentSymbolProvider
{
  public provideDocumentSymbols(
    document: vscode.TextDocument,
    token: vscode.CancellationToken
  ): Promise<vscode.DocumentSymbol[]> {
    const nodes = getNodes(document);
    const roots = getRoots(nodes);
    const symbols = roots.map(toSymbol);

    return new Promise((resolve, reject) => resolve(symbols));
  }
}

export const ROOT = -1;

function getNodes(document: vscode.TextDocument) {
  const nodes: Node[] = [];
  for (let i = 0; i < document.lineCount; i++) {
    const line = document.lineAt(i);
    let match = line.text.match("^\\s*(#{2,})\\s*(.+)?");
    if (!match) {
      const lastNode = nodes.at(-1);
      lastNode && (lastNode.endLine = line.range.end.line);
      continue;
    }

    const level = match[1].length;
    const name = match[2] || `H${level}`; // In case it's just `### `
    nodes.push({
      name,
      level,
      startLine: line.range.start.line,
      endLine: line.range.end.line,
      length: line.range.end.character,
      parent: ROOT,
      children: [],
    });
  }
  return nodes;
}

function assignParents(nodes: Node[]) {
  for (let i = 0, n = nodes.length; i < n; i++) {
    const node = nodes[i];
    let j = i - 1;
    while (j >= 0 && node.level <= nodes[j].level) {
      j -= 1;
    }
    j >= 0 && (node.parent = j);
  }
}

export function getRoots(nodes: Node[]) {
  assignParents(nodes);

  const roots: Node[] = [];
  for (let i = 0, n = nodes.length; i < n; i++) {
    const node = nodes[i];
    if (node.parent === ROOT) {
      roots.push(node);
      continue;
    }
    nodes[node.parent].children.push(node);
  }

  return roots;
}

function deepestChild(node: Node): Node {
  return node.children.length
    ? deepestChild(node.children.at(-1) as Node)
    : node;
}

function getRange(node: Node) {
  const numChildren = node.children.length;
  const endLine = numChildren ? deepestChild(node).endLine : node.endLine;
  const endCharacter = node.length;
  const startCharacter = 0;
  return new vscode.Range(
    node.startLine,
    startCharacter,
    endLine,
    endCharacter
  );
}

function toSymbol(node: Node) {
  const range = getRange(node);
  const symbol = new vscode.DocumentSymbol(
    node.name,
    "", // VSCode overwrites it with the parent name
    vscode.SymbolKind.Field,
    range,
    range
  );
  node.children.length && (symbol.children = node.children.map(toSymbol));

  return symbol;
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerDocumentSymbolProvider(
      { language: "nacho", scheme: "file" },
      new NachoDocumentSymbolProvider()
    )
  );
}

export function deactivate() {}
