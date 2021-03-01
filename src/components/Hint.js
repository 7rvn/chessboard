import * as React from "react";

function Hint({ square }) {
  return <div className={`hint square square-${square}`} />;
}

export default Hint;
