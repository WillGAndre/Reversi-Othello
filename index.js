var instructionsDiv = document.getElementById("instructions");
     instructionsDiv.hidden = true;

// Simply toogle the insructionsDiv
onButtonInstructionsClick = function(oEvent) {
  instructionsDiv.hidden = !instructionsDiv.hidden;
}

window.onload = function() {
  const counter = new Reversi("base");
}

class Reversi {
  constructor(id) {
    this.content = new Array(64);
    this.board   = new Array(64);
    this.color   = "black";

    const parent = document.getElementById(id);
    const board  = document.createElement("div");

    board.className = "board";
    parent.appendChild(board);

    for(let i = 0; i < 64; i++) {
      let cell  = document.createElement("div");
      let dot   = document.createElement("div");

      cell.className  = "cell";
      board.appendChild(cell);
      if (i==27 || i==36) {
        dot.className = "dotp1";
      } else if (i==28 || i==35) {
        dot.className = "dotp2";
      }
      cell.appendChild(dot);

      cell.onclick = ((fun,pos) => {
              return () => fun(pos);
      })(this.play.bind(this),i);

      this.board[i] = cell;
    }
  }
  
  play(pos) {
    let dot = this.board[pos];
    this.color == "black" ?
    (this.color="white",dot.className="dotp1") : (this.color="black",dot.className="dotp2");
  }
}
