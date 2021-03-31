import moveSelf from "../assets/sound/move-self.mp3";
import promote from "../assets/sound/promote.mp3";
import castle from "../assets/sound/castle.mp3";
import capture from "../assets/sound/capture.mp3";
import moveCheck from "../assets/sound/move-check.mp3";

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
  if (window.matchMedia("(pointer: coarse)").matches) {
    return;
  }
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
