import * as React from "react";

function SideboxItem({ move, comment }) {
  const [items, setItems] = React.useState([]);
  if (comment && !items.includes(move + "DELIMITERBREAKHERE" + comment)) {
    setItems([...items, move + "DELIMITERBREAKHERE" + comment]);
  }
  return items.map((i) => {
    let Damove = i.split("DELIMITERBREAKHERE")[0];
    let Dacomment = i.split("DELIMITERBREAKHERE")[1];
    return (
      <div className="pgn-comment">
        <span className="comment-title">{Damove}</span>
        <span className="comment-body">{Dacomment}</span>
      </div>
    );
  });
}

export default SideboxItem;
