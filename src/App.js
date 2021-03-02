import * as React from "react";
import "./App.css";
import Chess from "chess.js";

import Board from "./components/Board";
import NavBar from "./components/NavBar";

import { algebraicToHex, hexToAlgebraic } from "./utils/helper";

function App() {
  const [game, setGame] = React.useState(new Chess());
  const [board, setBoard] = React.useState(game.board());

  const [highlights, setHighlights] = React.useState([]);
  const [legalMoves, setLegalMoves] = React.useState([]);
  const [activePiece, setActivePiece] = React.useState();
  const [lastMove, setLastMove] = React.useState([]);

  function handleClick(e) {
    e.preventDefault();

    const square = e.target.className.slice(-2);
    const isPiece = e.target.className[0] === "p";

    // if right click
    if (e.button === 2) {
      // toggle highlight square
      setActivePiece("");
      setLegalMoves([]);
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
      setHighlights([]);

      // if square is piece
      if (isPiece) {
        // if clicked on active piece, deactivate
        if (activePiece === square) {
          setLegalMoves([]);
          setActivePiece("");
          return;
        } else {
          setActivePiece(square);
          const algSquare = hexToAlgebraic(square);
          const moves = game.moves({ square: algSquare });
          setLegalMoves(algebraicToHex(moves));
        }
      }
      if (activePiece) {
        const moveFrom = hexToAlgebraic(activePiece);
        const moveTo = hexToAlgebraic(square);
        const makeMove = game.move({ from: moveFrom, to: moveTo });
        if (makeMove) {
          setBoard(game.board());
          setLegalMoves([]);
          setLastMove([activePiece, square]);
          setActivePiece("");
          setTimeout(() => makeComputerMove(), 1000);
        } else {
          setLegalMoves([]);
          setActivePiece("");
        }
      }
    }
  }

  function makeComputerMove() {
    console.log("pc move");
    const moves = game.moves({ verbose: true });
    const verboseMove = moves[Math.floor(Math.random() * moves.length)];
    const algFrom = verboseMove.from;
    const algTo = verboseMove.to;
    const hexFrom = algebraicToHex([algFrom]);
    const hexTo = algebraicToHex([algTo]);
    game.move({ from: algFrom, to: algTo });
    setBoard(game.board());
    setLastMove([hexFrom, hexTo]);
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
    </div>
  );
}

export default App;
