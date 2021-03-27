import * as React from "react";

import { Square, playSound, pieces } from "../utils/utils";

// converts chess.js board representation to
// array with string keys of rank+file
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

// returns x, y position of mouse inside board div
// returns rank, file of mouse on the board
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
    // sets position state
    setBoard(position) {
      setPosition(constructPosition(position));
    },

    // makes move sound
    makeMove(move) {
      playSound(move.flags);
    },

    // sets board orientation state
    orientation(newOrientation) {
      if (newOrientation !== orientation) {
        setOrientation(newOrientation);
      }
    },

    snapback() {
      console.log("takeitback");
    },
  }));

  /* States */
  /* ************ */
  const [position, setPosition] = React.useState({});
  const [orientation, setOrientation] = React.useState("white");
  const [boardSize, setBoardSize] = React.useState(
    () => window.localStorage.getItem("boardSize") || 500
  );

  const [activeSquare, setActiveSquare] = React.useState();
  const [hoverSquare, setHoverSquare] = React.useState();
  const [legalSquares, setLegalSquares] = React.useState([]);
  const [highlightSquares, setHighlightSquare] = React.useState({});

  const boardRef = React.useRef();

  // sets position state calcuted from move made
  const setNewPosition = React.useCallback(
    ({ from, to }) => {
      const fromString = from.rank.toString() + from.file.toString();
      const toString = to.rank.toString() + to.file.toString();
      const newPosition = { ...position };

      newPosition[fromString] = null;
      newPosition[toString] = position[fromString];
      setPosition(newPosition);
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
          let [validMove, moveAction] = clickHandler({
            from: activeSquare.hex,
            to: { rank: rank, file: file },
          });

          setLegalSquares([]);
          setHoverSquare();
          if (!validMove) {
            return;
          }

          if (moveAction) {
            setHighlightSquare({
              ...highlightSquares,
              [activeSquare.hex.rank.toString() +
              activeSquare.hex.file.toString()]: "wrong-move",
              [rank.toString() + file.toString()]: "wrong-move",
            });
            setTimeout(function () {
              setHighlightSquare({ ...highlightSquares });
              setPosition(position);
            }, 1500);
          }

          playSound(validMove.flags);

          setNewPosition({
            from: activeSquare.hex,
            to: { rank: rank, file: file },
          });
        }
        // if drag ended on start square handle it like a click
      } else {
      }
    },
    [
      activeSquare,
      clickHandler,
      setNewPosition,
      orientation,
      position,
      highlightSquares,
    ]
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
    const b = boardRef.current;
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
        {pieces(position)}

        {legalSquares.map((square) => {
          return (
            <Square
              type={
                square[1].includes("c") || square[1].includes("e")
                  ? "capture-hint"
                  : "hint"
              }
              square={square[0]}
              key={square}
            />
          );
        })}

        {hoverSquare ? (
          <Square
            type={"hover-square"}
            square={hoverSquare.rank.toString() + hoverSquare.file.toString()}
          ></Square>
        ) : null}

        {activeSquare ? (
          <Square
            type={"highlight"}
            square={
              activeSquare.hex.rank.toString() +
              activeSquare.hex.file.toString()
            }
            style={{ backgroundColor: "rgba(255, 255, 0)" }}
          ></Square>
        ) : null}

        {Object.entries(highlightSquares).map((entry) => {
          let [square, flag] = entry;
          return <Square type={"highlight " + flag} square={square}></Square>;
        })}
      </div>
      <div className={"resizer"} onMouseDown={initResize}></div>
    </div>
  );
});

export default Board;
