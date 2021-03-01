import * as React from "react";
import "./App.css";

function Board() {
  function clickSquare(e, square, type) {
    e.preventDefault();
    //console.log(e);
    if (e.button === 2) {
      const copyHighlights = [...highlights];
      const index = copyHighlights.indexOf(square);
      console.log("before", copyHighlights);
      console.log(index);
      if (index > -1) {
        copyHighlights.splice(index, 1);
      } else {
        copyHighlights.push(square);
      }
      setHighlights(copyHighlights);
      console.log("after", copyHighlights);
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
                type={square.value}
                square={square.square}
                key={square.square}
              />
            );
          })}

        {highlights.map((square) => {
          return <Highlight square={square} key={square} />;
        })}
      </div>
    </div>
  );

  function Square({ type, square, onclick }) {
    if (type) {
      return (
        <div
          className={`piece ${type} square square-${square}`}
          onClick={(e) => clickSquare(e, square, type)}
          onContextMenu={(e) => clickSquare(e, square, type)}
        />
      );
    } else {
      return <div className={`square square-${square}`} />;
    }
  }
}

function Highlight({ square }) {
  return <div className={`highlight square square-${square}`} />;
}

function App() {
  return <Board></Board>;
}

export default App;
