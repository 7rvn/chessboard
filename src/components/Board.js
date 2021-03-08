import * as React from "react";

import Square from "./Square";
import Highlight from "./Highlight";
import Hint from "./Hint";

import { algToHex } from "../utils/helper";

import moveSelf from "../sounds/move-self.webm";
import promote from "../sounds/promote.webm";
import castle from "../sounds/castle.webm";
import capture from "../sounds/capture.webm";
import EffectSquare from "./EffectSquare";

function animateMove({ moveFrom, moveTo, sound = null, boardOrientation }) {
  let factor = 0;
  if (boardOrientation === "black") {
    factor = 7;
  }
  const xStart = Math.abs(moveFrom[1] - factor) * 100;
  const yStart = Math.abs(moveFrom[0] - (7 - factor)) * 100;
  const xEnd = Math.abs(moveTo[1] - factor) * 100;
  const yEnd = Math.abs(moveTo[0] - (7 - factor)) * 100;

  const animationObj = {
    square: moveFrom,
    x: xStart,
    y: yStart,
    xs: (xStart - xEnd) / 20,
    ys: (yStart - yEnd) / 20,
    count: 0,
    sound: sound,
  };
  return animationObj;
}

function constructPosition(position) {
  let positionObj = {};
  position.forEach((rank, rankIndex) => {
    rank.forEach((square, fileIndex) => {
      positionObj[
        Math.abs(rankIndex - 7).toString() + fileIndex.toString()
      ] = square;
    });
  });
  return positionObj;
}

