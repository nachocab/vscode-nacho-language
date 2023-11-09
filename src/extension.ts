// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// Code based on https://stackoverflow.com/a/46054953/355567

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
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
  endCharacter: number;
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

    const symbols: vscode.DocumentSymbol[] = [];
    // const symbols: vscode.DocumentSymbol[] = getSymbols(nodes);

    // // return new Promise((resolve, reject) => resolve(symbols));
    return new Promise((resolve, reject) => resolve(symbols));
  }
}

function getNodes(document: vscode.TextDocument) {
  const nodes: Node[] = [];
  for (let i = 0; i < document.lineCount; i++) {
    const line = document.lineAt(i);
    let match: string[] | null;
    if ((match = line.text.match("^\\s*(#{2,})\\s*(.+)?"))) {
      const level = match[1]?.length;
      const name = match[2] || `H${level}`;

      nodes.push({
        name,
        level,
        startLine: line.range.start.line,
        endCharacter: line.range.end.character,
      });
    }
  }
  return nodes;
}

export function getTree(list: Node[]) {
  const roots: Node[] = [list[0]];
  for (let i = 1, n = list.length; i < n; i++) {
    const n = list[i];
    n.parent = list.slice(0, i).findLastIndex((d: Node) => d.level < n.level);
    n.children = [];
  }
  return roots;
}

export function getSymbols(nodes: Node[]) {
  // return nodes.map((node) => {
  //   const range = new vscode.Range(
  //     node.startLine,
  //     0,
  //     0,
  //     // nodes[node.lastChild]?.startLine,
  //     // node.endCharacter
  //     0
  //   );
  //   return new vscode.DocumentSymbol(
  //     node.name,
  //     nodes[node.parent].name,
  //     vscode.SymbolKind.Field,
  //     range,
  //     range
  //   );
  // });
}

// This method is called when your extension is deactivated
export function deactivate() {}
