import * as assert from "assert";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";
import { getSymbols, getTree, Node } from "../../extension";
import { it, test } from "mocha";
import { getAllJSDocTagsOfKind } from "typescript";

// import * as JsonSchema from '../jsonSchema';

// import {
// 	Thenable, getLanguageService,
// 	ClientCapabilities, DocumentSymbolsContext,
// 	TextDocument, Color, SymbolInformation, SymbolKind, Range, Position, TextEdit, DocumentSymbol
// } from "../jsonLanguageService";
// import { colorFrom256RGB } from '../utils/colors';

describe("Nacho Document Symbols", () => {
  // vscode.window.showInformationMessage("Start all tests.");

  it("getTree 1-level", function () {
    const content: Node[] = [
      {
        name: "h2-1",
        level: 2,
        line: 0,
        // endCharacter: 4 + 2,
      },
      {
        name: "h3-1",
        level: 3,
        line: 1,
        // endCharacter: 4 + 3,
      },
    ];
    // (0) ## h2-1        (1)
    // (1)   ### h3-1     (1)

    const expected: Node[] = [
      {
        name: "h2-1",
        level: 2,
        line: 0,
        // endLine: 1,
        // endCharacter: 4 + 3,
        children: [
          {
            name: "h3-1",
            level: 3,
            line: 1,
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
        line: 0,
        // endCharacter: 4 + 2,
      },
      {
        name: "h3-1",
        level: 3,
        line: 1,
        // endCharacter: 4 + 3,
      },
      {
        name: "h4-1",
        level: 4,
        line: 2,
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
        line: 0,
        // endLine: 2,
        // endCharacter: 4 + 4,
        children: [
          {
            name: "h3-1",
            level: 3,
            line: 1,
            // endLine: 2,
            // endCharacter: 4 + 4,
            parent: 0,
            children: [
              {
                name: "h4-1",
                level: 4,
                parent: 1,
                line: 2,
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
        line: 0,
        // endCharacter: 4 + 2,
      },
      {
        name: "h3-1",
        level: 3,
        line: 1,
        // endCharacter: 4 + 3,
      },
      {
        name: "h4-1",
        level: 4,
        line: 2,
        // endCharacter: 4 + 4,
      },
      {
        name: "h3-2",
        level: 3,
        line: 0,
        // endCharacter: 4 + 3,
      },
      {
        name: "h5-1",
        level: 5,
        line: 4,
        // endCharacter: 4 + 5,
      },
      // line 5 has content
      {
        name: "h2-2",
        level: 2,
        line: 6,
        // endCharacter: 4 + 2,
      },
      {
        name: "h5-2",
        level: 5,
        line: 7,
        // endCharacter: 4 + 5,
      },
      {
        name: "h3-3",
        level: 3,
        line: 8,
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
        line: 0,
        children: [
          {
            level: 3,
            name: "h3-1",
            parent: 0,
            line: 1,
            children: [
              {
                level: 4,
                name: "h4-1",
                parent: 1,
                line: 2,
                children: [],
              },
            ],
          },
          {
            level: 3,
            name: "h3-2",
            parent: 0,
            line: 0,
            children: [
              {
                level: 5,
                name: "h5-1",
                parent: 3,
                line: 4,
                children: [],
              },
            ],
          },
        ],
      },
      {
        level: 2,
        name: "h2-2",
        line: 6,
        children: [
          {
            level: 5,
            name: "h5-2",
            parent: 5,
            line: 7,
            children: [],
          },
          {
            level: 3,
            name: "h3-3",
            parent: 5,
            line: 8,
            children: [],
          },
        ],
      },
    ];
    const tree = getTree(content);
    assert.deepEqual(tree, expected);
  });

  it("getSymbols simple", () => {
    const tree: Node[] = [
      {
        name: "h2-1",
        level: 2,
        line: 0,
        // endLine: 2,
        // endCharacter: 4 + 4,
        children: [
          {
            name: "h3-1",
            level: 3,
            line: 1,
            // endLine: 2,
            // endCharacter: 4 + 4,
            parent: 0,
            children: [
              {
                name: "h4-1",
                level: 4,
                parent: 1,
                line: 2,
                // endLine: 2,
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
  });

  // const schemaRequestService = function (uri: string): Promise<string> {
  //   return Promise.reject<string>("Resource not found");
  // };

  // function getFlatOutline(value: string, context?: { resultLimit?: number }): SymbolInformation[] {
  // 	const uri = 'test://test.json';
  // 	const ls = getLanguageService({ schemaRequestService, clientCapabilities: ClientCapabilities.LATEST });

  // 	const document = TextDocument.create(uri, 'json', 0, value);
  // 	const jsonDoc = ls.parseJSONDocument(document);
  // 	return ls.findDocumentSymbols(document, jsonDoc, context);
  // }

  // function getHierarchicalOutline(value: string, context?: { resultLimit?: number }): DocumentSymbol[] {
  // 	const uri = 'test://test.json';
  // 	const ls = getLanguageService({ schemaRequestService, clientCapabilities: ClientCapabilities.LATEST });

  // 	const document = TextDocument.create(uri, 'json', 0, value);
  // 	const jsonDoc = ls.parseJSONDocument(document);
  // 	return ls.findDocumentSymbols2(document, jsonDoc, context);
  // }

  // function assertColors(value: string, schema: JsonSchema.JSONSchema, expectedOffsets: number[], expectedColors: Color[]): Thenable<any> {
  // 	const uri = 'test://test.json';
  // 	const schemaUri = "http://myschemastore/test1";

  // 	const ls = getLanguageService({ schemaRequestService, clientCapabilities: ClientCapabilities.LATEST });
  // 	ls.configure({ schemas: [{ fileMatch: ["*.json"], uri: schemaUri, schema }] });

  // 	const document = TextDocument.create(uri, 'json', 0, value);
  // 	const jsonDoc = ls.parseJSONDocument(document);
  // 	return ls.findDocumentColors(document, jsonDoc).then(colorInfos => {
  // 		const actualOffsets = colorInfos.map(r => document.offsetAt(r.range.start));
  // 		assert.deepEqual(actualOffsets, expectedOffsets);
  // 		const actualColors = colorInfos.map(r => r.color);
  // 		assert.deepEqual(actualColors, expectedColors);
  // 	});
  // }

  // function assertColorPresentations(color: Color, ...expected: string[]) {
  // 	const ls = getLanguageService({ schemaRequestService, clientCapabilities: ClientCapabilities.LATEST });

  // 	const document = TextDocument.create('test://test/test.css', 'css', 0, '');

  // 	const doc = ls.parseJSONDocument(document);
  // 	const range = Range.create(Position.create(0, 0), Position.create(0, 1));
  // 	const result = ls.getColorPresentations(document, doc, color, range);
  // 	assert.deepEqual(result.map(r => r.label), expected);
  // 	assert.deepEqual(result.map(r => r.textEdit), expected.map(l => TextEdit.replace(range, JSON.stringify(l))));
  // }

  // function assertOutline(value: string, expected: any[], message?: string) {
  // 	const actual = getFlatOutline(value);

  // 	assert.equal(actual.length, expected.length, message);
  // 	for (let i = 0; i < expected.length; i++) {
  // 		assert.equal(actual[i].name, expected[i].label, message);
  // 		assert.equal(actual[i].kind, expected[i].kind, message);
  // 	}
  // }
  // interface ExpectedDocumentSymbol {
  // 	label: string;
  // 	kind: SymbolKind;
  // 	detail: string | undefined;
  // 	children: ExpectedDocumentSymbol[];
  // }

  // function assertHierarchicalOutline(value: string, expected: ExpectedDocumentSymbol[], message?: string) {
  // 	function assertDocumentSymbols(actuals: DocumentSymbol[], expected: ExpectedDocumentSymbol[]) {
  // 		assert.equal(actuals.length, expected.length, message);
  // 		for (let i = 0; i < expected.length; i++) {
  // 			assert.equal(actuals[i].name, expected[i].label, message);
  // 			assert.equal(actuals[i].kind, expected[i].kind, message);
  // 			assert.equal(actuals[i].detail, expected[i].detail, message);
  // 			assertDocumentSymbols(actuals[i].children!, expected[i].children);
  // 		}
  // 	}
  // 	const actual = getHierarchicalOutline(value);
  // 	assertDocumentSymbols(actual, expected);

  // 	assert.equal(actual.length, expected.length, message);
  // 	for (let i = 0; i < expected.length; i++) {
  // 		assert.equal(actual[i].name, expected[i].label, message);
  // 		assert.equal(actual[i].kind, expected[i].kind, message);
  // 		assert.equal(actual[i].kind, expected[i].kind, message);
  // 	}
  // }

  // test('Outline - Arrays', function () {
  // 	const content = '{ "key1": 1, "key2": [ 1, 2, 3 ], "key3" : [ { "k1": 1 }, {"k2": 2 } ] }';

  // 	const expected = [
  // 		{ label: 'key1', kind: SymbolKind.Number },
  // 		{ label: 'key2', kind: SymbolKind.Array },
  // 		{ label: 'key3', kind: SymbolKind.Array },
  // 		{ label: 'k1', kind: SymbolKind.Number },
  // 		{ label: 'k2', kind: SymbolKind.Number }
  // 	];

  // 	assertOutline(content, expected);
  // });

  // test('Outline - Objects', function () {
  // 	const content = '{ "key1": { "key2": true }, "key3" : { "k1":  { } }';

  // 	const expected = [
  // 		{ label: 'key1', kind: SymbolKind.Module },
  // 		{ label: 'key3', kind: SymbolKind.Module },
  // 		{ label: 'key2', kind: SymbolKind.Boolean },
  // 		{ label: 'k1', kind: SymbolKind.Module }
  // 	];

  // 	assertOutline(content, expected);
  // });

  // test('Outline - object with syntax error', function () {
  // 	const content = '{ "key1": { "key2": true, "key3":, "key4": false } }';

  // 	const expected = [
  // 		{ label: 'key1', kind: SymbolKind.Module },
  // 		{ label: 'key2', kind: SymbolKind.Boolean },
  // 		{ label: 'key4', kind: SymbolKind.Boolean },
  // 	];

  // 	assertOutline(content, expected);
  // });

  // test('Outline - empty name', function () {
  // 	const content = '{ "": 1, " ": 2 }';

  // 	const expected = [
  // 		{ label: '""', kind: SymbolKind.Number },
  // 		{ label: '" "', kind: SymbolKind.Number }
  // 	];

  // 	assertOutline(content, expected);

  // 	const expected2: ExpectedDocumentSymbol[] = [
  // 		{ label: '""', kind: SymbolKind.Number, detail: '1', children: [] },
  // 		{ label: '" "', kind: SymbolKind.Number, detail: '2', children: [] }
  // 	];

  // 	assertHierarchicalOutline(content, expected2);
  // });

  // test('Outline - new line in name', function () {
  // 	const content = '{ "1\\n2": 1 }';

  // 	const expected = [
  // 		{ label: '1↵2', kind: SymbolKind.Number }
  // 	];

  // 	assertOutline(content, expected);

  // 	const expected2: ExpectedDocumentSymbol[] = [
  // 		{ label: '1↵2', kind: SymbolKind.Number, detail: '1', children: [] }
  // 	];

  // 	assertHierarchicalOutline(content, expected2);
  // });

  // test('Hierarchical Outline - Object', function () {
  // 	const content = '{ "key1": { "key2": true }, "key3" : { "k1":  { } }';

  // 	const expected: ExpectedDocumentSymbol[] = [
  // 		{ label: 'key1', kind: SymbolKind.Module, detail: undefined, children: [{ label: 'key2', kind: SymbolKind.Boolean, detail: 'true', children: [] }] },
  // 		{ label: 'key3', kind: SymbolKind.Module, detail: undefined, children: [{ label: 'k1', kind: SymbolKind.Module, detail: '{}', children: [] }] }
  // 	];

  // 	assertHierarchicalOutline(content, expected);
  // });

  // test('Hierarchical Outline - Array', function () {
  // 	const content = '{ "key1": [ { "key2": true }, { "k1": [] } ]';

  // 	const expected: ExpectedDocumentSymbol[] = [
  // 		{
  // 			label: 'key1', kind: SymbolKind.Array, detail: undefined, children: [
  // 				{ label: '0', kind: SymbolKind.Module, detail: undefined, children: [{ label: 'key2', kind: SymbolKind.Boolean, detail: 'true', children: [] }] },
  // 				{ label: '1', kind: SymbolKind.Module, detail: undefined, children: [{ label: 'k1', kind: SymbolKind.Array, detail: '[]', children: [] }] }]
  // 		}
  // 	];

  // 	assertHierarchicalOutline(content, expected);
  // });

  // test('Outline - limit 1', function () {
  // 	let content = '{';
  // 	for (let i = 0; i < 100; i++) {
  // 		content += `"prop${i}": ${i},`;
  // 	}
  // 	content += '}';

  // 	let exceededUris: string[] = [];

  // 	const context: DocumentSymbolsContext = { resultLimit: 10, onResultLimitExceeded: (uri: string) => exceededUris.push(uri) };

  // 	const flatOutline = getFlatOutline(content, context);
  // 	assert.equal(flatOutline.length, 10, 'flat');
  // 	assert.equal(exceededUris.length, 1);

  // 	exceededUris = [];

  // 	const hierarchicalOutline = getHierarchicalOutline(content, context);
  // 	assert.equal(hierarchicalOutline.length, 10, 'hierarchical');
  // 	assert.equal(exceededUris.length, 1);
  // });

  // test('Outline - limit 2', function () {
  // 	let content = '[';
  // 	for (let i = 0; i < 10; i++) {
  // 		content += '{';

  // 		for (let k = 0; k < 10; k++) {
  // 			content += `"${i}-${k}": ${k},`;
  // 		}
  // 		content += '},';
  // 	}
  // 	content += ']';

  // 	let exceededUris: string[] = [];

  // 	const context: DocumentSymbolsContext = { resultLimit: 25, onResultLimitExceeded: (uri: string) => exceededUris.push(uri) };

  // 	const flatOutline = getFlatOutline(content, context);
  // 	assert.equal(flatOutline.length, 25, 'flat');
  // 	assert.equal(flatOutline.map(s => s.name).join(','), '0-0,0-1,0-2,0-3,0-4,0-5,0-6,0-7,0-8,0-9,1-0,1-1,1-2,1-3,1-4,1-5,1-6,1-7,1-8,1-9,2-0,2-1,2-2,2-3,2-4');
  // 	assert.equal(exceededUris.length, 1);

  // 	exceededUris = [];

  // 	const hierarchicalOutline = getHierarchicalOutline(content, context);
  // 	assert.equal(hierarchicalOutline.length, 10, 'hierarchical');
  // 	assert.equal(hierarchicalOutline[0].children!.length, 10, 'hierarchical children of first');
  // 	assert.equal(hierarchicalOutline[1].children!.length, 5, 'hierarchical children of second');
  // 	assert.equal(hierarchicalOutline[2].children!.length, 0, 'hierarchical children of third');
  // 	assert.equal(exceededUris.length, 1);
  // });

  // test('Colors', async function () {
  // 	const content = '{ "a": "#FF00FF", "b": "#FF0000" }';
  // 	const schema: JsonSchema.JSONSchema = {
  // 		type: 'object',
  // 		description: 'a very special object',
  // 		properties: {
  // 			'a': {
  // 				type: 'number',
  // 				description: 'A',
  // 				format: 'color'
  // 			},
  // 			'b': {
  // 				type: 'string',
  // 				description: 'B',
  // 				format: 'color'
  // 			}
  // 		}
  // 	};

  // 	const expectedOffsets = [7, 23];
  // 	const expectedColors = [colorFrom256RGB(255, 0, 255), colorFrom256RGB(255, 0, 0)];
  // 	return assertColors(content, schema, expectedOffsets, expectedColors);
  // });

  // test('color presentations', function () {
  // 	assertColorPresentations(colorFrom256RGB(255, 0, 0), '#ff0000');
  // 	assertColorPresentations(colorFrom256RGB(77, 33, 111, 0.5), '#4d216f80');
  // });
});
