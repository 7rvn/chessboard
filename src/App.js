import * as React from "react";
import "./App.css";
import Chess from "chess.js";

import Board from "./components/Board";
import Sidebox from "./components/Sidebox";
import { getMoveObj, hexToSan, isLegal, sanToHexTo } from "./utils/helper";
import { constructPgnTree } from "./utils/pgnHelper";
import * as e6b6Json from "./pgns/e6b6.json";
import * as e4e5Json from "./pgns/e4e5.json";

const pgns = {
  e4e5: {
    title: "e4e5 New York Style",
    w: "user",
    b: "computer",
    orientation: "white",
    data: e4e5Json,
  },
  e6b6: {
    title: "e6b6 New York Style",
    w: "computer",
    b: "user",
    orientation: "black",
    data: e6b6Json,
  },
};

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
    currentNode: constructPgnTree(pgns["e4e5"].data.default["pgn1"].pgn),
  });

  const [settings, setSettings] = React.useState({
    w: "user",
    b: "computer",
    rootNode: state.currentNode,
    key: "pgn1",
    pgn: "e4e5",
  });

  /* Refs & Derived State */
  /* ************ */
  const boardRef = React.useRef();
  const sideboxRef = React.useRef();
  const currentNode = state.currentNode;

  /* Sidebar */
  /* ************ */
  function changePgn(pgn, key) {
    sideboxRef.current.reset();
    let tree = constructPgnTree(pgns[pgn].data.default[key].pgn);
    setState({ game: new Chess(), currentNode: tree });
    setSettings({
      ...settings,
      w: pgns[pgn].w,
      b: pgns[pgn].b,
      rootNode: tree,
      pgn: pgn,
      key: key,
    });
    boardRef.current.orientation(pgns[pgn].orientation);
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

  function restartPgn() {
    sideboxRef.current.reset();
    setState({ game: new Chess(), currentNode: settings.rootNode });
  }

  /* Board Handler */
  /* ************ */
  function handleDrag({ from, to }) {
    if (!state.currentNode.nextMove) {
      sideboxRef.current.toggleAlert(true);
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
      sideboxRef.current.toggleAlert(true);
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
        {Object.entries(pgns).map((entry) => {
          const [key, value] = entry;

          return (
            <div className={"sidebar-group"}>
              <div className={"sidebar-group-title"}>{value.title}</div>
              {Object.entries(value.data.default).map((e, index) => {
                return (
                  <button
                    className={
                      settings.key === e[0] && settings.pgn === key
                        ? "sidebar-button active"
                        : "sidebar-button"
                    }
                    onClick={() => changePgn(key, e[0])}
                    key={index + key}
                  >
                    {e[1].title}
                  </button>
                );
              })}
            </div>
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
        title={pgns[settings.pgn].title}
        restartFunction={restartPgn}
      ></Sidebox>
    </div>
  );
}

export default App;
