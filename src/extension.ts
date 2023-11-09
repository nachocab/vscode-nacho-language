// Code based on https://stackoverflow.com/a/46054953/355567
"use strict";
import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerDocumentSymbolProvider(
      { language: "nacho", scheme: "file" },
      new NachoDocumentSymbolProvider()
    )
  );
}

interface Node {
  name: string;
  level: number;
  startLine: number;
  endCharacter: number;
  parent: number;
}

class NachoDocumentSymbolProvider implements vscode.DocumentSymbolProvider {
  public provideDocumentSymbols(
    document: vscode.TextDocument,
    token: vscode.CancellationToken
  ): Promise<vscode.DocumentSymbol[]> {
    // const nodes: Node[] = [];
    // for (let i = 0; i < document.lineCount; i++) {
    //   const line = document.lineAt(i);
    //   let match;
    //   if ((match = line.text.match("^\\s*(#{2,})\\s*(.+)?"))) {
    //     const level = match[1]?.length;
    //     const name = match[2] || `H${level}`;

    //     nodes.push({
    //       name,
    //       level,
    //       firstLine: line.range.start.line,
    //       lastCharacter: line.range.end.character,
    //       parent: nodes.findLastIndex((n: Node) => n.level > level),
    //     });
    //   }
    // }

    const symbols: vscode.DocumentSymbol[] = [];
    // const symbols: vscode.DocumentSymbol[] = getSymbols(nodes);

    // // return new Promise((resolve, reject) => resolve(symbols));
    return new Promise((resolve, reject) => resolve(symbols));
  }
}

function getSymbols(nodes: Node[]) {
  return nodes.map((node) => {
    const range = new vscode.Range(
      node.startLine,
      0,
      nodes[node.lastChild]?.startLine,
      node.endCharacter
    );
    return new vscode.DocumentSymbol(
      node.name,
      nodes[node.parent].name,
      vscode.SymbolKind.Field,
      range,
      range
    );
  });
}
