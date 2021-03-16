import * as React from "react";

const Sidebox = React.forwardRef(({ pgnview, title, restartFunction }, ref) => {
  const [items, setItems] = React.useState([]);
  const [view, setView] = React.useState("comments");
  const [finish, setFinish] = React.useState(false);

  React.useImperativeHandle(ref, () => ({
    toggleAlert(bool) {
      if (finish !== bool) {
        setFinish(bool);
      }
    },
    reset() {
      setItems([]);
      setFinish(false);
    },
    addItem({ title, body }) {
      setItems([...items, { title: title, body: body }]);
    },
  }));

  function toggleView() {
    view === "pgn" ? setView("comments") : setView("pgn");
  }

  return (
    <div className="sidebox">
      <div className={"sidebox-toggle"}>
        <div
          onClick={toggleView}
          style={view === "comments" ? { backgroundColor: "grey" } : {}}
        >
          comments
        </div>
        <div
          onClick={toggleView}
          style={view === "pgn" ? { backgroundColor: "grey" } : {}}
        >
          PGN
        </div>
      </div>

      <span id="sidebox-title">{title}</span>

      <div
        className={"comment-view"}
        style={{ display: view === "comments" ? "block" : "none" }}
      >
        {items.map((i, key) => {
          return (
            <div className="pgn-comment" key={key}>
              <span className="comment-title">{i.title}</span>
              <span className="comment-body">{i.body}</span>
            </div>
          );
        })}
      </div>

      <div
        className={"pgn-view"}
        style={{ display: view === "pgn" ? "block" : "none" }}
      >
        {pgnview}
      </div>
      <div
        className={"restartbox"}
        style={{ visibility: finish === true ? "visible" : "hidden" }}
        onClick={restartFunction}
      >
        Restart
      </div>
    </div>
  );
});

export default Sidebox;
