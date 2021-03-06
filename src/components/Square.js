import * as React from "react";

function getClassName(pieceObj) {
  if (pieceObj !== null) {
    return "piece " + pieceObj.color + pieceObj.type + " ";
  } else {
    return "";
  }
}

function Square({ piece, rank, file, boardClick, style }) {
  return (
    <div
      className={`${getClassName(piece)}square square-${rank}${file}`}
      onClick={(e) => boardClick({ rank: rank, file: file, e: e })}
      onContextMenu={(e) => boardClick({ rank: rank, file: file, e: e })}
      style={style}
    />
  );
}

export default Square;
