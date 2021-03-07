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
  return (
    (parseInt(square[1]) - 1).toString() +
    (square.charCodeAt(0) - 97).toString()
  );
}

export function sanToHexTo(list) {
  return list
    .map((x) => x.replace("+", "").slice(-2))
    .map(
      (x) => (parseInt(x[1]) - 1).toString() + (x.charCodeAt(0) - 97).toString()
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
