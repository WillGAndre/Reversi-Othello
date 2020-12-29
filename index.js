/* By Guilherme Pereira and Nuno Taveira */

var instructionsDiv = document.getElementById("instructions");
     instructionsDiv.hidden = true;

// Simply toogle the insructionsDiv
onButtonInstructionsClick = function(oEvent) {
  instructionsDiv.hidden = !instructionsDiv.hidden;
}

/*
  Fix bug where game piece doesn´t have possible move and the other player
  can´t play because of that game piece. Player cages the other player in
  corner.
  (More user testing to identify bug!)
*/
let gameboard = null;
const pl1_checked = document.getElementById("numberOfPlayers1");
const pl2_checked = document.getElementById("numberOfPlayers2");
const restart_bt = document.getElementById("restart");
const player_color = document.getElementById("color_checkbox");
const diff_elem = document.getElementById("diff");
const current_pl = document.getElementById("rep_player");         // Represent who is playing in game
const counter_p1 = document.getElementById("scr_p1");             // Score player 1
const counter_p2 = document.getElementById("scr_p2");             // Score player 2
let player_counter = 1;                                           // Player counter to control game flow

let color_player = "black";                                       // Color of human player
let curr_player_dot = "dotp1";                                    // Type of dot of current player
let diff_value = 1;                                               // Difficulty value (1 or 2)
let lookup_line = create_lookupLine();
let check_win_flag = true;

window.onload = function() {
  gameboard = new Reversi("base");
  counter_p1.innerHTML = 2;                                       //  init score
  counter_p2.innerHTML = 2;
  let pass_p1 = false;                                            //  Player 1 passes round (if true)
  let pass_p2 = false;                                            //  Player 2 passes round

  pl1_checked.addEventListener("input", function() {
    // Function to validate and generate gray dots
    validate_position(curr_player_dot,gameboard.data_dots);

    let cells = document.getElementsByClassName("cell");
    let candidate_dots  = document.getElementsByClassName("dotplace");

    // Difficulty event listener
    diff_elem.addEventListener("input", function() {
      diff_value = diff_elem.value;
    }, "false");

    // Player color event listener
    player_color.addEventListener("input", function() {
      if (!player_color.checked || player_color.checked) {
        player2_move(gameboard.data_dots,candidate_dots);
        player_counter++;
        clear_board(candidate_dots);
        player_counter % 2 == 0 ? (curr_player_dot="dotp2",current_pl.innerHTML = "White") : (curr_player_dot="dotp1",current_pl.innerHTML = "Black")
        validate_position(curr_player_dot,gameboard.data_dots) == 0 ? pass_p2 = true : pass_p2 = false
      }
      color_player == "black" ? color_player = "white" : color_player = "black"
    }, "false");

      for (let i = 0; i < cells.length; i++) {
        cells[i].onclick = function() {
          if (cells[i].firstElementChild.className == "dotplace") {
            let index = -1;
            for (let j = 0; j < candidate_dots.length; j++) {
              if (candidate_dots[j].parentElement.id == cells[i].id) {
                index = j;
                break;
              }
            }
            if (index >= 0 && !pass_p1) {  // Player 1 plays
              let cell = candidate_dots[index].parentElement;
              let index_dot = Array.prototype.slice.call(cells).indexOf(cell);
              flip_enemy(gameboard.data_dots, index_dot, curr_player_dot, 1);
            } 

            player_counter++;
            clear_board(candidate_dots);
            player_counter % 2 == 0 ? (curr_player_dot="dotp2",current_pl.innerHTML = "White") : (curr_player_dot="dotp1",current_pl.innerHTML = "Black")
            validate_position(curr_player_dot,gameboard.data_dots) == 0 ? pass_p2 = true : pass_p2 = false
            
            check_win(gameboard.data_dots,pass_p1,pass_p2,candidate_dots);

            if (!pass_p2) {  // Player 2 plays
              player2_move(gameboard.data_dots,candidate_dots);
            } 

            player_counter++;
            clear_board(candidate_dots);
            player_counter % 2 == 0 ? (curr_player_dot="dotp2",current_pl.innerHTML = "White") : (curr_player_dot="dotp1",current_pl.innerHTML = "Black")
            validate_position(curr_player_dot,gameboard.data_dots) == 0 ? pass_p1 = true : pass_p1 = false
            
            if (check_win_flag)
              check_win(gameboard.data_dots,pass_p1,pass_p2,candidate_dots);
          }
        }
      }
  }, false);

  pl2_checked.addEventListener("click", function() {
    if (document.getElementById("userInformation").hidden == true) {
      alert("Login required!");
      pl2_checked.checked = false;
    } else {
      gameFlux();
    }
  }, false);
}

