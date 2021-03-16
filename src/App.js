import * as React from "react";
import "./App.css";
import Chess from "chess.js";

import Board from "./components/Board";
import Sidebox from "./components/Sidebox";
import { getMoveObj, hexToSan, isLegal, sanToHexTo } from "./utils/helper";
import { constructPgnTree } from "./utils/pgnHelper";
import * as data from "./utils/data.json";

function getGoodMoves(node) {
  const goodMoves = [node.nextMove];
  if (node.variation) {
    node.variation.forEach((element) => {
      goodMoves.push(element);
    });
  }
  return goodMoves;
}

function App() {
  // console.log("render app");

  /* States */
  /* ************ */
  const [state, setState] = React.useState({
    game: new Chess(),
    currentNode: constructPgnTree(data.default.pgn1.pgn),
  });

  const [settings, setSettings] = React.useState({
    w: "user",
    b: "computer",
    title: "1. e4 e5, Vienna Gambit",
    rootNode: state.currentNode.nextMove,
    pgn: "pgn1",
  });

  /* Refs & Derived State */
  /* ************ */
  const boardRef = React.useRef();
  const sideboxRef = React.useRef();
  const currentNode = state.currentNode;

  /* Sidebar */
  /* ************ */
  function changePgn(pgn) {
    let tree = constructPgnTree(data.default[pgn].pgn);
    setState({ game: new Chess(), currentNode: tree });
    setSettings({
      ...settings,
      w: "user",
      b: "computer",
      title: data.default[pgn].title,
      rootNode: tree,
      pgn: pgn,
    });
  }

  /* Sidebox */
  /* ************ */
  function constructPgnDivs(node, layer = 0) {
    let out = [];
    let style = "";
    while (node.nextMove) {
      let start = out.length ? "" : "(";
      if (node === currentNode.nextMove) {
        style = " next-move";
      } else if (
        node === currentNode.nextMove ||
        currentNode.variation.includes(node)
      ) {
        style = " next-move";
      } else if (node === currentNode) {
        style = " current-move";
      } else {
        style = "";
      }
      let cnode = node;

      out.push(
        <button
          className={"pgn-move" + style}
          key={node.id}
          onClick={() => goToNode(cnode)}
        >
          {start}
          {node.move}
        </button>
      );
      if (node.variation.length) {
        for (let i = 0; i < node.variation.length; i++) {
          out.push(
            <div
              className={"variation-layer-" + (layer + 1)}
              key={node.id + " " + layer + i}
            >
              {constructPgnDivs(node.variation[i], layer + 1)}
            </div>
          );
          out.push(
            <div
              className={"flex-break"}
              key={node.id + " " + layer + i + "flex"}
            ></div>
          );
        }
      }

      node = node.nextMove;
    }

    out.push(
      <button
        className={"pgn-move" + style}
        key={node.id}
        onClick={() => goToNode(node)}
      >
        {node.move} {")"}
      </button>
    );
    return out;
  }

  function goToNode(node, skipPc) {
    sideboxRef.current.reset();
    let path = [];
    const endNode = node;

    while (node.move) {
      path.push(node.move);
      node = node.parent;
    }
    let game = new Chess();
    while (path.length) {
      game.move(path.pop());
    }
    setState({ game: game, currentNode: endNode, skipPc: skipPc });
  }

  /* Board Handler */
  /* ************ */
  function handleDrag({ from, to }) {
    if (!state.currentNode.nextMove) {
      return;
    }
    let fromSan = hexToSan(from.rank, from.file);
    let toSan = hexToSan(to.rank, to.file);
    let move = isLegal(state.game.moves({ verbose: true }), fromSan, toSan);

    if (move) {
      const goodMoves = getGoodMoves(currentNode);
      const node = goodMoves.find((e) => e.move === move.san);

      if (node) {
        if (node.comment) {
          sideboxRef.current.addItem({ title: node.move, body: node.comment });
        }
        let newGame = { ...state.game };
        newGame.move(move.san);
        setState({ game: newGame, currentNode: node });
        return move;
      }
    }
  }

  function handleDragStart({ rank, file }) {
    const san = hexToSan(rank, file);
    let legalMoves = state.game.moves({ square: san, verbose: true });
    return sanToHexTo(legalMoves.map((x) => x.to));
  }

  const handleKeyDown = React.useCallback(
    (e) => {
      if (e.key === "ArrowLeft") {
        if (currentNode.parent) {
          goToNode(currentNode.parent, true);
        }
      } else if (e.key === "ArrowRight") {
        if (currentNode.nextMove) {
          goToNode(currentNode.nextMove);
        }
      }
    },
    [currentNode]
  );

  /* event listeners */
  /* ************ */
  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  /* Computer Moves */
  /* ************ */

  React.useEffect(() => {
    boardRef.current.setBoard(state.game.board());
    if (state.currentNode.nextMove === null) {
      sideboxRef.current.toggleAlert("yessa");
    }

    if (state.skipPc !== true) {
      if (
        settings[state.game.turn()] === "computer" &&
        state.currentNode.nextMove != null
      ) {
        const goodMoves = getGoodMoves(state.currentNode);
        const node = goodMoves[Math.floor(Math.random() * goodMoves.length)];

        let move = getMoveObj(state.game.moves({ verbose: true }), node.move);

        setTimeout(() => {
          if (node.comment) {
            sideboxRef.current.addItem({
              title: node.move,
              body: node.comment,
            });
          }
          let newGame = { ...state.game };
          newGame.move(move);
          boardRef.current.makeMove(move);
          setState({ game: newGame, currentNode: node });
        }, 500);
      }
    }
  }, [state, settings, boardRef]);

  const pgnview = constructPgnDivs(settings.rootNode);

  return (
    <div id="main">
      <div className={"sidebar"}>
        {Object.entries(data.default).map((e, index) => {
          return (
            <button
              className={
                settings.pgn === e[0]
                  ? "sidebar-button active"
                  : "sidebar-button"
              }
              onClick={() => changePgn(e[0])}
              key={index}
            >
              {e[1].title}
            </button>
          );
        })}
      </div>

      <div id="appgame">
        <Board
          clickHandler={handleDrag}
          appHandleDragStart={handleDragStart}
          ref={boardRef}
        ></Board>
      </div>
      <Sidebox
        ref={sideboxRef}
        pgnview={pgnview}
        title={settings.title}
      ></Sidebox>
    </div>
  );
}

export default App;
