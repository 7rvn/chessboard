import * as React from "react";
import "./App.css";
import Chess from "chess.js";

import Board from "./components/Board";
import NavBar from "./components/NavBar";

import { sanToHexTo, hexToAlgebraic, isLegal, algToHex } from "./utils/helper";
import { constructPgnTree } from "./utils/pgnHelper";

function App() {
  console.log("render app");
  const [game, setGame] = React.useState(new Chess());
  const [board, setBoard] = React.useState(game.board());

  const boardRef = React.useRef();

  let lastClick = null;
  function handleClick({ rank, file }) {
    lastClick = { file: file, rank: rank };
  }

  React.useEffect(() => {
    boardRef.current.setBoard(game.board());
    setInterval(() => {
      const move = game.moves({ verbose: true })[
        Math.floor(Math.random() * game.moves().length)
      ];
      game.move(move);
      boardRef.current.makeDo(move);
      boardRef.current.setBoard(game.board());
    }, 2000);
  }, [boardRef, game]);

  return (
    <div id="main">
      <NavBar />
      <Board clickHandler={handleClick} ref={boardRef}></Board>
    </div>
  );
}

export default App;
