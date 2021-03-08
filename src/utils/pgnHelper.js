import { Node } from "./tree";

export function constructPgnTree() {
  const pgn_processed = vienna_gambit
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
  //console.log(root);
  return root;
}

const vienna_gambit_sa =
  "1. e4 e5 2. Nc3 Nf6 3. f4 d5 4. fxe5 Nxe4 5. Qf3 Nxc3 (5... Nc6 6. Bb5 Nxc3 (6... f5 7. d3 Nxc3 8. bxc3 Be6 9. Ne2) 7. dxc3 Qh4+ (7... a6 8. Bxc6+ bxc6 9. Ne2 Bc5 10. Qg3 Rg8 11. Bg5 Be7 12. Bxe7 Qxe7 13. O-O) (7... Be7 8. Ne2) 8. g3 Qe4+ 9. Be3 Qxe5 (9... Qxf3 10. Nxf3) (9... Qxc2 10. Ne2 Qe4 11. Qxe4 dxe4 12. Nd4 Bd7 13. Nxc6 bxc6 14. Ba4) 10. O-O-O Be6 11. Ne2) (5... f5 6. d3 (6. Nh3 Nc6 7. d3 Nxc3 8. bxc3 Nxe5 9. Qe2 Qe7 (9... Qh4+ 10. g3 Qe7 11. Bg2 Ng6 12. Be3) 10. Bg5) 6... Nxc3 7. bxc3 d4 (7... Be7 8. Ne2 O-O 9. g3) 8. Qg3 Nc6 9. Be2 Be6 10. Bf3 Qd7 11. Ne2 dxc3 12. Be3 Nb4 13. Rc1 Nd5 14. Bxd5) 6. bxc3 Be7 (6... Qh4+ 7. g3 Qe4+ 8. Qxe4 dxe4 9. Bg2 (9. d4 exd3 10. cxd3 Nc6 11. d4) 9... Nc6 10. Bxe4 Nxe5 11. Rb1 c6 12. d4 Nc4 13. Nf3 Bd6 14. Kf2 O-O 15. Bd3 Nb6 16. c4) (6... c5 7. Qg3 Nc6 8. Nf3 Bf5 9. Bd3 Bxd3 10. cxd3 g6 11. O-O Bg7 12. d4 cxd4 13. Nxd4 Nxd4 14. cxd4 O-O 15. Ba3 Re8 16. Qb3) (6... Be6 7. Nh3) 7. d4 c5 8. Bd3 cxd4 (8... Nc6 9. Ne2 Be6 10. O-O Qd7 11. Qg3 O-O-O 12. Bb5 a6 13. Bxc6 Qxc6 14. Bg5 Bxg5 15. Qxg5 cxd4 16. cxd4 Kb8 17. c3) 9. cxd4 Qa5+ 10. Bd2 Bb4 11. Rd1 Bxd2+ 12. Rxd2 Nc6 13. Ne2 Nb4 14. O-O O-O 15. Ng3 Qb6 16. Bf5  ";

const vienna_lines =
  "1. e4 e5 2. Nc3 Nc6 3. f4 (3. Bc4 Nf6 (3... Bc5 4. Qg4 Qf6 (4... g6 5. Qf3 Nf6 6. Nge2 d6 7. d3 Bg4 8. Qg3) 5. Nd5 Qxf2+ 6. Kd1 Kf8 7. Nh3 Qd4 8. d3 d6 9. Qf3 Bxh3 10. Rf1 Be6 11. c3) 4. d3 Na5 (4... Bb4 5. Nge2 d5 (5... O-O 6. O-O d6 (6... h6 7. a3 Be7 8. f4) 7. Bg5) 6. exd5 Nxd5 7. O-O Be6 8. a3 Bxc3 9. bxc3 O-O 10. a4) (4... Bc5 5. f4 d6 6. Nf3 Ng4 (6... Bg4 7. Na4 O-O 8. Nxc5 dxc5 9. O-O Nd4 10. c3 Nxf3+ 11. gxf3 Bh3 12. Rf2 exf4 13. Bxf4) (6... O-O 7. Na4 Bg4 8. Nxc5 dxc5 9. O-O Qd6 10. Qd2 Bxf3 11. gxf3 Rad8 12. Kh1 Nh5 13. fxe5 Nxe5 14. Qg5 Nxc4 15. Qxh5 Ne5 16. f4) 7. Ng5 O-O 8. f5 Nf2 9. Qh5) 5. Qf3 Nxc4 6. dxc4 Bc5 (6... d6 7. h3 Be6 8. b3 Be7 9. Nge2 O-O 10. O-O) 7. Be3 Bxe3 8. Qxe3 O-O 9. h3 d6 10. b3 Be6 11. Nge2) 3... exf4 (3... d6 4. Nf3 Bg4 5. Bb5 a6 6. Bxc6+ bxc6 7. h3 Bxf3 8. Qxf3) (3... Nf6 4. fxe5 Nxe5 5. d4) (3... Bc5 4. Nf3 d6 5. Bb5 Nge7 6. Na4) 4. Nf3 g5 (4... d6 5. d4 g5 6. d5 Ne5 7. Bb5+ Bd7 8. Bxd7+ Nxd7 9. h4 g4 10. Nd4 Qf6 11. Ncb5) 5. h4 (5. d4 g4 6. Bc4 gxf3 7. O-O (7. Qxf3 Qh4+ 8. g3 Nxd4 9. Qf2 Qf6 10. Bxf4 Bb4 11. e5 Qc6 12. O-O-O Bxc3 13. Bxf7+ Kxf7 14. bxc3 Nf3 15. Rhf1) 7... fxg2 (7... Nxd4 8. Bxf4 Bc5 9. Kh1 d6 10. b4 Bb6 11. Nd5 fxg2+ 12. Kxg2 Ne6 13. Qf3) 8. Rxf4) (5. g3 g4 6. Nh4 f3 7. d4 d6 8. Be3 Be7 9. Qd2 Bxh4 10. gxh4 Qxh4+ 11. Bf2 Qh6 12. Qxh6 Nxh6 13. Nd5 Kd7 14. Kd2) 5... g4 6. Ng5 h6 7. Nxf7 Kxf7 8. d4 d5 (8... f3 9. Bc4+ Kg7 10. gxf3 Be7 11. Be3) 9. Bxf4 Nf6 10. Nxd5 (10. exd5 Nxd5 (10... Bd6 11. Bxd6 Qxd6 12. dxc6) 11. Bc4 Be6 12. O-O) 10... Nxd5 11. Bc4 Be6 12. exd5 Bxd5 13. O-O  ";