// Auxiliary Functions
/*
  Creates Map that is used to represent every line of the board
  based on index of the board (array).
*/
function create_lookupLine() {
  let lookup_line = new Map();
  for (let i = 0; i < 64; i++) {
    if(i>=0&&i<=7)  {lookup_line.set(i, 1);}
    if(i>=8&&i<=15)  {lookup_line.set(i, 2);}
    if(i>=16&&i<=23) {lookup_line.set(i, 3);}
    if(i>=24&&i<=31) {lookup_line.set(i, 4);}
    if(i>=32&&i<=39) {lookup_line.set(i, 5);}
    if(i>=40&&i<=47) {lookup_line.set(i, 6);}
    if(i>=48&&i<=55) {lookup_line.set(i, 7);}
    if(i>=56&&i<=63) {lookup_line.set(i, 8);}
  }
  return lookup_line;
}

// Generate array of dots representation based on cells
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

// Clear gray dots from board
function clear_board(gray_dots) {
  while (gray_dots.length > 0) {
    gray_dots[0].classList.remove("dotplace");
  }
  gray_dots.clear;
}

// Reversi class that creates game board
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
        dot.className = "dotp2";
      } else if (i==28 || i==35) {
        dot.className = "dotp1";
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


/*
  Player 2 move , has two modes that are configurable by the difficulty range
  choosen.
  Difficulty 1 - Easy :
    - Player 2 chooses random play of available options (gray dots).
  Difficulty 2 - Medium/Hard :
    - Player 2 chooses play from options that maximaizes its heuristic (Coin Parity).

    Heuristic:
    100 * (Max Player Coins - Min Player Coins ) / (Max Player Coins + Min Player Coins)
    -> From the paper "An Analysis of Heuristics in Othello" - by Vaishnavi Sannidhanam and Muthukaruppan Annamalai
    -> Where Max is Player 2 and Min being Player 1 (human)
*/
function player2_move(board,candidate_dots) {
  let pos;
  if (diff_value == 1) {
    let random_dot = candidate_dots[Math.floor(Math.random() * candidate_dots.length)];
    let cell = random_dot.parentElement;
    pos = parseInt(cell.id);
  } else {
    dot = coin_parity(board, candidate_dots);
    let cell = dot.parentElement;
    pos = parseInt(cell.id);
  }

  board[pos].className = curr_player_dot;
  flip_enemy(board,pos,curr_player_dot,1);
}

/*
Coin Parity Heuristic Value =
100 * (Max Player Coins - Min Player Coins ) / (Max Player Coins + Min Player Coins)
*/
function coin_parity(board, candidate_dots) {
  let sv_dot    = 0;
  let score     = 0;
  let best_scr  = -1;

  let friendly,enemy;
  curr_player_dot == "dotp2" ? (friendly = "dotp2",enemy = "dotp1") : (friendly = "dotp1",enemy = "dotp2")

  for (let i = 0; i < candidate_dots.length; i++) {
    let heu_board = create_boardCopy(board);
    let dot = candidate_dots[i];
    let cell = dot.parentElement;
    let pos = parseInt(cell.id);
    heu_board[pos].className = curr_player_dot;
    flip_enemy(heu_board,pos,curr_player_dot,0);

    let min = 0;
    let max = 0;
    for (let j = 0; j < 64; j++) {
      if (heu_board[j].className == friendly) {
        max++;
      } else if (heu_board[j].className == enemy) {
        min++;
      }
    }
    score = ((100 * (max - min)) / (max + min));
    if (score > best_scr) {
      best_scr = score;
      sv_dot = dot;
    }
  }

  return sv_dot;
}

// Creates backup of board so we can simulate the heuristic function with a copy
function create_boardCopy(board) {
  let arr = new Array(64);
  for (let i = 0; i < 64; i++) {
    let dot = document.createElement("div");
    if (board[i].className == "dotp1") {
      dot.className = "dotp1";
    } else if (board[i].className == "dotp2") {
      dot.className = "dotp2";
    } else if (board[i].className == "dotplace") {
      dot.className = "dotplace";
    }
    arr[i] = dot;
  }
  return arr;
}

// Checks if game is over if so alerts
function check_win(board,end_p1,end_p2,candidate_dots) {
  if ((end_p1 && end_p2) || check_board_full(board) || check_board_ply(board,candidate_dots)) {
    let player_points = 0;
    if (color_player == "black") {
      player_points = parseInt(counter_p1.innerHTML);
    } else {
      player_points = parseInt(counter_p2.innerHTML);
    }
    CURRENTUSER.addScore(player_points);
    if (parseInt(counter_p1.innerHTML) > parseInt(counter_p2.innerHTML)) {
      alert("Game over, Black wins");
      check_win_flag = false;
    } else if (parseInt(counter_p1.innerHTML) < parseInt(counter_p2.innerHTML)) {
      alert("Game over, White wins");
      check_win_flag = false;
    } else {
      alert("Tie!");
      check_win_flag = false;
    }
  }
  return;
}

// Checks if board is full
function check_board_full(board) {
  let flg = true;
  for (let i = 0; i < 63; i++) {
    if (board[i].className != "dotp1" && board[i].className != "dotp2") {
      flg = false; break;
    }
  }
  return flg;
}

// Checks if players have any game pieces left if not check win is called
function check_board_ply(board,candidate_dots) {
  let counter_pl1 = 0;
  let counter_pl2 = 0;
  for (let i = 0; i < 64; i++) {
    if (board[i].className == "dotp1") {counter_pl1++;}
    if (board[i].className == "dotp2") {counter_pl2++;}
  }
  if (counter_pl1 == 0 || counter_pl2 == 0) {
    return true;
  } else {
    if (counter_p1 == 1) {
      if (validate_position("dotp1",board) == 0)
        return true;
      else
        clear_board(candidate_dots);
    } else if (counter_p2 == 1) {
      if (validate_position("dotp2",board) == 0)
        return true;
      else
        clear_board(candidate_dots);
    }
  }
  return false;
}

/*
  Generate gray dots in board based on current player (friendly). This function
  utilizes valid_pos_all that checks the upper, lower , next and last positions
  based on the current line.
  This function returns the number of gray dots that were placed on the board
  for end of game/player pass exceptions.
*/
function validate_position(friendly,board) {
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
        if (adj_pos_upper >= 0 && adj_line_upper == current_line-1 && board[adj_pos_upper].className == enemy && valid_pos_all(board,friendly,adj_pos_upper,i,1) == true) {
          let dot = board[pos];
          if (dot.className != "dotp1" && dot.className != "dotp2") {
            dot.className = "dotplace";
            num_gray_dots++;
          }
        }
        if (adj_pos_lower < 64 && adj_line_lower == current_line+1 && board[adj_pos_lower].className == enemy && valid_pos_all(board,friendly,adj_pos_lower,i,2) == true) {
          let dot = board[pos];
          if (dot.className != "dotp1" && dot.className != "dotp2") {
            dot.className = "dotplace";
            num_gray_dots++;
          }
        }
      }

      let nxt_pos = pos+1;
      let next_line = lookup_line.get(nxt_pos);
      if (next_line == current_line && nxt_pos < 64 && board[nxt_pos].className == enemy && valid_pos_all(board,friendly,nxt_pos,1,3) == true) {
        let dot = board[pos];
        if (dot.className != "dotp1" && dot.className != "dotp2") {
          dot.className = "dotplace";
          num_gray_dots++;
        }
      }

      let lst_pos = pos-1;
      let prev_line = lookup_line.get(lst_pos);
      if (prev_line == current_line && lst_pos >= 0 && board[lst_pos].className == enemy && valid_pos_all(board,friendly,lst_pos,1,4) == true) {
        let dot = board[pos];
        if (dot.className != "dotp1" && dot.className != "dotp2") {
          dot.className = "dotplace";
          num_gray_dots++;
        }
      }
    }
  }
  return num_gray_dots;
}

