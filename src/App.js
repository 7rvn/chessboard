import * as React from "react";
import "./App.css";
import Chess from "chess.js";

import Board from "./components/Board";
import NavBar from "./components/NavBar";

import { sanToHexTo, hexToAlgebraic, isLegal } from "./utils/helper";
import { constructPgnTree } from "./utils/pgnHelper";

function App() {
  const [game, setGame] = React.useState(new Chess());
  const [board, setBoard] = React.useState(game.board());

  const [highlights, setHighlights] = React.useState([]);
  const [legalMoves, setLegalMoves] = React.useState([]);
  const [activePiece, setActivePiece] = React.useState();
  const [lastMove, setLastMove] = React.useState([]);
  const [pgnTree, setPgnTree] = React.useState(constructPgnTree);
  const [alertBox, setAlertBox] = React.useState("make a move");
  const [currentNode, setCurrentNode] = React.useState(pgnTree);

  function handleClick(e) {
    e.preventDefault();

    const square = e.target.className.slice(-2);
    const isPiece = e.target.className[0] === "p";

    // if right click
    if (e.button === 2) {
      // deactive piece
      setActivePiece("");
      setLegalMoves([]);

      // toggle highlight square
      const copyHighlights = [...highlights];
      const index = copyHighlights.indexOf(square);

      if (index > -1) {
        copyHighlights.splice(index, 1);
      } else {
        copyHighlights.push(square);
      }
      setHighlights(copyHighlights);

      // if left click
    } else {
      // disable highlights
      setHighlights([]);

      // if square is piece
      if (isPiece) {
        // if clicked on active piece
        if (activePiece === square) {
          // deactive piece
          setLegalMoves([]);
          setActivePiece("");
          return;

          // if clicked on inactive piece
        } else {
          // activate piece
          setActivePiece(square);

          // highlight legal moves
          const algSquare = hexToAlgebraic(square);
          const moves = game.moves({ square: algSquare, verbose: true });
          const legalMovesHex = sanToHexTo(moves.map((x) => x.to));

          setLegalMoves(legalMovesHex);
        }
      }
      if (activePiece) {
        const moveFrom = hexToAlgebraic(activePiece);
        const moveTo = hexToAlgebraic(square);
        const mainLineMove = currentNode;
        const moves = game.moves({ square: moveFrom, verbose: true });

        // find san of move also checks if legal
        const san = isLegal(moves, moveFrom, moveTo);

        // if move is legal
        if (san) {
          // get recommended moves
          console.log(san, " is legal, but is it good?");
          const goodMoves = [currentNode.move];
          if (currentNode.sideline) {
            currentNode.sideline.forEach((element) => {
              goodMoves.push(element.move);
            });
          }
          console.log("good moves:", goodMoves);

          // check if move is recommended
          if (goodMoves.includes(san)) {
            console.log("good do it");

            game.move({ from: moveFrom, to: moveTo });
            setBoard(game.board());
            setLegalMoves([]);
            setLastMove([activePiece, square]);
            setActivePiece("");

            setTimeout(() => makeComputerMove(currentNode.nextMove.move), 300);
            setCurrentNode(currentNode.nextMove.nextMove);

            // move legal but not recommended
          } else {
          }
          // move illegal
        } else {
        }

        // console.log(
        //   "currnet move:",
        //   mainLineMove,
        //   mainLineMove.to,
        //   moveTo,
        //   " : ",
        //   mainLineMove.from,
        //   moveFrom
        // );
        // if (mainLineMove.to === moveTo && mainLineMove.from === moveFrom) {
        //   setAlertBox("correct move");
        //   console.log("correct move");
        // } else {
        //   //return;
        // }
        // const makeMove = game.move({ from: moveFrom, to: moveTo });
        // if (makeMove) {
        //   setBoard(game.board());
        //   setLegalMoves([]);
        //   setLastMove([activePiece, square]);
        //   setActivePiece("");
        //   setTimeout(() => makeComputerMove(currentNode.nextMove.move), 300);
        //   setCurrentNode(currentNode.nextMove.nextMove);
        // } else {
        //   setLegalMoves([]);
        //   setActivePiece("");
        // }
      }
    }
  }

  function makeComputerMove(move = null) {
    console.log("pc move", move);
    if (move) {
      game.move(move);
      //setLastMove([hexFrom, hexTo]);
    } else {
      const moves = game.moves({ verbose: true });
      const verboseMove = moves[Math.floor(Math.random() * moves.length)];
      const algFrom = verboseMove.from;
      const algTo = verboseMove.to;
      const hexFrom = sanToHexTo([algFrom]);
      const hexTo = sanToHexTo([algTo]);
      game.move({ from: algFrom, to: algTo });
      setLastMove([hexFrom, hexTo]);
    }
    setBoard(game.board());
  }

  return (
    <div id="main">
      <NavBar />
      <Board
        position={board}
        clickHandler={handleClick}
        highlights={highlights}
        legalMoves={legalMoves}
        activePiece={activePiece}
        lastMove={lastMove}
      ></Board>
      <div className={"alertBox"} style={{ color: "white" }}>
        {alertBox}
      </div>
    </div>
  );
}

export default App;
