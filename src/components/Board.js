import * as React from "react";

import Square from "./Square";
import Highlight from "./Highlight";
import Hint from "./Hint";

function Board({
  position,
  clickHandler,
  highlights,
  legalMoves,
  activePiece,
  lastMove,
}) {
  return (
    <div className="board-layot" style={{ width: "500px", height: "500px" }}>
      <div className="board" id="board-board">
        {position.map((rank, rankIndex) =>
          rank.map((file, fileIndex) => (
            <Square
              piece={file}
              rank={Math.abs(rankIndex - 7)}
              file={fileIndex}
              key={fileIndex + Math.abs(rankIndex - 7)}
              clickHandler={clickHandler}
            />
          ))
        )}

        {highlights.map((square) => {
          return (
            <Highlight
              square={square}
              key={square}
              color={"red"}
              clickHandler={clickHandler}
            />
          );
        })}

        {legalMoves.map((square) => {
          return (
            <Hint square={square} key={square} clickHandler={clickHandler} />
          );
        })}

        {lastMove.map((square) => {
          return (
            <Highlight
              square={square}
              key={square}
              color={"lightgrey"}
              clickHandler={clickHandler}
            />
          );
        })}

        <Highlight
          square={activePiece}
          key={activePiece}
          color={"yellow"}
          clickHandler={clickHandler}
        />
      </div>
    </div>
  );
}

export default Board;
