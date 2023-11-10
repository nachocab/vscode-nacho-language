import * as assert from "assert";
import { getSymbol, getRoots, Node, ROOT } from "../../extension";
import { it } from "mocha";

import * as vscode from "vscode";

describe("Nacho Document Symbols", () => {
  it("getRoots 1-level", function () {
    // (0) ## h2-1        (1)
    // (1)   ### h3-1     (1)
    const nodes = ["h2-1", "h3-1"].map(getAuxNode);

    const expected: Node[] = [
      {
        ...getAuxNode("h2-1", 0),
        children: [
          {
            ...getAuxNode("h3-1", 1),
            parent: 0,
            children: [],
          } as Node,
        ],
      },
    ];

    const roots = getRoots(nodes);
    assert.deepEqual(roots, expected);
  });

  it("getRoots 2-level", function () {
    // (0) ## h2-1        (2)
    // (1)   ### h3-1     (2)
    // (2)     #### h4-1  (2)
    const nodes = ["h2-1", "h3-1", "h4-1"].map(getAuxNode);

    const expected: Node[] = [
      {
        ...getAuxNode("h2-1", 0),
        children: [
          {
            ...getAuxNode("h3-1", 1),
            parent: 0,
            children: [
              {
                ...getAuxNode("h4-1", 2),
                parent: 1,
                startLine: 2,
                children: [],
              },
            ],
          },
        ],
      },
    ];

    const roots = getRoots(nodes);
    assert.deepEqual(roots, expected);
  });

  it("getRoots complex", function () {
    // (0) ## h2-1        (4)
    // (1)   ### h3-1     (2)
    // (2)     #### h4-1  (2)
    // (3)   ### h3-2     (5)
    // (4)     ##### h5-1 (4)
    // (5) # comment      ( )
    // (6) ## h2-2        (8)
    // (7)   ##### h5-2   (8)
    // (8)   ### h3-3     (8)
    // (9) # comment      ( )
    const nodes = [
      "h2-1",
      "h3-1",
      "h4-1",
      "h3-2",
      "h5-1",
      null,
      "h2-2",
      "h5-2",
      "h3-3",
      null,
    ]
      .map((name, line) => name && getAuxNode(name, line))
      .filter(Boolean) as Node[];

    const expected: Node[] = [
      {
        ...getAuxNode("h2-1", 0),
        children: [
          {
            ...getAuxNode("h3-1", 1),
            parent: 0,
            children: [
              {
                ...getAuxNode("h4-1", 2),
                parent: 1,
                children: [],
              },
            ],
          },
          {
            ...getAuxNode("h3-2", 3),
            parent: 0,
            children: [
              {
                ...getAuxNode("h5-1", 4),
                parent: 3,
                children: [],
              },
            ],
          },
        ],
      },
      {
        ...getAuxNode("h2-2", 6),
        children: [
          {
            ...getAuxNode("h5-2", 7),
            parent: 5,
            children: [],
          },
          {
            ...getAuxNode("h3-3", 8),
            parent: 5,
            children: [],
          },
        ],
      },
    ];

    const roots = getRoots(nodes);
    assert.deepEqual(roots, expected);
  });

  it("getSymbols simple", () => {
    // (0) ## h2-1        (2)
    // (1)   ### h3-1     (2)
    // (2)     #### h4-1  (2)
    const nodes = ["h2-1", "h3-1", "h4-1"].map(getAuxNode);
    const roots = getRoots(nodes);

    const expected: vscode.DocumentSymbol = getAuxSymbol(
      "h2-1",
      [0, 2, 4],
      // prettier-ignore
      [
        getAuxSymbol("h3-1", [1, 2, 4], [
          getAuxSymbol("h4-1", [2, 2, 4], [])
        ])
      ]
    );

    const symbol = getSymbol(roots[0]);
    assert.deepEqual(symbol, expected);
  });
});

function getAuxNode(name: string, line: number) {
  return {
    name,
    // @ts-ignore
    level: +name.match(/(\d)/)[1],
    startLine: line,
    endLine: line,
    length: name.length,
    parent: ROOT,
    children: [] as Node[],
  } as Node;
}

type PseudoRange = [number, number, number];
function getAuxSymbol(
  name: string,
  pseudoRange: PseudoRange,
  children: vscode.DocumentSymbol[]
) {
  const range = new vscode.Range(
    pseudoRange[0],
    0,
    pseudoRange[1],
    pseudoRange[2]
  );

  const symbol = new vscode.DocumentSymbol(
    name,
    "",
    vscode.SymbolKind.Field,
    range,
    range
  );
  symbol.children = children;

  return symbol;
}
