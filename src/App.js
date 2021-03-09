import * as React from "react";
import "./App.css";
import Chess from "chess.js";

import Board from "./components/Board";
import SideBar from "./components/SideBar";
import SideboxItem from "./components/Sidebox";
import { getMoveObj, hexToSan, isLegal } from "./utils/helper";
import { constructPgnTree } from "./utils/pgnHelper";

function App() {
  //console.log("render app");
  const [game, setGame] = React.useState(new Chess());
  const [currentNode, setCurrentNode] = React.useState(constructPgnTree);
  const [settings] = React.useState({ w: "user", b: "computer" });

  console.log(currentNode.move);

  const boardRef = React.useRef();

  const sideRef = React.useRef();

  const turn = game.turn();

  let lastClick = null;
  let activePiece = null;

  function validateMove(san) {
    if (activePiece) {
      let move = isLegal(game.moves({ verbose: true }), lastClick, san);

      // if move is legal
      if (move) {
        if (move.san.includes("+")) {
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
    if (!currentNode.nextMove) {
      return;
    }
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

  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      let newGame = { ...game };
      let undo = newGame.undo();
      undo = newGame.undo();
      if (undo) {
        boardRef.current.setBoard(newGame.board());
        setCurrentNode(currentNode.parent.parent);
        setGame(newGame);
      }
    }
  };

  React.useEffect(() => {
    if (currentNode.nextMove === null) {
      sideRef.current.toggleAlert("yessa");
    }

    boardRef.current.setBoard(game.board());
    if (settings[game.turn()] === "computer" && currentNode.nextMove != null) {
      const goodMoves = [currentNode.nextMove];
      if (currentNode.variation) {
        currentNode.variation.forEach((element) => {
          goodMoves.push(element);
        });
      }
      const node = goodMoves[Math.floor(Math.random() * goodMoves.length)];
      let move = getMoveObj(game.moves({ verbose: true }), node.move);

      setTimeout(() => {
        let newGame = { ...game };
        newGame.move(move);

        boardRef.current.makeMove(move);
        boardRef.current.setBoard(newGame.board());

        setCurrentNode(node);
        setGame(newGame);
      }, 500);
    }
  }, [game, currentNode, settings]);

  return (
    <div id="main">
      <SideBar />

      <div id="appgame">
        <Board clickHandler={handleClick} ref={boardRef}></Board>
      </div>

      <SideboxItem
        ref={sideRef}
        move={currentNode.move}
        comment={currentNode.comment}
      />
    </div>
  );
}

export default App;
