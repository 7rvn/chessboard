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

  console.log("GAME TURN: ", game.turn());

  let turn = game.turn();

  let lastClick = null;
  let activePiece = null;
  function handleClick({ rank, file }) {
    console.log("active: ", activePiece, " last: ", lastClick);
    let san = hexToSan(rank, file);

    // if clicked own piece
    let square = game.get(san);

    if (square) {
      if (square.color === turn) {
        activePiece = square;
      } else {
        if (activePiece) {
          //ask if legal
          let move = isLegal(game.moves({ verbose: true }), lastClick, san);
          if (move) {
            console.log("legal move");

            let newGame = { ...game };
            newGame.move(move);
            console.log("setting game");
            setGame(newGame);
            return true;
          } else {
            console.log("illegal move");
            activePiece = null;
            lastClick = null;
          }
        }
      }
    } else {
      if (activePiece) {
        //ask if legal
        let move = isLegal(game.moves({ verbose: true }), lastClick, san);
        if (move) {
          console.log("legal move");

          let newGame = { ...game };
          newGame.move(move);
          console.log("setting game");
          setGame(newGame);
          return true;
        } else {
          console.log("illegal move");
          activePiece = null;
          lastClick = null;
        }
      }
    }
    lastClick = san;
    console.log("im done burh");
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
