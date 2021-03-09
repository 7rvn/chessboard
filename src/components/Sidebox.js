import * as React from "react";

const SideboxItem = React.forwardRef(({ move, comment }, ref) => {
  const [items, setItems] = React.useState([]);

  const [alert, setAlert] = React.useState("none");

  React.useImperativeHandle(ref, () => ({
    toggleAlert(message) {
      setAlert("block");
    },
  }));

  if (comment && !items.includes(move + "DELIMITERBREAKHERE" + comment)) {
    setItems([...items, move + "DELIMITERBREAKHERE" + comment]);
  }
  return (
    <div className="sidebox">
      <span id="sidebox-title">{"Vienna Gambit"}</span>
      {items.map((i) => {
        let Damove = i.split("DELIMITERBREAKHERE")[0];
        let Dacomment = i.split("DELIMITERBREAKHERE")[1];
        return (
          <div className="pgn-comment">
            <span className="comment-title">{Damove}</span>
            <span className="comment-body">{Dacomment}</span>
          </div>
        );
      })}
      <div
        className={"alertbox"}
        style={{ backgroundColor: "green", display: alert }}
      ></div>
    </div>
  );
});

export default SideboxItem;
