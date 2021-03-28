import * as React from "react";
import "../App.css";
import "../css/learnwithvideo.css";
import Chess from "chess.js";

import { playSound } from "../utils/utils";
import { constructPgnTree, getGoodMoves } from "../utils/pgnHelper";
import { algToHex, hexToSan } from "../utils/helper";
import Board from "../components/Board";
import PgnViewer from "../components/PgnViewer";
import Sidebar from "../components/Sidebar";
import openings from "../pgns/youtube";

function App() {
  const opening = openings["C57-Traxler"];
  /* States */
  /* ************ */
  const [game, setGame] = React.useState(new Chess());
  const [currentNode, setCurrentNode] = React.useState(
    constructPgnTree(opening.pgn)
  );
  const [pgnVisible, setPgnVisible] = React.useState(true);

  /* Refs & Derived State */
  /* ************ */
  const boardRef = React.useRef();

  function handleMove(hexmove) {
    const move = game.move({
      from: hexToSan(hexmove.from.rank, hexmove.from.file),
      to: hexToSan(hexmove.to.rank, hexmove.to.file),
    });

    boardRef.current.setBoard(game.board());
    move.flags = move.san.includes("+") ? move.flags + "+" : move.flags;
    playSound(move.flags);
    if (move) {
      const goodMoves = getGoodMoves(currentNode);
      const node = goodMoves.find((e) => e.move === move.san);
      const moveRecommended = node ? true : false;

      if (moveRecommended) {
        setGame(game);
        setCurrentNode(node);

        boardRef.current.addHighlights({
          squares: [hexmove.from, hexmove.to],
          type: "lastMove",
        });
      } else {
        boardRef.current.addHighlights({
          squares: [hexmove.from, hexmove.to],
          type: "wrongMove",
        });
        setTimeout(() => {
          game.undo();
          boardRef.current.setBoard(game.board());
          boardRef.current.addHighlights({
            squares: [],
            type: "wrongMove",
          });
        }, 777);
      }
    }
  }

  function handleActivatingPiece({ rank, file }) {
    const sanFrom = hexToSan(rank, file);
    const isTurn = game.turn() === game.get(sanFrom)?.color;

    if (!isTurn) {
      return false;
    }

    const out = game.moves({ verbose: true, square: sanFrom }).map((m) => {
      const hex = algToHex(m.to);
      const type =
        m.flags.includes("c") || m.flags.includes("e")
          ? "capture-hint"
          : "hint";
      return { rank: hex[0], file: hex[1], type: type };
    });

    boardRef.current.addHighlights({
      squares: out,
      type: "legalMoves",
    });
  }

  function goToNode(node) {
    console.log("go to:", node);
    let path = [];
    const endNode = node;

    while (node.move) {
      path.push(node.move);
      node = node.parent;
    }
    console.log(path);
    const newGame = new Chess();
    while (path.length) {
      newGame.move(path.pop());
    }
    setGame(newGame);
    setCurrentNode(endNode);
    boardRef.current.setBoard(newGame.board());
  }

  function restartLine() {
    let node = currentNode;
    while (node.parent) {
      node = node.parent;
    }
    setCurrentNode(node);
    const newGame = new Chess();
    setGame(newGame);
    boardRef.current.setBoard(newGame.board());
  }

  function togglePgn() {
    setPgnVisible(pgnVisible ? false : true);
  }

  React.useEffect(() => {
    if (currentNode.nextMove === null) {
      return;
    }
    if (game.turn() !== opening.color[0]) {
      const goodMoves = getGoodMoves(currentNode);
      const node = goodMoves[Math.floor(Math.random() * goodMoves.length)];

      setTimeout(() => {
        const move = game.move(node.move);
        move.flags = move.san.includes("+") ? move.flags + "+" : move.flags;
        playSound(move.flags);
        setCurrentNode(node);
        setGame(game);
        boardRef.current.setBoard(game.board());
        const hexFrom = algToHex(move.from);
        const hexTo = algToHex(move.to);
        boardRef.current.addHighlights({
          squares: [
            { rank: hexFrom[0], file: hexFrom[1] },
            { rank: hexTo[0], file: hexTo[1] },
          ],
          type: "lastMove",
        });
      }, 777);
    }
  }, [game, opening, currentNode]);

  return (
    <div style={{ display: "flex", minWidth: "100vw" }}>
      <Sidebar></Sidebar>
      <div id="main">
        <div id="appgame">
          <Board
            ref={boardRef}
            onMakeMove={handleMove}
            onActivatePiece={handleActivatingPiece}
            initialOrientation={opening.color}
          ></Board>
        </div>

        <div className="flex-column" id="sidebox">
          <div id="video-container">
            {/* <iframe
              id="yt-player"
              src={"https://www.youtube.com/embed/" + opening.youtube}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe> */}
          </div>

          <div id={"opening-title"}>{opening.title}</div>

          <div id="sidebox-buttons">
            <button class="action-button" onClick={restartLine}>
              restart
            </button>
            <button class="action-button" onClick={togglePgn}>
              {pgnVisible ? "hide PGN" : "show PGN"}
            </button>
          </div>
          <PgnViewer
            tree={currentNode}
            currentNode={currentNode}
            goToNode={goToNode}
            style={{ display: pgnVisible ? "block" : "none" }}
          ></PgnViewer>
        </div>
      </div>
    </div>
  );
}

export default App;
