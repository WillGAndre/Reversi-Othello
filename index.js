var instructionsDiv = document.getElementById("instructions");
     instructionsDiv.hidden = true;

// Simply toogle the insructionsDiv
onButtonInstructionsClick = function(oEvent) {
  instructionsDiv.hidden = !instructionsDiv.hidden;
}

const counter_p1 = document.getElementById("scr_p1");
const counter_p2 = document.getElementById("scr_p2");

window.onload = function() {
  let candidate_moves = new Array(64);
  const gameboard = new Reversi("base");
  const pl_1 = new Player("black");
  const pl_2 = new Player("white");
  counter_p1.innerHTML = 2; counter_p2.innerHTML = 2;     //  init score
  validate_position(pl_1.ply_color,gameboard.data_dots,candidate_moves);

  let curr_player = pl_1;
  let type_dot;
  if (curr_player == pl_1) {
    type_dot = "dotp1";
  } else {
    type_dot = "dotp2";
  }
  let cells = document.getElementsByClassName("cell");
  let candidate_dots  = document.getElementsByClassName("dotplace");

    for (let i = 0; i < candidate_dots.length; i++) {
      candidate_dots[i].onclick = function() {
        let cell = candidate_dots[i].parentElement;

        let arr_dots = get_array_dots(cells);
        let index_dot = Array.prototype.slice.call(cells).indexOf(cell);
        flip_enemy(gameboard.data_dots, index_dot, type_dot);
      }
    }

}

function get_array_dots(cells) {
  let arr_dots = new Array(cells.length);
  for (let i = 0; i < cells.length; i++) {
    let dot = cells[i].firstElementChild.className;
    if (dot=="") {
      arr_dots[i] = "empty";
    } else {
      arr_dots[i] = dot;
    }
  }
  return arr_dots;
}

class Player {
  constructor(color) {
    this.color = color;
    this.score = 2;
  }

  get ply_color() {
    return this.color;
  }
}

class Reversi {
  constructor(id) {
    this.cells       = new Array(64);   // Contem Cell
    this.dots        = new Array(64);   // Contem Dots
    this.color       = "black";

    const parent = document.getElementById(id);
    const board  = document.createElement("div");

    board.className = "board";
    parent.appendChild(board);

    let fn = this.play.bind(this);
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


      cell.onclick = ((fun,pos) => {    // Função anonima que é criado 64 vezes
              return () => fun(pos);
      })(fn,i);


      this.cells[i] = cell;
      this.dots[i]  = dot;
    }
  }

  play(pos) {
    let dot = this.dots[pos];
    this.color == "black" ?
    (this.color="white",dot.className="dotp1") : (this.color="black",dot.className="dotp2");
  }

  get data_dots() {
    return this.dots;
  }
}


/*-------------------------------------------------------------------------*/

function validate_position(color_pl,board,candidate_moves) {
  let enemy,friendly;
  color_pl == "black" ? (enemy="dotp2",friendly="dotp1") : (enemy="dotp1",friendly="dotp2")

  for (let pos = 0; pos < 64; pos++) {

    if (pos != 27 && pos != 36 && pos != 28 && pos != 35) {

      for (let i = 7; i < 10; i++) {
        let adj_pos_upper = pos-i;
        let adj_pos_lower = pos+i;
        if (adj_pos_upper >= 0 && board[adj_pos_upper].className == enemy && valid_pos_upper(board,friendly,adj_pos_upper,i) == true) {
          let dot = board[pos];
          dot.className = "dotplace";
          candidate_moves.push(pos);
        }
        if (adj_pos_lower < 64 && board[adj_pos_lower].className == enemy && valid_pos_lower(board,friendly,adj_pos_lower,i) == true) {
          let dot = board[pos];
          dot.className = "dotplace";
          candidate_moves.push(pos);
        }
      }

      let nxt_pos = pos+1;
      let lst_pos = pos-1;
      if (nxt_pos < 64 && board[nxt_pos].className == enemy && valid_pos_nxt(board,friendly,nxt_pos) == true) {
        let dot = board[pos];
        dot.className = "dotplace";
        candidate_moves.push(pos);
      }
      if (lst_pos >= 0 && board[lst_pos].className == enemy && valid_pos_lst(board,friendly,lst_pos) == true) {
        let dot = board[pos];
        dot.className = "dotplace";
        candidate_moves.push(pos);
      }
    }
  }
}

function valid_pos_upper(board,friendly,pos,i) {
  let flag_found = false;
  pos -= i;
  while (pos >= 0 && flag_found != true) {
    if (board[pos].className == friendly) {flag_found = true; break;}
    pos -= i;
  }
  return flag_found;
}

function valid_pos_lower(board,friendly,pos,i) {
  let flag_found = false;
  pos += i;
  while (pos < 64 && flag_found != true) {
    if (board[pos].className == friendly) {flag_found = true;}
    pos += i;
  }
  return flag_found;
}

function valid_pos_nxt(board,friendly,pos) {
  let flag_found = false;
  pos += 1;
  while ((pos+1) % 8 != 0 && flag_found != true) {
    if (board[pos].className == friendly) {flag_found = true; break;}
    pos += 1;
  }
  return flag_found;
}

function valid_pos_lst(board,friendly,pos) {
  let flag_found = false;
  pos -= 1;
  while (pos % 8 != 0 && flag_found != true) {
    if (board[pos].className == friendly) {flag_found = true; break;}
    pos -= 1;
  }
  return flag_found;
}

/*-------------------------------------------------------------------------*/

function flip_enemy(board, pos, friendly) {
  let enemy, update_score;
  friendly == "dotp1" ? (enemy="dotp2",update_score=counter_p1) : (enemy="dotp1",update_score=counter_p2)
  for (let i = 7; i < 10; i++) {
    if (valid_pos_upper(board,friendly,pos,i) == true) {
      flip_upper(board,friendly,enemy,pos,i,update_score);
    }
    if (valid_pos_lower(board,friendly,pos,i) == true) {
      flip_lower(board,friendly,enemy,pos,i,update_score);
    }
  }
  if (valid_pos_nxt(board,friendly,pos) == true) {
    flip_nxt(board,friendly,enemy,pos,update_score);
  }
  if (valid_pos_lst(board,friendly,pos) == true) {
    flip_lst(board,friendly,enemy,pos,update_score);
  }
}

function flip_upper(board, friendly, enemy, pos, i, score) {
  board[pos].className = friendly;                      // Update
  pos -= i;
  while (pos >= 0 && board[pos].className != friendly) {
    if (board[pos].className == enemy) {
      board[pos].className = friendly;
      score.innerHTML++;
    }
    pos -= i;
  }
}

function flip_lower(board, friendly, enemy, pos, i, score) {
  board[pos].className = friendly;
  pos += i;
  while (pos < 64 && board[pos].className != friendly) {
    if (board[pos].className == enemy) {
      board[pos].className = friendly;
      score.innerHTML++;
    }
    pos += i;
  }
}

function flip_nxt(board, friendly, enemy, pos, score) {
  board[pos].className = friendly;
  pos += 1;
  while ((pos+1) % 8 != 0 && board[pos].className != friendly) {
    if (board[pos].className == enemy) {
      board[pos].className = friendly;
      score.innerHTML++;
    }
    pos += 1;
  }
}

function flip_lst(board, friendly, enemy, pos, score) {
  board[pos].className = friendly;
  pos -= 1;
  while (pos % 8 != 0 && board[pos].className != friendly) {
    if (board[pos].className == enemy) {
      board[pos].className = friendly;
      score.innerHTML++;
    }
    pos -= 1;
  }
}

/*-------------------------------------------------------------------------*/
