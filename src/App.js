import * as React from "react";
import "./App.css";
import Chess from "chess.js";

import Board from "./components/Board";
import NavBar from "./components/NavBar";
import { hexToSan, isLegal } from "./utils/helper";

function App() {
  //console.log("render app");
  const [game, setGame] = React.useState(new Chess());

  const boardRef = React.useRef();

  let turn = game.turn();

  let lastClick = null;
  let activePiece = null;
  function handleClick({ rank, file }) {
    let san = hexToSan(rank, file);

    let square = game.get(san);

    if (square) {
      if (square.color === turn) {
        if (san === activePiece) {
          boardRef.current.highlightSquares([]);
          activePiece = null;
        } else {
          activePiece = san;
          let legalMoves = game.moves({ square: san, verbose: true });

          boardRef.current.highlightSquares(legalMoves);
        }
      } else {
        if (activePiece) {
          //ask if legal
          let move = isLegal(game.moves({ verbose: true }), lastClick, san);
          if (move) {
            let newGame = { ...game };
            newGame.move(move.san);

            setGame(newGame);
            return move;
          } else {
            activePiece = null;
            lastClick = null;
            boardRef.current.highlightSquares([]);
          }
        }
      }
    } else {
      if (activePiece) {
        //ask if legal

        let move = isLegal(game.moves({ verbose: true }), lastClick, san);
        if (move) {
          let newGame = { ...game };
          newGame.move(move.san);

          setGame(newGame);
          return move;
        } else {
          boardRef.current.highlightSquares([]);

          activePiece = null;
          lastClick = null;
        }
      }
    }
    lastClick = san;
  }

  /* Computer vs. Computer random moves */
  // React.useEffect(() => {
  //   boardRef.current.setBoard(game.board());
  //   setInterval(() => {
  //     const move = game.moves({ verbose: true })[
  //       Math.floor(Math.random() * game.moves().length)
  //     ];
  //     game.move(move);
  //     boardRef.current.makeDo(move);
  //     boardRef.current.setBoard(game.board());
  //   }, 2000);
  // }, [boardRef, game]);

  React.useEffect(() => {
    boardRef.current.setBoard(game.board());
  });

  return (
    <div id="main">
      <NavBar />
      <Board clickHandler={handleClick} ref={boardRef}></Board>
    </div>
  );
}

export default App;