/*
  Searches upper,lower,next,last position for friendly (dotp1 or dotp2) dot,
  returns boolean value.
*/
function valid_pos_all(board,friendly,pos,i,type) {
  let flag_found = false;
  switch (type) {
    case 1:       // Verify upper
        pos -= i;
        while (pos >= 0 && board[pos] != undefined) {
          if (board[pos].className == friendly) {flag_found = true; break;}
          if (board[pos].className != "dotp1" && board[pos].className != "dotp2") {break;}
          pos -= i;
        }
        break;
    case 2:       // Verify lower
        pos += i;
        while (pos <= 63 && board[pos] != undefined) {
          if (board[pos].className == friendly) {flag_found = true; break;}
          if (board[pos].className != "dotp1" && board[pos].className != "dotp2") {break;}
          pos += i;
        }
        break;
    case 3:       // Verify next
        let current_line = lookup_line.get(pos);
        pos += i;
        let next_line = lookup_line.get(pos);
        while (pos <= 63 && current_line == next_line && board[pos] != undefined) {
          if (board[pos].className == friendly) {flag_found = true; break;}
          if (board[pos].className != "dotp1" && board[pos].className != "dotp2") {break;}
          pos += i;
          next_line = lookup_line.get(pos);
        }
        break;
    case 4:       // Verify last
        let current_lin = lookup_line.get(pos);
        pos -= i;
        let lst_line = lookup_line.get(pos);
        while (pos >= 0 && current_lin == lst_line && board[pos] != undefined) {
          if (board[pos].className == friendly) {flag_found = true; break;}
          if (board[pos].className != "dotp1" && board[pos].className != "dotp2") {break;}
          pos -= i;
          lst_line = lookup_line.get(pos);
        }
        break;
    default:
  }
  return flag_found;
}



