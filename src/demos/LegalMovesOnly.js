import * as React from "react";
import "../App.css";

import { algToHex, hexToSan } from "../utils/helper";
import { playSound } from "../utils/utils";

import Chess from "chess.js";

import Board from "../components/Board";

function App() {
  function handleMove(hexmove) {
    const newGame = { ...game };
    const move = newGame.move({
      from: hexToSan(hexmove.from.rank, hexmove.from.file),
      to: hexToSan(hexmove.to.rank, hexmove.to.file),
    });

    boardRef.current.setBoard(newGame.board());
    if (move) {
      move.flags = move.san.includes("+") ? move.flags + "+" : move.flags;
      console.log(move);
      playSound(move.flags);
      setGame(newGame);
    }
  }

  function handleActivatingPiece({ rank, file }) {
    const sanFrom = hexToSan(rank, file);
    const isTurn = game.turn() === game.get(sanFrom)?.color;

    if (!isTurn) {
      return false;
    }

    const out = game.moves({ verbose: true, square: sanFrom }).map((m) => {
      const san = algToHex(m.to);
      const type =
        m.flags.includes("c") || m.flags.includes("e")
          ? "capture-hint"
          : "hint";
      return { rank: san[0], file: san[1], type: type };
    });

    boardRef.current.addHighlights({
      squares: out,
      type: "legalMoves",
    });
  }

  /* States */
  /* ************ */
  const [game, setGame] = React.useState(new Chess());

  /* Refs & Derived State */
  /* ************ */
  const boardRef = React.useRef();

  return (
    <div id="main">
      <div id="appgame">
        <Board
          ref={boardRef}
          onMakeMove={handleMove}
          onActivatePiece={handleActivatingPiece}
        ></Board>
      </div>
    </div>
  );
}

export default App;
