import * as React from "react";
import "./App.css";
import Chess from "chess.js";

import Board from "./components/Board";
import SideBar from "./components/SideBar";
import TopBar from "./components/TopBar";
import { hexToSan, isLegal } from "./utils/helper";

function App() {
  //console.log("render app");
  const [game, setGame] = React.useState(new Chess());

  const boardRef = React.useRef();

  let turn = game.turn();

  let lastClick = null;
  let activePiece = null;

  function ifActiveTryToMove(san) {
    if (activePiece) {
      let move = isLegal(game.moves({ verbose: true }), lastClick, san);
      if (move) {
        let newGame = { ...game };
        newGame.move(move.san);

        setGame(newGame);
        return move;
      } else {
        activePiece = null;
        lastClick = null;
        boardRef.current.hintSquares([]);
      }
    }
  }

  function handleClick({ rank, file }) {
    let san = hexToSan(rank, file);

    let square = game.get(san);

    if (square) {
      if (square.color === turn) {
        if (san === activePiece) {
          boardRef.current.hintSquares([]);
          activePiece = null;
        } else {
          activePiece = san;
          let legalMoves = game.moves({ square: san, verbose: true });

          boardRef.current.hintSquares(legalMoves);
        }
      } else {
        const move = ifActiveTryToMove(san);
        return move;
      }
    } else {
      const move = ifActiveTryToMove(san);
      return move;
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
  //     boardRef.current.makeMove(move);
  //     boardRef.current.setBoard(game.board());
  //   }, 2000);
  // }, [boardRef, game]);

  React.useEffect(() => {
    boardRef.current.setBoard(game.board());
  });

  return (
    <div id="main">
      <SideBar />

      <div id="appgame">
        <TopBar> Vienna Gambit</TopBar>
        <Board clickHandler={handleClick} ref={boardRef}></Board>
      </div>
    </div>
  );
}

export default App;
