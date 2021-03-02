import { Node } from "./tree";

export function constructPgnTree() {
  const root = new Node("e4");
  const newnode = root.addChild(new Node("e5"));
  const newnode1 = newnode.addChild(new Node("Nc3"));
  const newnode2 = newnode1.addChild(new Node("Nf6"));
  const newnode3 = newnode2.addChild(new Node("f4"));
  const newnode4 = newnode3.addChild(new Node("d5"));
  const newnode5 = newnode4.addChild(new Node("fxe5"));
  const newnode6 = newnode5.addChild(new Node("Nxe4"));
  const newnode7 = newnode6.addChild(new Node("Qf3"));
  const newnode8 = newnode7.addChild(new Node("Nxc3"));

  return;
}
