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

function getTestSymbols(document: vscode.TextDocument) {
  const symbolNames = [
    "File", // 0
    "Module", // 1
    "Namespace", // 2
    "Package", // 3
    "Class", // 4
    "Method", // 5
    "Property", // 6
    "Field", // 7
    "Constructor", // 8
    "Enum", // 9
    "Interface", // 10
    "Function", // 11
    "Variable", // 12
    "Constant", // 13
    "String", // 14
    "Number", // 15
    "Boolean", // 16
    "Array", // 17
    "Object", // 18
    "Key", // 19
    "Null", // 20
    "EnumMember", // 21
    "Struct", // 22
    "Event", // 23
    "Operator", // 24
    "TypeParameter", // 25
  ];

  const symbols: vscode.SymbolInformation[] = [];
  for (let i = 0; i < symbolNames.length; i++) {
    symbols.push(
      new vscode.SymbolInformation(
        `${i} ${symbolNames[i]}`,
        i,
        "",
        new vscode.Location(document.uri, new vscode.Position(i, 0))
      )
    );
  }

  return symbols;
}

export class NachoDocumentSymbolProvider
  implements vscode.DocumentSymbolProvider
{
  public provideDocumentSymbols(
    document: vscode.TextDocument,
    token: vscode.CancellationToken
  ): Promise<vscode.DocumentSymbol[] | vscode.SymbolInformation[]> {
    const nodes = getNodes(document);
    const roots = getRoots(nodes);

    const symbols = roots.map(getSymbol);
    // const symbols = getTestSymbols(document); // enable for testint

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

export function getSymbol(node: Node) {
  const range = getRange(node);

  // https://user-images.githubusercontent.com/6726799/47913433-f7938880-de93-11e8-83d2-71e754940d42.png
  let symbolKind;
  switch (node.level) {
    case 2:
      symbolKind = vscode.SymbolKind.Event;
      break;
    case 3:
      symbolKind = vscode.SymbolKind.Field;
      break;
    case 4:
      symbolKind = vscode.SymbolKind.Constructor;
      break;
    case 5:
      symbolKind = vscode.SymbolKind.Constant;
      break;
    case 6:
      symbolKind = vscode.SymbolKind.TypeParameter;
      break;
    default:
      symbolKind = vscode.SymbolKind.Key;
      break;
  }

  const symbol = new vscode.DocumentSymbol(
    node.name,
    "", // VSCode overwrites it with the parent name
    symbolKind,
    range,
    range
  );
  node.children.length && (symbol.children = node.children.map(getSymbol));

  return symbol;
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

function deepestChild(node: Node): Node {
  return node.children.length
    ? deepestChild(node.children.at(-1) as Node)
    : node;
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