const vienna_gambit =
  "1. e4 e5 2. Nc3 Nf6 3. f4 d5 4. fxe5 Nxe4 5. Qf3 Nxc3 {We want them to take this knight so we will recapture with the b2 pawn and go for d2-d4, with a large center, and Bd3/Ne2 setup.} (5... Nc6 {A tricky and challenging move. We must prevent Nxe5.} 6. Bb5 Nxc3 (6... f5 {Combining Nc6 with f5 makes no sense. } 7. d3 Nxc3 8. bxc3 Be6 9. Ne2) 7. dxc3 Qh4+ (7... a6 8. Bxc6+ bxc6 9. Ne2 { And we prepare castling with Nd4 coming. Natural development here can quickly backfire for Black.} Bc5 10. Qg3 Rg8 11. Bg5 Be7 12. Bxe7 Qxe7 13. O-O) (7... Be7 8. Ne2) 8. g3 Qe4+ 9. Be3 {Don't rush to trade queens. We prefer if Black will take our queen first, and if Black gets greedy with Qxe5...} Qxe5 (9... Qxf3 10. Nxf3 {[%cal Ge1c1]}) (9... Qxc2 10. Ne2 {and now Black has to come back and offer the trade again, as taking on b2 leads to us castling with a huge attack.} Qe4 11. Qxe4 dxe4 12. Nd4 Bd7 13. Nxc6 bxc6 14. Ba4 {Down a pawn for the moment but with the amount of weaknesses (c6, c7, e4, f7) we'll continue pressure throughout the middlegame.}) 10. O-O-O Be6 11. Ne2 {We've sacrificed a pawn for an initiative. Our ideas include Nd4/f4, or Bf4, and moving the Rh1 to f1 or e1.}) (5... f5 {I'll be very clear: this is the best move in my experience, but we will try to mix things up here regardless.} 6. d3 (6. Nh3 {You can also try this tricky line, and I actually recommend it over the standard d3 line.} Nc6 7. d3 Nxc3 8. bxc3 {Gambiting e5.} Nxe5 9. Qe2 { [%cal Gd3d4]} Qe7 (9... Qh4+ 10. g3 Qe7 11. Bg2 Ng6 12. Be3) 10. Bg5) 6... Nxc3 7. bxc3 {Now if Black doesn't play the critical d5-d4, we will get a very easy game.} d4 (7... Be7 8. Ne2 {[%csl Rd4]} O-O 9. g3) 8. Qg3 {Remember this move! You're freeing up f3 for the knight and preventing the Bf8 from moving.} Nc6 9. Be2 {Another important moment -- we must develop Be2 before moving our knight, as we threaten Bh5+ here.} Be6 10. Bf3 Qd7 11. Ne2 dxc3 12. Be3 Nb4 13. Rc1 Nd5 14. Bxd5) 6. bxc3 Be7 (6... Qh4+ 7. g3 Qe4+ 8. Qxe4 dxe4 9. Bg2 (9. d4 exd3 10. cxd3 Nc6 11. d4) 9... Nc6 10. Bxe4 Nxe5 11. Rb1 c6 12. d4 Nc4 13. Nf3 Bd6 14. Kf2 O-O 15. Bd3 Nb6 16. c4) (6... c5 7. Qg3 {A good way to put Black's development on hold as usual.} Nc6 8. Nf3 Bf5 9. Bd3 Bxd3 10. cxd3 g6 11. O-O Bg7 12. d4 cxd4 13. Nxd4 Nxd4 14. cxd4 O-O 15. Ba3 Re8 16. Qb3) (6... Be6 7. Nh3) 7. d4 c5 8. Bd3 cxd4 (8... Nc6 9. Ne2 Be6 10. O-O Qd7 11. Qg3 O-O-O 12. Bb5 a6 13. Bxc6 Qxc6 14. Bg5 Bxg5 15. Qxg5 cxd4 16. cxd4 Kb8 17. c3) 9. cxd4 Qa5+ 10. Bd2 Bb4 11. Rd1 Bxd2+ 12. Rxd2 Nc6 13. Ne2 Nb4 14. O-O O-O 15. Ng3 Qb6 {Perelshteyn-Gledura (2018) and now an improvement is} 16. Bf5 {With ideas of c2-c3, Qg4 and a kingside attack.} *";
