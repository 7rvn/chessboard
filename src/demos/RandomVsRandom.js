import * as React from "react";
import "../App.css";

import { playSound } from "../utils/utils";

import Chess from "chess.js";

import Board from "../components/Board";

function RandomVsRandom() {
  /* States */
  /* ************ */
  const [game, setGame] = React.useState(new Chess());

  /* Refs & Derived State */
  /* ************ */
  const boardRef = React.useRef();

  React.useEffect(() => {
    if (game.game_over()) {
      return;
    }

    const timeout = setTimeout(() => {
      const newGame = { ...game };
      const moves = newGame.moves();
      const move = newGame.move(
        moves[Math.floor(Math.random() * moves.length)]
      );
      move.flags = move.san.includes("+") ? move.flags + "+" : move.flags;

      playSound(move.flags);
      boardRef.current.setBoard(newGame.board());
      setGame(newGame);

      return () => {
        clearTimeout(timeout);
      };
    }, 1000);
  }, [game]);

  return (
    <div id="main">
      <div id="appgame">
        <Board ref={boardRef}></Board>
      </div>
    </div>
  );
}

export default RandomVsRandom;
