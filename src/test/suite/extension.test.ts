import * as assert from "assert";
import { getSymbol, getRoots, Node, ROOT } from "../../extension";
import { it } from "mocha";

import * as vscode from "vscode";

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

describe("Nacho Document Symbols", () => {
  it("getRoots 1-level", function () {
    // (0) ## h2-1        (1)
    // (1)   ### h3-1     (1)
    const list = ["h2-1", "h3-1"].map(getAuxNode);

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
    const roots = getRoots(list);
    assert.deepEqual(roots, expected);
  });

  it("getRoots 2-level", function () {
    // (0) ## h2-1        (2)
    // (1)   ### h3-1     (2)
    // (2)     #### h4-1  (2)
    const list = ["h2-1", "h3-1", "h4-1"].map(getAuxNode);

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
    const roots = getRoots(list);
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
    const list = [
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
    const roots = getRoots(list);
    assert.deepEqual(roots, expected);
  });

  it.skip("getSymbols simple", () => {
    const roots: Node[] = [
      {
        name: "h2-1",
        level: 2,
        startLine: 0,
        // endLine: 2,
        // endCharacter: 4 + 4,
        children: [
          {
            name: "h3-1",
            level: 3,
            startLine: 1,
            // endLine: 2,
            // endCharacter: 4 + 4,
            parent: 0,
            children: [
              {
                name: "h4-1",
                level: 4,
                parent: 1,
                startLine: 2,
                // /endLine: 2,
                // endCharacter: 4 + 4,
                children: [],
              },
            ],
          },
        ],
      },
    ];
    // ## h2-1
    //   ### h3-1
    //     #### h4-1

    assert.deepEqual(getSymbols(roots), {});
  });

  // it("traverses", () => {
  //   const roots = {
  //     name: "a",
  //     n: 0,
  //     children: [
  //       { name: "b", n: 1, children: [] },
  //       { name: "c", n: 2, children: [] },
  //     ],
  //   };
  //   const res = traverse(roots, []);
  //   assert.deepEqual(res, ["b", "c", "a"]);
  //   // assert.deepEqual(res, {
  //   //   name: "a",
  //   //   n: 3,
  //   //   children2: [
  //   //     { name: "b", n: 1, children2: [] },
  //   //     { name: "c", n: 2, children2: [] },
  //   //   ],
  //   // });
  // });
});
