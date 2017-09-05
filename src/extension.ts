'use strict';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.languages.registerDocumentSymbolProvider(
      { language: 'nacho' },
      new DocumentSymbolProvider()
    )
  );
}

class DocumentSymbolProvider implements vscode.DocumentSymbolProvider {
  public provideDocumentSymbols(
    document: vscode.TextDocument,
    token: vscode.CancellationToken
  ): Thenable<vscode.SymbolInformation[]> {
    return new Promise((resolve, reject) => {
      let symbols = [];
    
      for (let i = 0; i < document.lineCount; i++) {
        const line = document.lineAt(i);
        if (line.text.match('^ *#{2,}')) {
          const name = line.text
            .replace(/#+ /, '')
            .replace(/^( *)(.+)/g, function(match, first, rest) {
              return `${'.'.repeat(first.length)}${rest}`;
            });
          symbols.push({
            name: name,
            kind: vscode.SymbolKind.Field,
            location: new vscode.Location(document.uri, line.range)
          });
        }
      }

      resolve(symbols);
    });
  }
}
