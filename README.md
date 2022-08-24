The Nacho language is a variation of the markdown language.

It is especially designed to make it easier to organize notes into headings and subheadings to make it easier to navigate and find information quickly through the use of code folding and quick panel symbol lookups (cmd/ctrl + R).

Its main differences compared to markdown are:

* Headings (##, ###, ####, etc.) can be indented and still show up in the symbols quick panel.

```
  ## This is an h2
    This is a paragraph.

    ### This is an h3
      This is a paragraph.

    ### This is another h3
      This is another paragraph.
```

* Instead of h1, a single hash works as a comment. Words in the comment can appear highlighted when surrounded by asterisks, colons or backticks:

```
# This is a comment with three highlights: *highlight 1*, :highlight 2: and `highlight 3`.
````
