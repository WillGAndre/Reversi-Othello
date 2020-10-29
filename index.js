var instructionsDiv = document.getElementById("instructions");
     instructionsDiv.hidden = true;

// Simply toogle the insructionsDiv
onButtonInstructionsClick = function(oEvent) {
  instructionsDiv.hidden = !instructionsDiv.hidden;
}


const player_color = document.getElementById("color_checkbox");
const current_pl = document.getElementById("rep_player");         // Represent who is playing
const counter_p1 = document.getElementById("scr_p1");             // Score player 1
const counter_p2 = document.getElementById("scr_p2");             // Score player 2
let player_counter = 1;                                           // Player counter to control game flow

let curr_player_dot = "dotp1";

/*
  Add feature where after alert , restart and save score of winning player
  Convert css px values to %
*/

window.onload = function() {
  const gameboard = new Reversi("base");
  let lookup_line = new Map();
  create_lookupLine(lookup_line);
  counter_p1.innerHTML = 2;                  //  init score
  counter_p2.innerHTML = 2;
  let pass_p1 = false;
  let pass_p2 = false;

  validate_position(curr_player_dot,gameboard.data_dots,lookup_line);

  let cells = document.getElementsByClassName("cell");
  let candidate_dots  = document.getElementsByClassName("dotplace");

  player_color.addEventListener("input", function() {
    if (!player_color.checked) {
      player2_move(gameboard.data_dots,candidate_dots);
      validate_position(curr_player_dot,gameboard.data_dots,lookup_line) == 0 ? pass_p1 = true : pass_p1 = false
    }
  }, "false");

    for (let i = 0; i < cells.length; i++) {
      cells[i].onclick = function() {
        let index = -1;
        for (let j = 0; j < candidate_dots.length; j++) {
          if (candidate_dots[j].parentElement.id == cells[i].id) {
            index = j;
            break;
          }
        }
        if (index >= 0 && !pass_p1) {
          let cell = candidate_dots[index].parentElement;

          let arr_dots = get_array_dots(cells);
          let index_dot = Array.prototype.slice.call(cells).indexOf(cell);
          flip_enemy(gameboard.data_dots, index_dot, curr_player_dot);
          clear_board(candidate_dots);
          player_counter++;
        } else if (pass_p1) {
          player_counter++;
          clear_board(candidate_dots);
        }

        player_counter % 2 == 0 ? (curr_player_dot="dotp2",current_pl.innerHTML = "White") : (curr_player_dot="dotp1",current_pl.innerHTML = "Black")
        validate_position(curr_player_dot,gameboard.data_dots,lookup_line) == 0 ? pass_p2 = true : pass_p2 = false
        check_win(gameboard.data_dots,pass_p1,pass_p2);

        if (!pass_p2) {
          player2_move(gameboard.data_dots,candidate_dots);
        } else {
          player_counter++;
          clear_board(candidate_dots);
        }

        validate_position(curr_player_dot,gameboard.data_dots,lookup_line) == 0 ? pass_p1 = true : pass_p1 = false
        check_win(gameboard.data_dots,pass_p1,pass_p2);
      }
    }
}

