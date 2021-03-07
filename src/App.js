import * as React from "react";
import "./App.css";
import Chess from "chess.js";

import Board from "./components/Board";
import NavBar from "./components/NavBar";
import { hexToSan, isLegal, sanToHexTo } from "./utils/helper";

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

    let square = game.get(san);

    if (square) {
      if (square.color === turn) {
        console.log(
          "active: ",
          activePiece,
          " square: ",
          square,
          " =>",
          activePiece === square
        );
        if (san === activePiece) {
          boardRef.current.highlightSquares([]);
          activePiece = null;
        } else {
          activePiece = san;
          let legalMoves = game.moves({ square: san });
          boardRef.current.highlightSquares(sanToHexTo(legalMoves));
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
            boardRef.current.highlightSquares([]);
          }
        }
      }
    } else {
      if (activePiece) {
        //ask if legal
        console.log("want to move: ", lastClick, " to ", san);
        let move = isLegal(game.moves({ verbose: true }), lastClick, san);
        if (move) {
          console.log("legal move");

          let newGame = { ...game };
          newGame.move(move);
          console.log("setting game");
          setGame(newGame);
          return true;
        } else {
          boardRef.current.highlightSquares([]);
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
