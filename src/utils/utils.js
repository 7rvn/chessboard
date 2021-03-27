import moveSelf from "../sounds/move-self.webm";
import promote from "../sounds/promote.webm";
import castle from "../sounds/castle.webm";
import capture from "../sounds/capture.webm";
import moveCheck from "../sounds/move-check.webm";

export function chessjsBoardToPositionObj(position) {
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

export function playSound(flag) {
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

export function pieces(position) {
  return Object.entries(position).map((entry) => {
    let [square, piece] = entry;

    if (piece) {
      return (
        <Square
          type={`piece ${piece.color + piece.type}`}
          square={square}
          key={square}
        />
      );
    } else {
      return null;
    }
  });
}

export function Square({ type, square, style = null }) {
  return (
    <div className={`${type} square square-${square}`} style={style}></div>
  );
}
