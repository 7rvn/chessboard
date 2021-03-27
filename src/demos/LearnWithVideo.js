import * as React from "react";
import "../App.css";
import "../css/learnwithvideo.css";
import Chess from "chess.js";

import { playSound } from "../utils/utils";
import { constructPgnTree, getGoodMoves } from "../utils/pgnHelper";
import { hexToSan } from "../utils/helper";
import Board from "../components/Board";
import PgnViewer from "../components/PgnViewer";
import openings from "../pgns/youtube";

function App() {
  const opening = openings["A45"];
  /* States */
  /* ************ */
  const [game, setGame] = React.useState(new Chess());
  const [currentNode, setCurrentNode] = React.useState(
    constructPgnTree(opening.pgn)
  );

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
      } else {
        setTimeout(() => {
          game.undo();
          boardRef.current.setBoard(game.board());
        }, 777);
      }
    }
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
      }, 777);
    }
  }, [game, opening, currentNode]);

  return (
    <div id="main">
      <div id="appgame">
        <Board ref={boardRef} onMakeMove={handleMove}></Board>
      </div>
      <div>
        <div className="flex-column">
          <iframe
            id="yt-player"
            src={"https://www.youtube.com/embed/" + opening.youtube}
            style={{ height: "35vh", width: "calc(35vh*(16/9))" }}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>

          <div id={"opening-title"}>{opening.title}</div>
          <PgnViewer
            tree={currentNode}
            currentNode={currentNode}
            goToNode={goToNode}
          ></PgnViewer>
        </div>
      </div>
    </div>
  );
}

export default App;
