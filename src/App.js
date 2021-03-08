import * as React from "react";
import "./App.css";
import Chess from "chess.js";

import Board from "./components/Board";
import SideBar from "./components/SideBar";
import TopBar from "./components/TopBar";
import { hexToSan, isLegal } from "./utils/helper";
import { constructPgnTree } from "./utils/pgnHelper";

function App() {
  //console.log("render app");
  const [game, setGame] = React.useState(new Chess());
  const [currentNode, setCurrentNode] = React.useState(constructPgnTree);
  const [settings] = React.useState({ w: "user", b: "user" });

  const boardRef = React.useRef();

  const turn = game.turn();
  const player = settings[turn];

  let lastClick = null;
  let activePiece = null;

  function validateMove(san) {
    if (activePiece) {
      let move = isLegal(game.moves({ verbose: true }), lastClick, san);

      // if move is legal
      if (move) {
        if (move.san.includes("+")) {
          console.log("issa check");
          move.flags = move.flags + "+";
        }
        // recommended moves from pgn
        const goodMoves = [currentNode.nextMove];
        if (currentNode.variation) {
          currentNode.variation.forEach((element) => {
            goodMoves.push(element);
          });
        }

        const found = goodMoves.find((e) => e.move === move.san);
        // if move is in recommended
        if (found) {
          // execute move
          let newGame = { ...game };
          newGame.move(move.san);
          setCurrentNode(found);

          setGame(newGame);
          console.log(move);
          return move;

          // if move is not recommended
        } else {
          boardRef.current.alertEffect(san);
          activePiece = null;
          lastClick = null;
          boardRef.current.hintSquares([]);
          setTimeout(() => {
            boardRef.current.alertEffect();
            boardRef.current.setBoard(game.board());
          }, 2000);
          return move;
        }

        // if move is illegal
      } else {
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
        const move = validateMove(san);
        return move;
      }
    } else {
      const move = validateMove(san);
      return move;
    }
    lastClick = san;
  }

  if (player === "computer") {
  }

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
