import * as React from "react";
import "./App.css";
import Chess from "chess.js";

import Board from "./components/Board";
import SideboxItem from "./components/Sidebox";
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
    rootNode: state.currentNode,
    sidebox: "pgn-view",
  });

  /* Refs & Derived State */
  /* ************ */
  const boardRef = React.useRef();
  const sideRef = React.useRef();
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
    });
  }

  /* Sidebox */
  /* ************ */
  function constructPgnDivs(node, layer = 0) {
    let out = [];
    let style = "";
    while (node.nextMove) {
      if (node === currentNode) {
        style = " current-move";
      } else if (
        node === currentNode.nextMove ||
        currentNode.variation.includes(node)
      ) {
        style = " next-move";
      } else {
        style = "";
      }

      out.push(
        <button className={"pgn-move" + style} key={node.id}>
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
              {"("}
              {constructPgnDivs(node.variation[i], layer + 1)}
              {")"}
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
      <button className={"pgn-move" + style} key={node.id}>
        {node.move}
      </button>
    );
    return out;
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

  /* Computer Moves */
  /* ************ */
  React.useEffect(() => {
    if (state.currentNode.nextMove === null) {
      sideRef.current.toggleAlert("yessa");
    }

    boardRef.current.setBoard(state.game.board());
    if (
      settings[state.game.turn()] === "computer" &&
      state.currentNode.nextMove != null
    ) {
      const goodMoves = getGoodMoves(state.currentNode);
      const node = goodMoves[Math.floor(Math.random() * goodMoves.length)];

      let move = getMoveObj(state.game.moves({ verbose: true }), node.move);

      setTimeout(() => {
        let newGame = { ...state.game };
        newGame.move(move);
        setState({ game: newGame, currentNode: node });
      }, 500);
    }
  }, [state, settings]);

  const pgnview = constructPgnDivs(settings.rootNode);

  return (
    <div id="main">
      <div className={"sidebar"}>
        {Object.entries(data.default).map((e, index) => {
          return (
            <button
              className={"sidebar-button"}
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
      <SideboxItem
        ref={sideRef}
        move={currentNode.move}
        comment={currentNode.comment}
        pgnview={pgnview}
        title={settings.title}
      ></SideboxItem>
    </div>
  );
}

export default App;
