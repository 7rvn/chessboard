import * as React from "react";

function Hint({ square, flag }) {
  return <div className={`${flag}hint square square-${square}`} />;
}

export default Hint;
