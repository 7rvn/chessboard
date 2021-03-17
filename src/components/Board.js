import * as React from "react";

import moveSelf from "../sounds/move-self.webm";
import promote from "../sounds/promote.webm";
import castle from "../sounds/castle.webm";
import capture from "../sounds/capture.webm";
import moveCheck from "../sounds/move-check.webm";

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

function playSound(flag) {
  if (flag.includes("p")) {
    new Audio(promote).play();
  } else if (flag.includes("+")) {
    new Audio(moveCheck).play();
  } else if (flag.includes("k") || flag.includes("q")) {
    new Audio(castle).play();
  } else if (flag.includes("c") || flag.includes("e")) {
    new Audio(capture).play();
  } else {
    new Audio(moveSelf).play();
  }
}

function getBoardPosition(e, board, orientation) {
  const factor = orientation === "white" ? 0 : 7;
  const x = ((e.clientX - board.offsetLeft) / board.offsetWidth) * 800;

  const y = ((e.clientY - board.offsetTop) / board.offsetHeight) * 800;

  const rank = Math.abs(~~(y / 100) - (7 - factor));
  const file = Math.abs(~~(x / 100) - factor);

  return { x: x, y: y, rank: rank, file: file };
}

const Board = React.forwardRef(({ clickHandler, appHandleDragStart }, ref) => {
  //console.log("render board");

  /* Ref functions*/
  /* ************ */
  React.useImperativeHandle(ref, () => ({
    setBoard(position) {
      setposition(constructPosition(position));
    },

    makeMove(move) {
      playSound(move.flags);
    },

    orientation(newOrientation) {
      if (newOrientation !== orientation) {
        setOrientation(newOrientation);
      }
    },
  }));

  /* States */
  /* ************ */
  const [position, setposition] = React.useState({});
  const [orientation, setOrientation] = React.useState("white");
  const [boardSize, setBoardSize] = React.useState(
    () => window.localStorage.getItem("boardSize") || 500
  );

  const [activeSquare, setActiveSquare] = React.useState();
  const [hoverSquare, setHoverSquare] = React.useState();
  const [legalSquares, setLegalSquares] = React.useState([]);

  const boardRef = React.useRef();

  const setNewPosition = React.useCallback(
    ({ from, to }) => {
      const fromString = from.rank.toString() + from.file.toString();
      const toString = to.rank.toString() + to.file.toString();
      const newPosition = { ...position };

      newPosition[fromString] = null;
      newPosition[toString] = position[fromString];
      return newPosition;
    },
    [position]
  );

  /* eventhandlers */
  /* ************ */
  const handleDragStart = React.useCallback(
    (e) => {
      if (e.button === 0) {
        const { x, y, rank, file } = getBoardPosition(
          e,
          boardRef.current,
          orientation
        );

        if (position[rank.toString() + file.toString()]) {
          setLegalSquares(appHandleDragStart({ rank: rank, file: file }));
          e.target.style.transform = `translate(${x - 50}%, ${y - 50}%)`;
          e.target.style.zIndex = 100;
          e.target.style.cursor = "grabbing";
          setActiveSquare({ div: e.target, hex: { rank: rank, file: file } });
          setHoverSquare({ rank: rank, file: file });
        }
      }
    },
    [appHandleDragStart, position, orientation]
  );

  const handleDrag = React.useCallback(
    (e) => {
      if (activeSquare) {
        const { x, y, rank, file } = getBoardPosition(
          e,
          boardRef.current,
          orientation
        );

        activeSquare.div.style.transform = `translate(${x - 50}%, ${y - 50}%)`;

        if (
          !hoverSquare ||
          hoverSquare.rank !== rank ||
          hoverSquare.file !== file
        ) {
          setHoverSquare({ rank: rank, file: file });
        }
      }
    },
    [activeSquare, hoverSquare, orientation]
  );

  const handleDragEnd = React.useCallback(
    (e) => {
      const { rank, file } = getBoardPosition(e, boardRef.current, orientation);

      if (activeSquare) {
        setActiveSquare();
        activeSquare.div.removeAttribute("style");
        // if drag ended on different square from where it started
        if (activeSquare.hex.rank !== rank || activeSquare.hex.file !== file) {
          let validMove = clickHandler({
            from: activeSquare.hex,
            to: { rank: rank, file: file },
          });

          setLegalSquares([]);
          setHoverSquare();
          if (!validMove) {
            return;
          }

          playSound(validMove.flags);

          setposition(
            setNewPosition({
              from: activeSquare.hex,
              to: { rank: rank, file: file },
            })
          );
        }
        // if drag ended on start square handle it like a click
      } else {
      }
    },
    [activeSquare, clickHandler, setNewPosition, orientation]
  );

  const handleKeyDown = React.useCallback(
    (e) => {
      if (e.key === "x") {
        if (orientation === "white") {
          setOrientation("black");
        } else {
          setOrientation("white");
        }
      }
    },
    [orientation]
  );

  const clickDefault = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  /* event listeners */
  /* ************ */
  React.useEffect(() => {
    let b = boardRef.current;
    b.addEventListener("mousedown", handleDragStart);
    b.addEventListener("mousemove", handleDrag);
    b.addEventListener("mouseup", handleDragEnd);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      b.removeEventListener("mousedown", handleDragStart);
      b.removeEventListener("mousemove", handleDrag);
      b.removeEventListener("mouseup", handleDragEnd);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleDragStart, handleDrag, handleDragEnd, handleKeyDown]);

  React.useEffect(() => {
    window.localStorage.setItem("boardSize", boardSize);
  }, [boardSize]);

  /* div constructors */
  /* ************ */
  let hoverSquareDiv;
  if (hoverSquare) {
    hoverSquareDiv = (
      <div
        className={`hover-square square-${hoverSquare.rank}${hoverSquare.file}`}
      ></div>
    );
  }

  let squareDivs = [];
  Object.entries(position).forEach((entry) => {
    let [square, piece] = entry;

    if (piece) {
      squareDivs.push(
        <div
          className={`piece ${piece.color + piece.type} square square-${
            square[0]
          }${square[1]}`}
          key={square}
        />
      );
    }
  });

  let resizeX;

  const initResize = (e) => {
    resizeX = e.clientX;

    document.addEventListener("mousemove", moveResize, false);
    document.addEventListener("mouseup", stopResize, false);
  };

  const moveResize = (e) => {
    setBoardSize(parseInt(boardSize) + (e.clientX - resizeX));
  };

  const stopResize = (e) => {
    document.removeEventListener("mousemove", moveResize, false);
    document.removeEventListener("mouseup", stopResize, false);
    console.log("done");
  };

  return (
    <div
      className={
        orientation === "white" ? "board-layout" : "flipped board-layout"
      }
    >
      <div
        className="board"
        id="board-board"
        style={{ width: boardSize + "px", height: boardSize + "px" }}
        ref={boardRef}
        onContextMenu={clickDefault}
      >
        {squareDivs}

        {legalSquares.map((square, index) => {
          return (
            <div className={`${""}hint square square-${square}`} key={index} />
          );
        })}

        {hoverSquareDiv}
      </div>
      <div className={"resizer"} onMouseDown={initResize}></div>
    </div>
  );
});

export default Board;
