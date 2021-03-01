import * as React from "react";

function getPiece(pieceObj) {
  if (pieceObj !== null) {
    return pieceObj.color + pieceObj.type;
  } else {
    return "empty";
  }
}

function Square({ piece, rank, file, clickHandler }) {
  return (
    <div
      className={`piece ${getPiece(piece)} square square-${rank}${file}`}
      onClick={clickHandler}
      // onContextMenu={(e) => clickSquare(e, square, type)}
    />
  );
}

export default Square;
