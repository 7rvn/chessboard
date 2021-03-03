import { Node } from "./tree";

export function constructPgnTree() {
  const pgn_processed = viennayt_pgn.split(/\d+\.(?![^{]*})/);

  let root = null;
  let prevNode = null;
  let vFlag = null;
  let roots = [];

  // for each string starteing with n.
  pgn_processed.forEach((e) => {
    const letter = /[a-zA-Z]/;
    console.log(e.split(" "));

    // for each split by whitespace
    e.split(" ").map((s) => {
      let newNode = null;
      // if its a black move continunig after white move
      if (s.includes("..")) {
        // prev node = pev prev noce

        // not tested?
        if (!prevNode.parent.nextMove) {
          prevNode = prevNode.parent;
        }
      }

      // if its a move
      if (letter.test(s)) {
        const move = s.replace(/\)|\(|\.|\s/, "");
        // add as child of prev

        newNode = new Node(move);

        if (!root) {
          root = newNode;
          console.log("root add: ", move);
        } else {
          if (!vFlag) {
            prevNode.addChild(newNode);
            console.log("add to: ", prevNode.move, " : ", move);
          } else {
            roots[roots.length - 1].addSideline(newNode);
            vFlag = false;
            console.log(
              "add var: ",
              move,
              "to: ",
              roots[roots.length - 1].move
            );
          }
        }
        prevNode = newNode;
      }

      // if cointains (, next move starts variation of prev move
      // save last main move
      if (s.includes("(")) {
        roots.push(prevNode);
        vFlag = true;

        const debugroots = roots.map((r) => r.move);
        console.log("car begin, lmm:", debugroots);
      }
      // add variation once set flag

      // if contains ), end variation, next move as child of prev root
      // prevmove = last main move
      if (s.includes(")")) {
        prevNode = roots.pop();

        const debugroots = roots.map((r) => r.move);
        console.log("var over, lmm:", debugroots);
      }
    });
  });
  console.log(root);
  return root;
}

const viennayt_pgn =
  "1. e4 e5 2. Nc3 Nf6 (2... Nc6 3. Bc4 Bc5 (3... d6 4. d3) (3... Nf6 4. d3 Bc5 5. f4 d6 6. Nf3 Ng4 (6... O-O 7. f5) 7. Ng5 O-O 8. f5 Bf2+ 9. Kf1 Ne3+ 10. Bxe3 Bxe3 11. h4 Bxg5 12. hxg5 Qxg5 13. Rh5 Qf4+ 14. Kg1) 4. Qg4 Qf6 5. Nd5 Qxf2+ 6. Kd1 Kf8 7. Nh3 h5 8. Qg5 f6 9. Qg6 Rh6 10. Ne7) 3. f4 d5 (3... exf4 4. e5 Ng8 5. Nf3 d6 6. d4 dxe5 7. Qe2 Bb4 8. Qxe5+ Qe7 9. Bxf4) (3... d6 4. Nf3 Nc6 5. Bb5 Bd7 6. d3) 4. fxe5 Nxe4 5. Qf3 Nxc3 (5... f5 6. d3 Nxc3 7. bxc3 d4 (7...Be6) 8. Qg3 dxc3 9. Be2 Be6 10. Bf3 Nc6 11. Ne2 Qd7 12. Be3 Nb4 13. Rc1) (5...Nc6 6. Bb5 Nxc3 7. dxc3 Qh4+ 8. g3 Qe4+) 6. bxc3 (6. dxc3 Be6 7. Bf4 c5 8. O-O-O Nc6 9. Bc4) 6... Be7 7. d4 O-O 8. Bd3 Be6 9. Ne2 c5 10. O-O Nc6 11. Be3 *";
