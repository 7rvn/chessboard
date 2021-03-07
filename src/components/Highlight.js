import * as React from "react";

function Highlight({ square, style, clickHandler }) {
  return <div className={`highlight square square-${square}`} style={style} />;
}

export default Highlight;
