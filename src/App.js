import * as React from "react";
import "./App.css";
import Chess from "chess.js";

import Board from "./components/Board";
import SideboxItem from "./components/Sidebox";
import { getMoveObj, hexToSan, isLegal, sanToHexTo } from "./utils/helper";
import { constructPgnTree } from "./utils/pgnHelper";
import * as data from "./utils/data.json";

function App() {
  //console.log("render app");

  /* States */
  /* ************ */
  const [game, setGame] = React.useState(new Chess());
  const [currentNode, setCurrentNode] = React.useState(
    constructPgnTree(data.default.pgn1.pgn)
  );
  const [settings, setSettings] = React.useState({
    w: "user",
    b: "user",
    title: "1. e4 e5, Vienna Gambit",
    rootNode: currentNode,
    sidebox: "pgn-view",
  });

  const boardRef = React.useRef();
  const sideRef = React.useRef();

  // const turn = game.turn();

  // function validateMove(props) {
  //   let move = isLegal(game.moves({ verbose: true }));

  //   // if move is legal
  //   if (move) {
  //     if (move.san.includes("+")) {
  //       move.flags = move.flags + "+";
  //     }
  //     // recommended moves from pgn
  //     const goodMoves = [currentNode.nextMove];
  //     if (currentNode.variation) {
  //       currentNode.variation.forEach((element) => {
  //         goodMoves.push(element);
  //       });
  //     }

  //     const found = goodMoves.find((e) => e.move === move.san);
  //     // if move is in recommended
  //     if (found) {
  //       // execute move
  //       let newGame = { ...game };
  //       newGame.move(move.san);
  //       setCurrentNode(found);

  //       setGame(newGame);

  //       return move;

  //       // if move is not recommended
  //     } else {
  //     }

  //     // if move is illegal
  //   } else {
  //   }
  // }

  function changePgn(pgn) {
    let tree = constructPgnTree(data.default[pgn].pgn);
    setCurrentNode(tree);
    setGame(new Chess());
    setSettings({
      ...settings,
      w: "user",
      b: "computer",
      title: data.default[pgn].title,
      rootNode: tree,
    });
  }

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

  function handleDrag({ from, to }) {
    let fromSan = hexToSan(from.rank, from.file);
    let toSan = hexToSan(to.rank, to.file);
    let move = isLegal(game.moves({ verbose: true }), fromSan, toSan);
    // console.log(move.san);
    if (move) {
      let newGame = { ...game };
      newGame.move(move.san);
      setGame(newGame);
      return move;
    }
  }

  function handleDragStart({ rank, file }) {
    const san = hexToSan(rank, file);
    let legalMoves = game.moves({ square: san, verbose: true });
    return sanToHexTo(legalMoves.map((x) => x.to));
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