const Board = React.forwardRef(({ clickHandler }, ref) => {
  //console.log("render board");

  function makeMove(from, to) {
    const newPosition = { ...position };
    newPosition[from] = null;
    newPosition[to] = position[from];
    setAnimationSquares({
      from: from,
      fromPiece: position[from],
      to: to,
      toPiece: position[to],
    });
    setHighlights({
      ...highlights,
      lastMove: [from, to],
      activePiece: [],
      hints: [],
    });
    setLastClick(null);
    return newPosition;
  }

  React.useImperativeHandle(ref, () => ({
    setBoard(position) {
      setposition(constructPosition(position));
    },

    makeMove(moveObj) {
      const from = algToHex(moveObj.from);
      const to = algToHex(moveObj.to);
      setposition(makeMove(from, to));
      setAnimation(
        animateMove({
          moveFrom: from,
          moveTo: to,
          sound: moveObj.flags,
          boardOrientaion: settings.orientation,
        })
      );
    },

    hintSquares(squares) {
      let hints = [];
      squares.forEach((x) => {
        if (x.flags.includes("c") || x.flags.includes("e")) {
          hints.push([algToHex(x.to), "capture-"]);
        } else {
          hints.push([algToHex(x.to), ""]);
        }
      });

      setHighlights({ ...highlights, hints: hints });
    },

    alertEffect(square) {
      square = square ? algToHex(square) : null;
      setEffectSquare({ square: square, t: "illegal" });
    },
  }));

  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  const [animation, setAnimation] = React.useState();
  const [position, setposition] = React.useState({});

  const [lastClick, setLastClick] = React.useState(null);
  const [highlights, setHighlights] = React.useState({
    lastMove: [],
    activePiece: [],
    hints: [],
    markers: [],
  });
  const [effectSquare, setEffectSquare] = React.useState({
    square: null,
    flag: null,
  });

  const [animationSquares, setAnimationSquares] = React.useState({});

  const [settings, setSettings] = React.useState({ orientation: "white" });
  const boardLayout =
    settings.orientation === "white" ? "board-layout" : "flipped board-layout";
  const activePiece = highlights.activePiece;

  const handleKeyDown = (e) => {
    if (e.key === "x") {
      if (settings.orientation === "white") {
        setSettings({ ...settings, orientation: "black" });
      } else {
        setSettings({ ...settings, orientation: "white" });
      }
    }
  };

  function boardClick({ rank, file, e }) {
    e.preventDefault();

    const square = rank.toString() + file.toString();

    if (e.button === 2) {
      const newMarkers = [...highlights.markers];
      const index = newMarkers.indexOf(square);

      if (index > -1) {
        newMarkers.splice(index, 1);
      } else {
        newMarkers.push(square);
      }

      if (activePiece) {
        setHighlights({ ...highlights, activePiece: [] });
      }
      setHighlights({ ...highlights, markers: newMarkers });
    } else if (e.button === 0) {
      if (highlights.length) {
        setHighlights([]);
      }
      if (activePiece[0] !== rank + file) {
        if (position[rank + file]) {
          setHighlights({ ...highlights, activePiece: [rank + file] });
        } else {
          setHighlights({ ...highlights, activePiece: [] });
        }
      } else {
        setHighlights({ ...highlights, activePiece: [] });
      }

      let doit = clickHandler({ rank, file });
      if (!doit) {
        setLastClick(square);
        return;
      }

      if (position[lastClick] && lastClick !== square) {
        setAnimation(
          animateMove({
            moveFrom: lastClick,
            moveTo: square,
            boardOrientation: settings.orientation,
            sound: doit.flags,
          })
        );
        setposition(makeMove(lastClick, square));
      }
    }
  }

  React.useEffect(() => {
    let interval;
    if (animation) {
      if (animation.count < 20) {
        interval = setTimeout(() => {
          setAnimation({
            ...animation,
            x: animation.x - animation.xs,
            y: animation.y - animation.ys,
            count: animation.count + 1,
          });
        }, 2);
      } else {
        if (animation.sound) {
          if (animation.sound.includes("p")) {
            new Audio(promote).play();
          } else if (
            animation.sound.includes("k") ||
            animation.sound.includes("q")
          ) {
            new Audio(castle).play();
          } else if (
            animation.sound.includes("c") ||
            animation.sound.includes("e")
          ) {
            new Audio(capture).play();
          } else {
            new Audio(moveSelf).play();
          }
        }
        setAnimation();
        setAnimationSquares();
      }
    }
    return () => clearInterval(interval);
  }, [animation]);

  let squares = [];
  Object.entries(position).forEach((entry) => {
    let [square, piece] = entry;

    let style = null;
    if (animation) {
      if (square === animation.square) {
        style = {
          transform: `translate(${animation.x}%, ${animation.y}%)`,
        };
      }
      if (square === animationSquares.to) {
        piece = null;
      }
      if (square === animationSquares.from) {
        piece = animationSquares.fromPiece;
      }
    }

    squares.push(
      <Square
        piece={piece}
        rank={square[0]}
        file={square[1]}
        key={square.toString()}
        boardClick={boardClick}
        style={style}
      />
    );
  });

  let effectSquareItem = null;
  if (effectSquare.square) {
    effectSquareItem = (
      <EffectSquare
        square={effectSquare.square}
        flag={effectSquare.flag}
      ></EffectSquare>
    );
  }

  return (
    <div className={boardLayout} style={{ width: "650px", height: "650px" }}>
      <div className="board" id="board-board">
        {squares}

        {highlights.markers.map((square) => {
          return (
            <Highlight
              square={square}
              key={square}
              style={{ backgroundColor: "rgb(235, 97, 80)", opacity: "0.8" }}
            />
          );
        })}

        {highlights.lastMove.map((square) => {
          return (
            <Highlight
              square={square}
              key={square}
              style={{ backgroundColor: "rgb(255, 255, 0)", opacity: "0.5" }}
            />
          );
        })}

        {highlights.activePiece.map((square) => {
          return (
            <Highlight
              square={square}
              key={square}
              style={{ backgroundColor: "rgb(255, 255, 0)", opacity: "0.5" }}
            />
          );
        })}

        {highlights.hints.map((hint) => {
          return <Hint square={hint[0]} flag={hint[1]} key={hint[0]} />;
        })}

        {effectSquareItem}
      </div>
    </div>
  );
});

export default Board;
