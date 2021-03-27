import { Node } from "./tree";

export function constructPgnTree(pgn) {
  let nodeId = 0;
  const pgn_processed = pgn
    .replace(/}\)/g, "} )")
    .split(/\d+\.(?![^{]*})(?![^{]*})/);

  let root = new Node(null);
  let prevNode = root;
  let klammerauf = false;
  let klammerzu = false;
  let dotdot = false;
  let roots = [];

  // for each string starting with n.
  pgn_processed.forEach((e) => {
    const letter = /[a-zA-Z]/;

    // for each split by whitespace
    e.split(/\s+(?![^{]*})(?![^{]*})/).forEach((s) => {
      //console.log(s);
      if (!s.includes("{")) {
        //console.log("handle:", s);
        let newNode = null;
        // if its a black move continunig after white move
        if (s.includes("..")) {
          dotdot = true;
        }

        // if its a move
        if (letter.test(s)) {
          const move = s.replace(/\)|\(|\.|\s/, "");

          newNode = new Node(move);
          newNode.id = nodeId;
          nodeId++;

          // if starts variation
          if (klammerauf) {
            let localroot = roots[roots.length - 1];

            if (dotdot) {
              //console.log(move, "variation bei:", prevNode.parent.move);
              localroot.parent.addVariation(newNode);
              dotdot = false;
            } else {
              //console.log(move, "variation bei:", prevNode.parent.move);
              localroot.parent.addVariation(newNode);
            }
            klammerauf = false;

            // if not immediately after start of variation
          } else {
            if (dotdot) {
              if (klammerzu) {
                prevNode.addChild(newNode);
                klammerzu = false;
              } else {
                roots[roots.length - 1].addChild(newNode);
                //console.log(move, "after:", roots[roots.length - 1].move);
              }
              dotdot = false;
            } else {
              //console.log(move, "after:", prevNode.move);
              prevNode.addChild(newNode);
            }
          }

          prevNode = newNode;
        }

        if (s.includes("(")) {
          roots.push(prevNode);
          klammerauf = true;
        }

        if (s.includes(")")) {
          prevNode = roots.pop();
          klammerzu = true;
        }
      } else {
        prevNode.comment = s.replace("{", "").replace("}", "");
      }
    });
  });
  // console.log(root);
  return root;
}

export function getGoodMoves(node) {
  const goodMoves = [node.nextMove];
  if (node.variation) {
    node.variation.forEach((element) => {
      goodMoves.push(element);
    });
  }
  return goodMoves;
}