/*
  Flips enemy game pieces in row,column and diagonals if found friendly
  game piece at the far end of that row,column and/or diagonals.
  ex:
     F -- E -- E -- F
*/
function flip_enemy(board, pos, friendly, flg_score) {
  let enemy, update_score;
  friendly == "dotp1" ? (enemy="dotp2",update_score=counter_p1) : (enemy="dotp1",update_score=counter_p2)
  for (let i = 7; i < 10; i++) {
    if (valid_pos_all(board,friendly,pos,i,1) == true) {
      flip_all(board,friendly,enemy,pos,i,update_score,flg_score,1);
    }
    if (valid_pos_all(board,friendly,pos,i,2) == true) {
      flip_all(board,friendly,enemy,pos,i,update_score,flg_score,2);
    }
  }
  if (valid_pos_all(board,friendly,pos,1,3) == true) {
    flip_all(board,friendly,enemy,pos,1,update_score,flg_score,3);
  }
  if (valid_pos_all(board,friendly,pos,1,4) == true) {
    flip_all(board,friendly,enemy,pos,1,update_score,flg_score,4);
  }
}

/*
  Auxiliary function to flip_enemy that flips game pieces in spific row,column
  and or diagonals (based on type, 1 -> upper | 2 -> lower | 3 -> next | 4 -> last).
*/
function flip_all(board, friendly, enemy, pos, i, score, flg_score, type) {
  board[pos].className = friendly;
  switch (type) {
    case 1:       // Flip upper
        pos -= i;
        while (pos >= 0 && board[pos].className != friendly) {
          if (board[pos].className == enemy) {
            board[pos].className = friendly;
            if (flg_score==1)
              score.innerHTML++;
          }
          pos -= i;
        }
        break;
    case 2:       // Flip lower
        pos += i;
        while (pos <= 63 && board[pos].className != friendly) {
          if (board[pos].className == enemy) {
            board[pos].className = friendly;
            if (flg_score==1)
              score.innerHTML++;
          }
          pos += i;
        }
        break;
    case 3:       // Flip next
        let current_line = lookup_line.get(pos);
        pos += i;
        let next_line = lookup_line.get(pos);
        while (pos <= 63 && current_line == next_line && board[pos].className != friendly) {
          if (board[pos].className == enemy) {
            board[pos].className = friendly;
            if (flg_score==1)
              score.innerHTML++;
          }
          pos += i;
          next_line = lookup_line.get(pos);
        }
        break;
    case 4:       // Flip last
        let current_lin = lookup_line.get(pos);
        pos -= i;
        let lst_line = lookup_line.get(pos);
        while (pos >= 0 && current_lin == lst_line && board[pos].className != friendly) {
          if (board[pos].className == enemy) {
            board[pos].className = friendly;
            if (flg_score==1)
              score.innerHTML++;
          }
          pos -= i;
          lst_line = lookup_line.get(pos);
        }
        break;
    default:
  }

}


