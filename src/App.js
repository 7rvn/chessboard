import * as React from "react";
import "./App.css";
import Chess from "chess.js";

function Board() {
  function squareToVerbose(square) {
    return (
      String.fromCharCode(97 + parseInt(square[1])) +
      (parseInt(square[0]) + 1).toString()
    );
  }

  function verboseToSquares(verboseList) {
    return verboseList.map(
      (x) => (parseInt(x[1]) - 1).toString() + (x.charCodeAt(0) - 97).toString()
    );
  }
  const game = new Chess();
  // console.log(game.moves({ square: squareToVerbose("41") }));
  // console.log(squareToVerbose("41"));
  function highlightActivePiece() {
    if (!activePiece) {
      return;
    }
    return (
      <Highlight square={activePiece} key={activePiece} color={"yellow"} />
    );
  }

  function clickSquare(e, square, type) {
    e.preventDefault();
    // if left click highlight
    if (e.button === 2) {
      setActivePiece("");
      setLegalMoves([]);
      const copyHighlights = [...highlights];
      const index = copyHighlights.indexOf(square);

      if (index > -1) {
        copyHighlights.splice(index, 1);
      } else {
        copyHighlights.push(square);
      }
      setHighlights(copyHighlights);
    } else {
      setHighlights([]);
      // if clicked on active piece
      if (activePiece === square) {
        setLegalMoves([]);
        setActivePiece("");
      } else {
        //console.log(square);
        // if square a apice
        if (type != null) {
          setActivePiece(square);
          const gosquare = squareToVerbose(square);
          const moves = game.moves({ square: gosquare });
          verboseToSquares(moves);
          setLegalMoves(verboseToSquares(moves));
        } else {
          // if a piece is active

          if (activePiece) {
            const gosquare = squareToVerbose(square);
            const activeSquare = squareToVerbose(activePiece);
            const moves = game.moves({ square: activeSquare });
            console.log(gosquare);
            console.log(moves);
            //if square legal mvoe
            if (moves.includes(gosquare)) {
              console.log("moooooove");
            } else {
              setLegalMoves([]);
              setActivePiece("");
            }
          }
        }
      }
    }
  }

  const defaultBoard = [
    { square: "00", value: "wr" },
    { square: "01", value: "wn" },
    { square: "02", value: "wb" },
    { square: "03", value: "wq" },
    { square: "04", value: "wk" },
    { square: "05", value: "wb" },
    { square: "06", value: "wn" },
    { square: "07", value: "wr" },
    { square: "10", value: "wp" },
    { square: "11", value: "wp" },
    { square: "12", value: "wp" },
    { square: "13", value: "wp" },
    { square: "14", value: "wp" },
    { square: "15", value: "wp" },
    { square: "16", value: "wp" },
    { square: "17", value: "wp" },
    { square: "20", value: null },
    { square: "21", value: null },
    { square: "22", value: null },
    { square: "23", value: null },
    { square: "24", value: null },
    { square: "25", value: null },
    { square: "26", value: null },
    { square: "27", value: null },
    { square: "30", value: null },
    { square: "31", value: null },
    { square: "32", value: null },
    { square: "33", value: null },
    { square: "34", value: null },
    { square: "35", value: null },
    { square: "36", value: null },
    { square: "37", value: null },
    { square: "40", value: null },
    { square: "41", value: null },
    { square: "42", value: null },
    { square: "43", value: null },
    { square: "44", value: null },
    { square: "45", value: null },
    { square: "46", value: null },
    { square: "47", value: null },
    { square: "50", value: null },
    { square: "51", value: null },
    { square: "52", value: null },
    { square: "53", value: null },
    { square: "54", value: null },
    { square: "55", value: null },
    { square: "56", value: null },
    { square: "57", value: null },
    { square: "60", value: "bp" },
    { square: "61", value: "bp" },
    { square: "62", value: "bp" },
    { square: "63", value: "bp" },
    { square: "64", value: "bp" },
    { square: "65", value: "bp" },
    { square: "66", value: "bp" },
    { square: "67", value: "bp" },
    { square: "70", value: "br" },
    { square: "71", value: "bn" },
    { square: "72", value: "bb" },
    { square: "73", value: "bq" },
    { square: "74", value: "bk" },
    { square: "75", value: "bb" },
    { square: "76", value: "bk" },
    { square: "77", value: "br" },
  ];
  const [boardState, setBoardState] = React.useState(defaultBoard);
  const [highlights, setHighlights] = React.useState([]);
  const [activePiece, setActivePiece] = React.useState("");
  const [legalMoves, setLegalMoves] = React.useState([]);

  return (
    <div className="board-layot" style={{ width: "500px", height: "500px" }}>
      <div className="board" id="board-board">
        {boardState
          .filter(function (item) {
            return item.value != null;
          })
          .map((square) => {
            return (
              <Square
                type={square.value}
                square={square.square}
                key={square.square}
              />
            );
          })}
        {boardState
          .filter(function (item) {
            return item.value == null;
          })
          .map((square) => {
            return (
              <Square
                square={square.square}
                key={square.square}
                type={square.value}
              />
            );
          })}
        {highlights.map((square) => {
          return <Highlight square={square} key={square} color={"red"} />;
        })}
        {legalMoves.map((square) => {
          return <Hint square={square} key={square} />;
        })}
        {highlightActivePiece()}
      </div>
    </div>
  );

  function Square({ type, square, onclick }) {
    return (
      <div
        className={`piece ${type} square square-${square}`}
        onClick={(e) => clickSquare(e, square, type)}
        onContextMenu={(e) => clickSquare(e, square, type)}
      />
    );
  }
}

function Highlight({ square, color }) {
  return (
    <div
      className={`highlight square square-${square}`}
      style={{ backgroundColor: color }}
    />
  );
}

function Hint({ square }) {
  return <div className={`hint square square-${square}`} />;
}

function App() {
  return <Board></Board>;
}

export default App;
