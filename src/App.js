import * as React from "react";
import "./App.css";
import Chess from "chess.js";

import Board from "./components/Board";

function App() {
  const [game, setGame] = React.useState(new Chess());
  const [board, setBoard] = React.useState(game.board());

  function handleClick() {
    console.log("clickkk");
  }

  return <Board position={board} clickHandler={handleClick}></Board>;
}

export default App;
