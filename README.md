# Nacho

Nacho is a lightweight variation of Markdown designed for note-taking. It makes it easy to organize notes into headings and subheadings so you can navigate large files quickly through **code folding** and the **symbol quick panel** (`cmd`/`ctrl` + `R`).

## How it differs from Markdown

### Indented headings

Headings (`##`, `###`, `####`, …) can be indented to mirror your note structure, and they still appear in the symbols quick panel and Outline view:

```
  ## This is an h2
    This is a paragraph.

    ### This is an h3
      This is a paragraph.

    ### This is another h3
      This is another paragraph.
```

Each heading nests under the nearest shallower heading above it, so the Outline view reflects your indentation hierarchy.

### Comments instead of h1

A single hash starts a comment (rather than an h1). Words in a comment are highlighted when surrounded by asterisks or backticks:

```
# This is a comment with two highlights: *highlight 1* and `highlight 2`.
```

Lines starting with `//` or `--` are also treated as comments.

### Other syntax

- **Emphasis** anywhere in the document: `*text*` and `` `text` ``.
- **Strings**: `"..."`, `"..."` (curly quotes), and `«...»` (Spanish guillemets).
- **Blockquotes**: lines starting with `>`.
- Numbers, arithmetic/assignment/comparison/logical operators, and HTML (`<!-- ... -->`) comments are highlighted.

## Navigation

- `cmd`/`ctrl` + `R`—jump to any heading via the symbol quick panel.
- The **Outline** view shows the full heading hierarchy.
- To keep all heading levels visible in sticky scroll, raise `editor.stickyScroll.maxLineCount` in your settings.

## Note on file associations

Nacho currently registers itself for the `.txt` extension, so plain-text files open in Nacho mode. You can override this per file with the language selector in the status bar.

## Development

The TextMate grammar is authored in `syntaxes/nacho.tmLanguage.yaml`. After editing it, regenerate the JSON that VS Code loads:

```
npm run syntax
```
