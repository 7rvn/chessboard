import * as React from "react";

function getClassName(pieceObj) {
  if (pieceObj !== null) {
    return "piece " + pieceObj.color + pieceObj.type + " ";
  } else {
    return "";
  }
}

function Square({ piece, rank, file, clickHandler }) {
  return (
    <div
      className={`${getClassName(piece)}square square-${rank}${file}`}
      onClick={clickHandler}
      onContextMenu={clickHandler}
    />
  );
}

export default Square;
