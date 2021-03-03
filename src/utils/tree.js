export function Node(move) {
  this.move = move;
  this.nextMove = null;
  this.parent = null;
  this.sideLine = [];

  this.setParentNode = function (node) {
    this.parent = node;
  };

  this.addChild = function (node) {
    node.setParentNode(this);
    this.nextMove = node;
  };

  this.getParentNode = function () {
    return this.parent;
  };

  this.getChildren = function () {
    return this.children;
  };

  this.addSideline = function (node) {
    node.setParentNode(this);
    this.sideLine.push(node);
  };
}
