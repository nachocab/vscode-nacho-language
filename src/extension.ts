// Code based on https://stackoverflow.com/a/46054953/355567
"use strict";
import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerDocumentSymbolProvider(
      { language: "nacho" },
      new NachoDocumentSymbolProvider()
    )
  );
}

class NachoDocumentSymbolProvider implements vscode.DocumentSymbolProvider {
  public provideDocumentSymbols(
    document: vscode.TextDocument,
    token: vscode.CancellationToken
  ): Promise<vscode.DocumentSymbol[]> {
    return new Promise((resolve, reject) => {
      let symbols: vscode.DocumentSymbol[] = [];

      for (let i = 0; i < document.lineCount; i++) {
        const line = document.lineAt(i);
        if (line.text.match("^ *#{2,}")) {
          const name = line.text
            .replace(/#+ /, "")
            .replace(/^( *)(.+)/g, function (match, first, rest) {
              return `${" ".repeat(first.length)}${rest}`;
            });

          symbols.push(
            new vscode.DocumentSymbol(
              name,
              "Heading",
              vscode.SymbolKind.Field,
              line.range,
              line.range
            )
          );
        }
      }

      resolve(symbols);
    });
  }
}