function create_lookupLine(lookup_line) {
  for (let i = 0; i < 64; i++) {
    if(i>=0&&i<=7)  {lookup_line.set(i, 1);}
    if(i>7&&i<=15)  {lookup_line.set(i, 2);}
    if(i>15&&i<=23) {lookup_line.set(i, 3);}
    if(i>23&&i<=31) {lookup_line.set(i, 4);}
    if(i>31&&i<=39) {lookup_line.set(i, 5);}
    if(i>39&&i<=47) {lookup_line.set(i, 6);}
    if(i>47&&i<=55) {lookup_line.set(i, 7);}
    if(i>55&&i<=63) {lookup_line.set(i, 8);}
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

function clear_board(gray_dots) {
  while (gray_dots.length > 0) {
    gray_dots[0].classList.remove("dotplace");
  }
  gray_dots.clear;
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
      cell.id = i;
      board.appendChild(cell);
      if (i==27 || i==36) {
        dot.className = "dotp1";
      } else if (i==28 || i==35) {
        dot.className = "dotp2";
      }
      cell.appendChild(dot);

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

/*----------------------------------------------------------------------------*/

function player2_move(board,candidate_dots) {
  let random_dot = candidate_dots[Math.floor(Math.random() * candidate_dots.length)];
  let cell = random_dot.parentElement;
  let pos = parseInt(cell.id);

  board[pos].className = curr_player_dot;
  flip_enemy(board,pos,curr_player_dot);
  clear_board(candidate_dots);
  player_counter++;
  player_counter % 2 == 0 ? (curr_player_dot="dotp2",current_pl.innerHTML = "White") : (curr_player_dot="dotp1",current_pl.innerHTML = "Black")
}

function check_win(board,end_p1,end_p2) {
  if ((end_p1 && end_p2) || check_board_full(board)) {
    if (counter_p1.innerHTML > counter_p2.innerHTML) {
      alert("Game over, Black wins");
    } else if (counter_p1.innerHTML < counter_p2.innerHTML) {
      alert("Game over, White wins");
    } else {alert("Tie!");}
  } else {
    end_p1 = true;
    end_p2 = true;
  }
  return;
}

function check_board_full(board) {
  let flg = true;
  for (let i = 0; i < 63; i++) {
    if (board[i].className != "dotp1" && board[i].className != "dotp2") {
      flg = false; break;
    }
  }
  return flg;
}

/*----------------------------------------------------------------------------*/

function validate_position(friendly,board,lookup_line) {
  let num_gray_dots = 0;
  let enemy;
  friendly == "dotp1" ? (enemy="dotp2") : (enemy="dotp1")

  for (let pos = 0; pos < 64; pos++) {
    let current_line = lookup_line.get(pos);

    if (pos != 27 && pos != 36 && pos != 28 && pos != 35) {

      for (let i = 7; i < 10; i++) {
        let adj_pos_upper = pos-i;
        let adj_line_upper = lookup_line.get(adj_pos_upper);
        let adj_pos_lower = pos+i;
        let adj_line_lower = lookup_line.get(adj_pos_lower);
        if (adj_pos_upper >= 0 && adj_line_upper == current_line-1 && board[adj_pos_upper].className == enemy && valid_pos_upper(board,friendly,adj_pos_upper,i) == true) {
          let dot = board[pos];
          if (dot.className != "dotp1" && dot.className != "dotp2") {
            dot.className = "dotplace";
            //candidate_moves.push(pos);
            num_gray_dots++;
          }
        }
        if (adj_pos_lower < 64 && adj_line_lower == current_line+1 && board[adj_pos_lower].className == enemy && valid_pos_lower(board,friendly,adj_pos_lower,i) == true) {
          let dot = board[pos];
          if (dot.className != "dotp1" && dot.className != "dotp2") {
            dot.className = "dotplace";
            //candidate_moves.push(pos);
            num_gray_dots++;
          }
        }
      }

      let nxt_pos = pos+1;
      let next_line = lookup_line.get(nxt_pos);
      if (next_line == current_line && nxt_pos < 64 && board[nxt_pos].className == enemy && valid_pos_nxt(board,friendly,nxt_pos) == true) {
        let dot = board[pos];
        if (dot.className != "dotp1" && dot.className != "dotp2") {
          dot.className = "dotplace";
          //candidate_moves.push(pos);
          num_gray_dots++;
        }
      }

      let lst_pos = pos-1;
      let prev_line = lookup_line.get(lst_pos);
      if (prev_line == current_line && lst_pos >= 0 && board[lst_pos].className == enemy && valid_pos_lst(board,friendly,lst_pos) == true) {
        let dot = board[pos];
        if (dot.className != "dotp1" && dot.className != "dotp2") {
          dot.className = "dotplace";
          //candidate_moves.push(pos);
          num_gray_dots++;
        }
      }
    }
  }
  return num_gray_dots;
}

function valid_pos_upper(board,friendly,pos,i) {
  let flag_found = false;
  pos -= i;
  while (pos >= 0) {
    if (board[pos].className == friendly) {flag_found = true; break;}
    if (board[pos].className != "dotp1" && board[pos].className != "dotp2") {break;}
    pos -= i;
  }
  return flag_found;
}

function valid_pos_lower(board,friendly,pos,i) {
  let flag_found = false;
  pos += i;
  while (pos < 64) {
    if (board[pos].className == friendly) {flag_found = true; break;}
    if (board[pos].className != "dotp1" && board[pos].className != "dotp2") {break;}
    pos += i;
  }
  return flag_found;
}

function valid_pos_nxt(board,friendly,pos) {
  let flag_found = false;
  pos += 1;
  while (pos % 8 != 0 && board[pos] != undefined) { // (pos+1) % 8 != 0
    if (board[pos].className == friendly) {flag_found = true; break;}
    if (board[pos].className != "dotp1" && board[pos].className != "dotp2") {break;}
    pos += 1;
  }
  return flag_found;
}

function valid_pos_lst(board,friendly,pos) {
  let flag_found = false;
  pos -= 1;
  while (pos % 8 != 0 && board[pos] != undefined) {
    if (board[pos].className == friendly) {flag_found = true; break;}
    if (board[pos].className != "dotp1" && board[pos].className != "dotp2") {break;}
    pos -= 1;
  }
  return flag_found;
}

/*----------------------------------------------------------------------------*/

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
  while (pos % 8 != 0 && board[pos].className != friendly) {
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

/*----------------------------------------------------------------------------*/
