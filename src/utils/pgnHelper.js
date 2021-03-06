import { Node } from "./tree";

export function constructPgnTree() {
  const pgn_processed = vienna_gambit.split(/\d+\.(?![^{]*})/);
  //console.log(pgn_processed);

  let root = new Node(null);
  let prevNode = root;
  let klammerauf = false;
  let dotdot = false;
  let roots = [];

  // for each string starting with n.
  pgn_processed.forEach((e) => {
    const letter = /[a-zA-Z]/;
    //console.log(e.split(" "));

    // for each split by whitespace
    e.split(" ").map((s) => {
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

        // if starts variation
        if (klammerauf) {
          let localroot = roots[roots.length - 1];

          if (dotdot) {
            //console.log(move, "variation bei:", prevNode.parent.move);
            localroot.parent.addVariation(newNode);
            dotdot = false;
          } else {
            //console.log(move, "variation bei:", prevNode.move);
            localroot.addVariation(newNode);
          }
          klammerauf = false;

          // if not immediately after start of variation
        } else {
          if (dotdot) {
            roots[roots.length - 1].addChild(newNode);
            //console.log(move, "after:", roots[roots.length - 1].move);

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
      }
    });
  });
  console.log(root);
  return root;
}

const viennayt_pgn =
  "1. e4 e5 2. Nc3 Nf6 (2... Nc6 3. Bc4 Bc5 (3... d6 4. d3) (3... Nf6 4. d3 Bc5 5. f4 d6 6. Nf3 Ng4 (6... O-O 7. f5) 7. Ng5 O-O 8. f5 Bf2+ 9. Kf1 Ne3+ 10. Bxe3 Bxe3 11. h4 Bxg5 12. hxg5 Qxg5 13. Rh5 Qf4+ 14. Kg1) 4. Qg4 Qf6 5. Nd5 Qxf2+ 6. Kd1 Kf8 7. Nh3 h5 8. Qg5 f6 9. Qg6 Rh6 10. Ne7) 3. f4 d5 (3... exf4 4. e5 Ng8 5. Nf3 d6 6. d4 dxe5 7. Qe2 Bb4 8. Qxe5+ Qe7 9. Bxf4) (3... d6 4. Nf3 Nc6 5. Bb5 Bd7 6. d3) 4. fxe5 Nxe4 5. Qf3 Nxc3 (5... f5 6. d3 Nxc3 7. bxc3 d4 (7...Be6) 8. Qg3 dxc3 9. Be2 Be6 10. Bf3 Nc6 11. Ne2 Qd7 12. Be3 Nb4 13. Rc1) (5...Nc6 6. Bb5 Nxc3 7. dxc3 Qh4+ 8. g3 Qe4+) 6. bxc3 (6. dxc3 Be6 7. Bf4 c5 8. O-O-O Nc6 9. Bc4) 6... Be7 7. d4 O-O 8. Bd3 Be6 9. Ne2 c5 10. O-O Nc6 11. Be3 *";

const vienna_gambit =
  "1. e4 e5 2. Nc3 Nf6 3. f4 d5 4. fxe5 Nxe4 5. Qf3 Nxc3 (5... Nc6 6. Bb5 Nxc3 (6... f5 7. d3 Nxc3 8. bxc3 Be6 9. Ne2) 7. dxc3 Qh4+ (7... a6 8. Bxc6+ bxc6 9. Ne2 Bc5 10. Qg3 Rg8 11. Bg5 Be7 12. Bxe7 Qxe7 13. O-O) (7... Be7 8. Ne2) 8. g3 Qe4+ 9. Be3 Qxe5 (9... Qxf3 10. Nxf3) (9... Qxc2 10. Ne2 Qe4 11. Qxe4 dxe4 12. Nd4 Bd7 13. Nxc6 bxc6 14. Ba4) 10. O-O-O Be6 11. Ne2) (5... f5 6. d3 (6. Nh3 Nc6 7. d3 Nxc3 8. bxc3 Nxe5 9. Qe2 Qe7 (9... Qh4+ 10. g3 Qe7 11. Bg2 Ng6 12. Be3) 10. Bg5) 6... Nxc3 7. bxc3 d4 (7... Be7 8. Ne2 O-O 9. g3) 8. Qg3 Nc6 9. Be2 Be6 10. Bf3 Qd7 11. Ne2 dxc3 12. Be3 Nb4 13. Rc1 Nd5 14. Bxd5) 6. bxc3 Be7 (6... Qh4+ 7. g3 Qe4+ 8. Qxe4 dxe4 9. Bg2 (9. d4 exd3 10. cxd3 Nc6 11. d4) 9... Nc6 10. Bxe4 Nxe5 11. Rb1 c6 12. d4 Nc4 13. Nf3 Bd6 14. Kf2 O-O 15. Bd3 Nb6 16. c4) (6... c5 7. Qg3 Nc6 8. Nf3 Bf5 9. Bd3 Bxd3 10. cxd3 g6 11. O-O Bg7 12. d4 cxd4 13. Nxd4 Nxd4 14. cxd4 O-O 15. Ba3 Re8 16. Qb3) (6... Be6 7. Nh3) 7. d4 c5 8. Bd3 cxd4 (8... Nc6 9. Ne2 Be6 10. O-O Qd7 11. Qg3 O-O-O 12. Bb5 a6 13. Bxc6 Qxc6 14. Bg5 Bxg5 15. Qxg5 cxd4 16. cxd4 Kb8 17. c3) 9. cxd4 Qa5+ 10. Bd2 Bb4 11. Rd1 Bxd2+ 12. Rxd2 Nc6 13. Ne2 Nb4 14. O-O O-O 15. Ng3 Qb6 16. Bf5  ";
