import * as assert from "assert";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";
import { getSymbols, getTree, Node, traverse, TestNode } from "../../extension";
import { it } from "mocha";

describe("Nacho Document Symbols", () => {
  // vscode.window.showInformationMessage("Start all tests.");

  it("getTree 1-level", function () {
    const content: Node[] = [
      {
        name: "h2-1",
        level: 2,
        startLine: 0,
        // endCharacter: 4 + 2,
      },
      {
        name: "h3-1",
        level: 3,
        startLine: 1,
        // endCharacter: 4 + 3,
      },
    ];
    // (0) ## h2-1        (1)
    // (1)   ### h3-1     (1)

    const expected: Node[] = [
      {
        name: "h2-1",
        level: 2,
        startLine: 0,
        // endLine: 1,
        // endCharacter: 4 + 3,
        children: [
          {
            name: "h3-1",
            level: 3,
            startLine: 1,
            // endLine: 1,
            // endCharacter: 4 + 3,
            parent: 0,
            children: [],
          },
        ],
      },
    ];
    const tree = getTree(content);
    assert.deepEqual(tree, expected);
  });

  it("getTree 2-level", function () {
    const content: Node[] = [
      {
        name: "h2-1",
        level: 2,
        startLine: 0,
        // endCharacter: 4 + 2,
      },
      {
        name: "h3-1",
        level: 3,
        startLine: 1,
        // endCharacter: 4 + 3,
      },
      {
        name: "h4-1",
        level: 4,
        startLine: 2,
        // endCharacter: 4 + 4,
      },
    ];
    // (0) ## h2-1        (2)
    // (1)   ### h3-1     (2)
    // (2)     #### h4-1  (2)

    const expected: Node[] = [
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
                // endLine: 2,
                // endCharacter: 4 + 4,
                children: [],
              },
            ],
          },
        ],
      },
    ];
    const tree = getTree(content);
    assert.deepEqual(tree, expected);
  });

  it("getTree complex", function () {
    const content: Node[] = [
      {
        name: "h2-1",
        level: 2,
        startLine: 0,
        // endCharacter: 4 + 2,
      },
      {
        name: "h3-1",
        level: 3,
        startLine: 1,
        // endCharacter: 4 + 3,
      },
      {
        name: "h4-1",
        level: 4,
        startLine: 2,
        // endCharacter: 4 + 4,
      },
      {
        name: "h3-2",
        level: 3,
        startLine: 0,
        // endCharacter: 4 + 3,
      },
      {
        name: "h5-1",
        level: 5,
        startLine: 4,
        // endCharacter: 4 + 5,
      },
      // line 5 has content
      {
        name: "h2-2",
        level: 2,
        startLine: 6,
        // endCharacter: 4 + 2,
      },
      {
        name: "h5-2",
        level: 5,
        startLine: 7,
        // endCharacter: 4 + 5,
      },
      {
        name: "h3-3",
        level: 3,
        startLine: 8,
        // endCharacter: 4 + 3,
      },
      // line 9 has content
    ];

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

    const expected: Node[] = [
      {
        level: 2,
        name: "h2-1",
        startLine: 0,
        children: [
          {
            level: 3,
            name: "h3-1",
            parent: 0,
            startLine: 1,
            children: [
              {
                level: 4,
                name: "h4-1",
                parent: 1,
                startLine: 2,
                children: [],
              },
            ],
          },
          {
            level: 3,
            name: "h3-2",
            parent: 0,
            startLine: 0,
            children: [
              {
                level: 5,
                name: "h5-1",
                parent: 3,
                startLine: 4,
                children: [],
              },
            ],
          },
        ],
      },
      {
        level: 2,
        name: "h2-2",
        startLine: 6,
        children: [
          {
            level: 5,
            name: "h5-2",
            parent: 5,
            startLine: 7,
            children: [],
          },
          {
            level: 3,
            name: "h3-3",
            parent: 5,
            startLine: 8,
            children: [],
          },
        ],
      },
    ];
    const tree = getTree(content);
    assert.deepEqual(tree, expected);
  });

  it.only("getSymbols simple", () => {
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
