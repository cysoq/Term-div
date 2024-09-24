# Term-div
A terminal style web setup that allows the user to have a window consisting of tabs and adjustable/splitable panes

## Development Note

Going to change the structure of this project to create and save a Tree Structure Represented in Json
+ This will allow an easier way to save, create, and delete the panes
+ The tree structure is recursive, with each node representing a pane and its splits.
+ The orientation property tells us how the panes are divided (either horizontal or vertical).
+ Leaf nodes (panes without further splits) have an orientation of null and no children.
+ Example structure:
```
+---------------------------+
|          Pane A            |
+---------------------------+
|    Pane B    |   Pane C    |
+---------------------------+
```

``` json
{
  "pane": "Pane A",
  "orientation": "vertical",
  "children": [
    {
      "pane": "Pane B",
      "orientation": "horizontal",
      "children": [
        {
          "pane": "Pane C",
          "orientation": null,
          "children": []
        }
      ]
    }
  ]
}

```
```
+----------------------------+
|          Pane A             |
+----------------------------+
|    Pane B    |   Pane C     |
|              +--------------+
|              |   Pane D      |
+----------------------------+
```
``` json
{
  "pane": "Pane A",
  "orientation": "vertical",
  "children": [
    {
      "pane": "Pane B",
      "orientation": null,
      "children": []
    },
    {
      "pane": null,  // This represents the container holding Pane C and D
      "orientation": "horizontal",
      "children": [
        {
          "pane": "Pane C",
          "orientation": null,
          "children": []
        },
        {
          "pane": "Pane D",
          "orientation": null,
          "children": []
        }
      ]
    }
  ]
}
```