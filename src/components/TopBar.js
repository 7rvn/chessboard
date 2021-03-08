import * as React from "react";

function TopBar(props) {
  return (
    <div className={"topbar"}>
      <span id="topbar-title">{props.children}</span>
    </div>
  );
}

export default TopBar;
