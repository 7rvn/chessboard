import * as React from "react";

import { Square, pieces, chessjsBoardToPositionObj } from "../utils/utils";
import initialPositionObj from "../utils/initialPosition";

function getBoardPosition(e, board, orientation) {
  const factor = orientation === "white" ? 0 : 7;
  const x = ((e.clientX - board.offsetLeft) / board.offsetWidth) * 800;

  const y = ((e.clientY - board.offsetTop) / board.offsetHeight) * 800;

  const rank = Math.abs(~~(y / 100) - (7 - factor));
  const file = Math.abs(~~(x / 100) - factor);

  return { x: x, y: y, rank: rank, file: file };
}

const Board = React.forwardRef(
  (
    {
      initialPosition,
      initialOrientation = "white",
      onMakeMove,
      onActivatePiece,
    },
    ref
  ) => {
    React.useImperativeHandle(ref, () => ({
      /**
       * sets board state
       * @param {Object} position chessjs game.board() position
       */
      setBoard(position) {
        setPosition(chessjsBoardToPositionObj(position));
      },

      /**
       * executes moves on the board and returns new position
       * @param {[string, string][]} moves as array of hex values [from, to]
       * @param {boolean} [animate] if moves have to be animated or instantly change the board
       */
      move(moves, animate = false) {
        if (animate) {
        } else {
        }
      },

      /**
       * Sets boards orientation
       * @param {string} newOrientation "black"|| "white"
       */
      orientation(newOrientation) {
        if (newOrientation !== orientation) {
          setOrientation(newOrientation);
        }
      },

      addHighlights({ squares, type }) {
        if (type === "legalMoves") {
          setLegalMoves(squares);
        }
      },
    }));

    const [position, setPosition] = React.useState(() => {
      if (initialPosition) {
        chessjsBoardToPositionObj(initialPosition);
      } else {
        return initialPositionObj;
      }
    });

    const [orientation, setOrientation] = React.useState(initialOrientation);
    const [boardSize, setBoardSize] = React.useState(
      () => window.localStorage.getItem("boardSize") || 500
    );

    const [activeSquare, setActiveSquare] = React.useState();
    const [hoverSquare, setHoverSquare] = React.useState();
    const [legalMoves, setLegalMoves] = React.useState();

    const boardRef = React.useRef();

    /**
     * updates position state
     * @param  from Object with .rank and .file as numbers
     * @param  to Object with .rank and .file as numbers
     */
    const updatePosition = React.useCallback(
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

    const makeMove = React.useCallback(
      ({ from, to, animate = false }) => {
        if (onMakeMove) {
          onMakeMove({
            from: from,
            to: to,
          });
        } else {
          updatePosition({
            from: from,
            to: to,
          });
        }

        setActiveSquare();
        setLegalMoves();
      },
      [onMakeMove, updatePosition]
    );

    /* eventhandlers */
    /* ************ */
    const handleMouseDown = React.useCallback(
      (e) => {
        if (e.button === 0) {
          const { x, y, rank, file } = getBoardPosition(
            e,
            boardRef.current,
            orientation
          );

          const clicked =
            activeSquare?.hex.rank === rank && activeSquare?.hex.file === file
              ? true
              : false;

          if (
            activeSquare &&
            (activeSquare.hex.rank !== rank || activeSquare.hex.file !== file)
          ) {
            makeMove({
              from: activeSquare.hex,
              to: { rank: rank, file: file },
              animate: true,
            });
          }

          if (
            position[rank.toString() + file.toString()] &&
            (!activeSquare || clicked)
          ) {
            e.target.style.transform = `translate(${x - 50}%, ${y - 50}%)`;
            e.target.style.zIndex = 100;
            e.target.style.cursor = "grabbing";
            setActiveSquare({
              div: e.target,
              hex: { rank: rank, file: file },
              clicked: clicked,
              dragging: true,
            });
            setHoverSquare({ rank: rank, file: file });

            if (onActivatePiece && !clicked) {
              onActivatePiece({ rank: rank, file: file });
            }
          }
        }
      },
      [orientation, activeSquare, position, makeMove, onActivatePiece]
    );

    const handleMouseMove = React.useCallback(
      (e) => {
        if (activeSquare?.dragging) {
          const { x, y, rank, file } = getBoardPosition(
            e,
            boardRef.current,
            orientation
          );

          activeSquare.div.style.transform = `translate(${x - 50}%, ${
            y - 50
          }%)`;

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

    const handleMouseUp = React.useCallback(
      (e) => {
        const { rank, file } = getBoardPosition(
          e,
          boardRef.current,
          orientation
        );
        if (!activeSquare) {
          return;
        }
        setHoverSquare();

        if (activeSquare.hex.rank === rank && activeSquare.hex.file === file) {
          activeSquare.div.removeAttribute("style");
          if (activeSquare.clicked) {
            setActiveSquare();
            setLegalMoves();
          } else {
            setActiveSquare({ ...activeSquare, dragging: false });
          }
        } else {
          activeSquare.div.removeAttribute("style");
          makeMove({
            from: activeSquare.hex,
            to: { rank: rank, file: file },
          });
        }
      },
      [activeSquare, makeMove, orientation]
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
      b.addEventListener("mousedown", handleMouseDown);
      b.addEventListener("mousemove", handleMouseMove);
      b.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        b.removeEventListener("mousedown", handleMouseDown);
        b.removeEventListener("mousemove", handleMouseMove);
        b.removeEventListener("mouseup", handleMouseUp);
        window.removeEventListener("keydown", handleKeyDown);
      };
    }, [handleMouseDown, handleMouseMove, handleMouseUp, handleKeyDown]);

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

          {legalMoves?.map((square) => {
            return (
              <Square
                type={square.type}
                square={square.rank.toString() + square.file.toString()}
                key={square.rank.toString() + square.file.toString()}
              ></Square>
            );
          })}
        </div>
        <div className={"resizer"} onMouseDown={initResize}></div>
      </div>
    );
  }
);

export default Board;
