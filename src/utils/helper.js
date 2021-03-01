export function hexToAlgebraic(square) {
  return (
    String.fromCharCode(97 + parseInt(square[1])) +
    (parseInt(square[0]) + 1).toString()
  );
}

export function algebraicToHex(list) {
  return list
    .map((x) => x.slice(-2))
    .map(
      (x) => (parseInt(x[1]) - 1).toString() + (x.charCodeAt(0) - 97).toString()
    );
}
