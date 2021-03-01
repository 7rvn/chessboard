import * as React from "react";

function Hint({ square, clickHandler }) {
  return (
    <div
      className={`hint square square-${square}`}
      onClick={clickHandler}
      onContextMenu={clickHandler}
    />
  );
}

export default Hint;
