import * as React from "react";

import Square from "./Square";
import Highlight from "./Highlight";
import { algToHex } from "../utils/helper";

import moveSelf from "../sounds/move-self.webm";
import Hint from "./Hint";

function animateMove(moveFrom, moveTo, sound) {
  //console.log("executing:", moveFrom, moveTo);

  const xStart = moveFrom[1] * 100;
  const yStart = Math.abs(moveFrom[0] - 7) * 100;
  const xEnd = moveTo[1] * 100;
  const yEnd = Math.abs(moveTo[0] - 7) * 100;

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

function constructPositionObj(position) {
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
    const newPosition = { ...positionObj };
    newPosition[from] = null;
    newPosition[to] = positionObj[from];
    setAnimationSquares({
      from: from,
      fromPiece: positionObj[from],
      to: to,
      toPiece: positionObj[to],
    });
    setLastMove([from, to]);
    setLastClick(null);
    setActivePiece([]);
    setHighlightSquares([]);
    return newPosition;
  }

  React.useImperativeHandle(ref, () => ({
    setBoard(prop) {
      setPositionObj(constructPositionObj(prop));
    },
    makeDo(prop) {
      const from = algToHex(prop.from);
      const to = algToHex(prop.to);
      setPositionObj(makeMove(from, to));
      setAnimation(animateMove(from, to, prop.flags));
    },
    highlightSquares(prop) {
      console.log("highlight this: ", prop);
      setHighlightSquares(prop);
    },
  }));

  const getInitialPosition = () => constructPositionObj([]);
  const [animation, setAnimation] = React.useState();
  const [positionObj, setPositionObj] = React.useState(getInitialPosition);

  const [lastClick, setLastClick] = React.useState(null);

  const [highlights, setHighlights] = React.useState([]);
  const [lastMove, setLastMove] = React.useState([]);
  const [activePiece, setActivePiece] = React.useState([]);
  const [highlightSquares, setHighlightSquares] = React.useState([]);

  const [animationSquares, setAnimationSquares] = React.useState({});

  function boardClick({ rank, file, e }) {
    e.preventDefault();

    console.log("clicked on:", e.target);

    const square = rank.toString() + file.toString();

    if (e.button === 2) {
      const copyHighlights = [...highlights];
      const index = copyHighlights.indexOf(square);

      if (index > -1) {
        copyHighlights.splice(index, 1);
      } else {
        copyHighlights.push(square);
      }

      if (activePiece) {
        setActivePiece([]);
      }
      setHighlights(copyHighlights);
    } else if (e.button === 0) {
      if (highlights.length) {
        setHighlights([]);
      }
      if (activePiece[0] !== rank + file) {
        if (positionObj[rank + file]) {
          setActivePiece([rank + file]);
        } else {
          setActivePiece([]);
        }
      } else {
        setActivePiece([]);
      }

      let doit = clickHandler({ rank, file });
      if (!doit) {
        setLastClick(square);
        return;
      }
      console.log("board trying to move", lastClick, square);

      // if last click is a piece and not the same square
      if (positionObj[lastClick] && lastClick !== square) {
        setAnimation(animateMove(lastClick, square));
        setPositionObj(makeMove(lastClick, square));
      }
    }
  }

  React.useEffect(() => {
    if (animation) {
      if (animation.count < 20) {
        const interval = setTimeout(() => {
          setAnimation({
            x: animation.x - animation.xs,
            y: animation.y - animation.ys,
            xs: animation.xs,
            ys: animation.ys,
            square: animation.square,
            count: animation.count + 1,
            sound: animation.sound,
          });
        }, 2);
        return () => clearInterval(interval);
      } else {
        if (animation.sound) {
          let audio = new Audio(moveSelf);
          audio.play();
        }
        setAnimation();
        setAnimationSquares();
      }
    }
  }, [animation]);

  let squares = [];
  Object.entries(positionObj).forEach((entry) => {
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

  return (
    <div className="board-layout" style={{ width: "650px", height: "650px" }}>
      <div className="board" id="board-board">
        {squares}

        {highlights.map((square) => {
          return (
            <Highlight
              square={square}
              key={square}
              style={{ backgroundColor: "rgb(235, 97, 80)", opacity: "0.8" }}
              boardClick={boardClick}
            />
          );
        })}

        {lastMove.map((square) => {
          return (
            <Highlight
              square={square}
              key={square}
              style={{ backgroundColor: "rgb(255, 255, 0)", opacity: "0.5" }}
            />
          );
        })}

        {activePiece.map((square) => {
          return (
            <Highlight
              square={square}
              key={square}
              style={{ backgroundColor: "rgb(255, 255, 0)", opacity: "0.5" }}
            />
          );
        })}

        {highlightSquares.map((square) => {
          return <Hint square={square} key={square + "high"} />;
        })}
      </div>
    </div>
  );
});

export default Board;
