import * as React from "react";

import Square from "./Square";
import Highlight from "./Highlight";
import Hint from "./Hint";

function Board({ position, clickHandler }) {
  //   function squareToVerbose(square) {
  //     return (
  //       String.fromCharCode(97 + parseInt(square[1])) +
  //       (parseInt(square[0]) + 1).toString()
  //     );
  //   }

  //   function verboseToSquares(verboseList) {
  //     return verboseList.map(
  //       (x) => (parseInt(x[1]) - 1).toString() + (x.charCodeAt(0) - 97).toString()
  //     );
  //   }
  //   // console.log(game.moves({ square: squareToVerbose("41") }));
  //   // console.log(squareToVerbose("41"));
  //   function highlightActivePiece() {
  //     if (!activePiece) {
  //       return;
  //     }
  //     return (
  //       <Highlight square={activePiece} key={activePiece} color={"yellow"} />
  //     );
  //   }

  //   function clickSquare(e, square, type) {
  //     console.log(game.history());
  //     e.preventDefault();
  //     // if left click highlight
  //     if (e.button === 2) {
  //       setActivePiece("");
  //       setLegalMoves([]);
  //       const copyHighlights = [...highlights];
  //       const index = copyHighlights.indexOf(square);

  //       if (index > -1) {
  //         copyHighlights.splice(index, 1);
  //       } else {
  //         copyHighlights.push(square);
  //       }
  //       setHighlights(copyHighlights);
  //     } else {
  //       setHighlights([]);
  //       // if clicked on active piece
  //       if (activePiece === square) {
  //         setLegalMoves([]);
  //         setActivePiece("");
  //       } else {
  //         //console.log(square);
  //         // if square a apice
  //         if (type != null) {
  //           setActivePiece(square);
  //           const gosquare = squareToVerbose(square);
  //           const moves = game.moves({ square: gosquare });
  //           verboseToSquares(moves);
  //           setLegalMoves(verboseToSquares(moves));
  //         } else {
  //           // if a piece is active

  //           if (activePiece) {
  //             const gosquare = squareToVerbose(square);
  //             const activeSquare = squareToVerbose(activePiece);
  //             const moves = game.moves({ square: activeSquare });
  //             console.log(gosquare);
  //             console.log(moves);
  //             //if square legal mvoe
  //             if (moves.includes(gosquare)) {
  //               console.log("moooooove");
  //               console.log(game.history());
  //               game.move({ from: "e2", to: "e4" });
  //               console.log(game.history());
  //             } else {
  //               setLegalMoves([]);
  //               setActivePiece("");
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }

  //   const [highlights, setHighlights] = React.useState([]);
  //   const [activePiece, setActivePiece] = React.useState("");
  //   const [legalMoves, setLegalMoves] = React.useState([]);

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

        {/* {highlights.map((square) => {
          return <Highlight square={square} key={square} color={"red"} />;
        })}
        {legalMoves.map((square) => {
          return <Hint square={square} key={square} />;
        })}
        {highlightActivePiece()} */}
      </div>
    </div>
  );
}

export default Board;
