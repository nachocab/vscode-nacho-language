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

class NachoDocumentSymbolProvider implements vscode.DocumentSymbolProvider {
  public provideDocumentSymbols(
    document: vscode.TextDocument,
    token: vscode.CancellationToken
  ): Promise<vscode.DocumentSymbol[]> {
    const symbols: vscode.DocumentSymbol[] = [];
    for (let i = 0; i < document.lineCount; i++) {
      const line = document.lineAt(i);
      let match;
      if ((match = line.text.match("^\\s*(#{2,})"))) {
        const level = match[1]?.length;
        const name = line.text.replace(/^\s*#+ */, "") || `H${level}`;

        const symbol = new vscode.DocumentSymbol(
          name,
          "",
          vscode.SymbolKind.Field,
          line.range,
          line.range
        );
        // symbol.children.push(
        //   new vscode.DocumentSymbol(
        //     name,
        //     "test",
        //     vscode.SymbolKind.Field,
        //     line.range,
        //     line.range
        //   )
        // );
        symbols.push(symbol);
      }
    }

    return new Promise((resolve, reject) => resolve(symbols));
  }
}
