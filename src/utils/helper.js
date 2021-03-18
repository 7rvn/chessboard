export function hexToAlgebraic(square) {
  return (
    String.fromCharCode(97 + parseInt(square[1])) +
    (parseInt(square[0]) + 1).toString()
  );
}

export function hexToSan(rank, file) {
  return (
    String.fromCharCode(97 + parseInt(file)) + (parseInt(rank) + 1).toString()
  );
}

export function algToHex(square) {
  square = square.replace("+", "").slice(-2);
  return (
    (parseInt(square[1]) - 1).toString() +
    (square.charCodeAt(0) - 97).toString()
  );
}

export function isLegal(moves, from, to) {
  let result = null;
  moves.forEach((move) => {
    if (from === move.from) {
      if (to === move.to) {
        result = move;
      }
    }
  });
  return result;
}

export function getMoveObj(moves, san) {
  let result = null;
  moves.forEach((move) => {
    if (san === move.san || san.slice(0, 1) + san.slice(2) === move.san) {
      result = move;
    }
  });
  return result;
}
