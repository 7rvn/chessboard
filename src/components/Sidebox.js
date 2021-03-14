import * as React from "react";

const Sidebox = React.forwardRef(({ move, comment, pgnview, title }, ref) => {
  const [items, setItems] = React.useState([]);

  const [alert, setAlert] = React.useState("none");
  const [toggle, setToggle] = React.useState({
    pgnView: "none",
    comments: "block",
    pgnViewButton: {},
    commentButton: { backgroundColor: "grey" },
  });

  React.useImperativeHandle(ref, () => ({
    toggleAlert(message) {
      setAlert("block");
    },
  }));

  function showComments() {
    if (toggle.comments === "none") {
      setToggle({
        pgnView: "none",
        comments: "block",
        pgnViewButton: {},
        commentButton: { backgroundColor: "grey" },
      });
    }
  }

  function showPgn() {
    if (toggle.pgnView === "none") {
      setToggle({
        pgnView: "block",
        comments: "none",
        pgnViewButton: { backgroundColor: "grey" },
        commentButton: {},
      });
    }
  }

  if (comment && !items.includes(move + "DELIMITERBREAKHERE" + comment)) {
    setItems([...items, move + "DELIMITERBREAKHERE" + comment]);
  }
  return (
    <div className="sidebox">
      <div className={"sidebox-toggle"}>
        <div onClick={showComments} style={toggle.commentButton}>
          comments
        </div>
        <div onClick={showPgn} style={toggle.pgnViewButton}>
          PGN
        </div>
      </div>
      <span id="sidebox-title">{title}</span>
      <div className={"pgn-comments"} style={{ display: toggle.comments }}>
        {items.map((i, key) => {
          let Damove = i.split("DELIMITERBREAKHERE")[0];
          let Dacomment = i.split("DELIMITERBREAKHERE")[1];
          return (
            <div className="pgn-comment" key={key}>
              <span className="comment-title">{Damove}</span>
              <span className="comment-body">{Dacomment}</span>
            </div>
          );
        })}
      </div>
      <div className={"pgn-view"} style={{ display: toggle.pgnView }}>
        {pgnview}
      </div>
      <div
        className={"alertbox"}
        style={{ backgroundColor: "green", display: alert }}
      ></div>
    </div>
  );
});

export default Sidebox;
