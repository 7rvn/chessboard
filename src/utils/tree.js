export function Node(move, comment = null) {
  this.move = move; // move has been made
  this.nextMove = null; // mainline move
  this.parent = null; // previous move
  this.variation = []; // variation, alternative to nextMove
  this.comment = comment;
  this.id = null;
  this.setParentNode = function (node) {
    this.parent = node;
  };

  this.addChild = function (node) {
    node.setParentNode(this);
    this.nextMove = node;
  };

  this.addVariation = function (node) {
    node.setParentNode(this);
    this.variation.push(node);
  };
}
