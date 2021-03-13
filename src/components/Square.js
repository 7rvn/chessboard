import * as React from "react";

function getClassName(pieceObj) {
  if (pieceObj !== null) {
    return "piece " + pieceObj.color + pieceObj.type + " ";
  } else {
    return "";
  }
}

function Square({ piece, rank, file }) {
  // console.log("render square");

  return (
    <div className={`${getClassName(piece)}square square-${rank}${file}`} />
  );
}

export default Square;
