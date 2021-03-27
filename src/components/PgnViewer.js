import * as React from "react";
import "../css/pgnviewer.css";

function PgnViewer({ tree, currentNode, goToNode }) {
  const [pgntree] = React.useState(tree);
  let out = [];
  function constructPgnDivs(node, layer = 0) {
    while (node.nextMove) {
      let start = out.length ? "" : "(";

      const style = currentNode?.id === node?.id ? " current-move" : "";
      if (node?.move) {
        let cnode = node;
        out.push(
          <button
            className={"pgn-move" + style}
            key={node.id}
            onClick={() => {
              goToNode(cnode);
            }}
          >
            {start + node.move}
          </button>
        );
      }
      if (node.variation.length) {
        for (let i = 0; i < node.variation.length; i++) {
          constructPgnDivs(node.variation[i], layer + 1);
        }
      }

      node = node.nextMove;
    }
    const style = currentNode?.id === node?.id ? " current-move" : "";
    out.push(
      <button
        className={"pgn-move" + style}
        key={node.id}
        onClick={() => {
          goToNode(node);
        }}
      >
        {node.move + ")"}
      </button>
    );
  }

  constructPgnDivs(pgntree);
  return <div id="pgn-viwer">{out}</div>;
}
export default PgnViewer;
