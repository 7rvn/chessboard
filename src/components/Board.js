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

function getBoardPosition(e, board) {
  const x = ((e.clientX - board.offsetLeft) / board.offsetWidth) * 800;

  const y = ((e.clientY - board.offsetTop) / board.offsetHeight) * 800;

  const rank = Math.abs(~~(y / 100) - 7);
  const file = ~~(x / 100);

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
  }));

  /* States */
  /* ************ */
  const [position, setposition] = React.useState({});
  const [settings, setSettings] = React.useState({
    orientation: "white",
    size: 500,
  });

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
        const { x, y, rank, file } = getBoardPosition(e, boardRef.current);

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
    [appHandleDragStart, position]
  );

  const handleDrag = React.useCallback(
    (e) => {
      if (activeSquare) {
        const { x, y, rank, file } = getBoardPosition(e, boardRef.current);

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
    [activeSquare, hoverSquare]
  );

  const handleDragEnd = React.useCallback(
    (e) => {
      const { rank, file } = getBoardPosition(e, boardRef.current);

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
    [activeSquare, clickHandler, setNewPosition]
  );

  const handleKeyDown = React.useCallback(
    (e) => {
      if (e.key === "x") {
        if (settings.orientation === "white") {
          setSettings({ ...settings, orientation: "black" });
        } else {
          setSettings({ ...settings, orientation: "white" });
        }
      }
    },
    [settings]
  );

  const clickDefault = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  /* event listeners */
  /* ************ */
  React.useEffect(() => {
    document.addEventListener("mousedown", handleDragStart);
    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", handleDragEnd);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleDragStart);
      document.removeEventListener("mousemove", handleDrag);
      document.removeEventListener("mouseup", handleDragEnd);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleDragStart, handleDrag, handleDragEnd, handleKeyDown]);

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

  return (
    <div
      className={
        settings.orientation === "white"
          ? "board-layout"
          : "flipped board-layout"
      }
    >
      <div
        className="board"
        id="board-board"
        style={{ width: settings.size + "px", height: settings.size + "px" }}
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
    </div>
  );
});

export default Board;
