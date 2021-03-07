import * as React from "react";

function Highlight({ square, color, clickHandler }) {
  return (
    <div
      className={`highlight square square-${square}`}
      style={{ backgroundColor: color }}
    />
  );
}

export default Highlight;
