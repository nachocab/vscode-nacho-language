import * as assert from "assert";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";
import { getSymbols, getTree, Node, traverse, TestNode } from "../../extension";
import { it } from "mocha";

function getNode(name: string, line: number) {
  return {
    name,
    // @ts-ignore
    level: +name.match(/(\d)/)[1],
    startLine: line,
    endLine: line,
  } as Node;
}

describe("Nacho Document Symbols", () => {
  // vscode.window.showInformationMessage("Start all tests.");

  it("getTree 1-level", function () {
    // (0) ## h2-1        (1)
    // (1)   ### h3-1     (1)
    const list = ["h2-1", "h3-1"].map(getNode);

    const expected: Node[] = [
      {
        ...getNode("h2-1", 0),
        children: [
          {
            ...getNode("h3-1", 1),
            parent: 0,
            children: [],
          } as Node,
        ],
      },
    ];
    const tree = getTree(list);
    assert.deepEqual(tree, expected);
  });

  it("getTree 2-level", function () {
    // (0) ## h2-1        (2)
    // (1)   ### h3-1     (2)
    // (2)     #### h4-1  (2)
    const list = ["h2-1", "h3-1", "h4-1"].map(getNode);

    const expected: Node[] = [
      {
        ...getNode("h2-1", 0),
        children: [
          {
            ...getNode("h3-1", 1),
            parent: 0,
            children: [
              {
                ...getNode("h4-1", 2),
                parent: 1,
                startLine: 2,
                children: [],
              },
            ],
          },
        ],
      },
    ];
    const tree = getTree(list);
    assert.deepEqual(tree, expected);
  });

  it("getTree complex", function () {
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
      .map((name, line) => name && getNode(name, line))
      .filter(Boolean) as Node[];

    const expected: Node[] = [
      {
        ...getNode("h2-1", 0),
        children: [
          {
            ...getNode("h3-1", 1),
            parent: 0,
            children: [
              {
                ...getNode("h4-1", 2),
                parent: 1,
                children: [],
              },
            ],
          },
          {
            ...getNode("h3-2", 3),
            parent: 0,
            children: [
              {
                ...getNode("h5-1", 4),
                parent: 3,
                children: [],
              },
            ],
          },
        ],
      },
      {
        ...getNode("h2-2", 6),
        children: [
          {
            ...getNode("h5-2", 7),
            parent: 5,
            children: [],
          },
          {
            ...getNode("h3-3", 8),
            parent: 5,
            children: [],
          },
        ],
      },
    ];
    const tree = getTree(list);
    assert.deepEqual(tree, expected);
  });

  it.skip("getSymbols simple", () => {
    const tree: Node[] = [
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

    assert.deepEqual(getSymbols(tree), {});
  });

  // it("traverses", () => {
  //   const tree = {
  //     name: "a",
  //     n: 0,
  //     children: [
  //       { name: "b", n: 1, children: [] },
  //       { name: "c", n: 2, children: [] },
  //     ],
  //   };
  //   const res = traverse(tree, []);
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
