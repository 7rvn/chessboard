import * as React from "react";
import "./App.css";
import Chess from "chess.js";

import Board from "./components/Board";
import NavBar from "./components/NavBar";

import { sanToHexTo, hexToAlgebraic, isLegal, algToHex } from "./utils/helper";
import { constructPgnTree } from "./utils/pgnHelper";

function App() {
  console.log("render appp");
  const [game, setGame] = React.useState(new Chess());
  const [board, setBoard] = React.useState(game.board());

  const turn = game.turn();

  let move = null;
  let lastClick = null;
  function handleClick({ rank, file }) {
    lastClick = { file: file, rank: rank };
  }

  React.useEffect(() => {
    if (move) {
      game.move(move.san);
      setBoard(game.board());
    }
  }, [move, game]);

  return (
    <div id="main">
      <NavBar />
      <Board position={board} clickHandler={handleClick} move={move}></Board>
    </div>
  );
}

export default App;
