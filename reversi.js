/*
  In this test, we consider the following:
    'x' - player 1 (black)
    'o' - player 2 (grey)
*/

const gb_size = 8;
const succ    = 1;
const fail    = 0;
const error   = -1;

// Constantes flipping
var flip_row = 0, flip_col = 0, flip_d1 = 0, flip_d2 = 0;

class gameboard {
  constructor(color,data) {
    this.color = color;
    this.data = [];  // Must be equal to [] before setup
    for (let i=0;i<8;i++) {this.data[i] = new Array(8);}
  }

  setup_board() {
    for (let i=0;i<8;i++) {
      for (let j=0;j<8;j++) {
        this.data[i][j] = '-';
        if (i==3||i==4) {
          this.data[i][i] = 'x';
        }
        if((i==3&&j==4)||(j==3&&i==4)) {
          this.data[i][j] = 'o';
        }
      }
    }
  }

  print_data() {
    process.stdout.write("  ");
    for(let upper=0;upper<8;upper++) {process.stdout.write(upper+" ");}
    process.stdout.write('\n');
    for (let line in this.data) {
      for (let col in this.data[line]) {
        if (col==0) {
          process.stdout.write(line+" "+this.data[line][col]+" ");
        } else {
          process.stdout.write(this.data[line][col]+" ");  // Print without trailing newline
        }
      }
      process.stdout.write('\n');
    }
  }
}

class player {
  constructor(id,color,gbPieces) {
    this.id = id;
    this.gbPieces = gbPieces;
    if(this.id == 2) {
      this.color = "grey";
    } else {this.color = "black";}
  }

  show_color() {
    if(this.id%2==0) {
      return "grey";
    } else {return "black";}
  }
}

let gb = new gameboard("green",[]);
gb.setup_board();
//gb.print_data();

let p1 = new player(1,"-",2);
let p2 = new player(2,"-",2);

//let flag_test = get_player_move(gb,p1);
gb.print_data();
check_for_move(gb,p1);
//if (flag_test==1) {check_flip(gb,p1,0,0); flip(gb,p1,0,0,1,0,0,0);}
gb.print_data();

/*----------------------------------------------------------*/

function get_player_move(gb, pl) { // Player 1 (Human) x
  let x = 2; let y = 6; // values from input (test)
  let frien_pos;
  if (pl.id == 1) {
    frien_pos  = 'x';
  } else {
    frien_pos  = 'o';
  }

  let flg_place = check_flip(gb, pl, x, y);

  if (flg_place == succ) {
    gb.data[x][y] = frien_pos;
    return succ;
  }
  return fail;
}

function check_for_move(gb, pl) {
  let found_move = 0;
  for (let i = 0; i < gb_size; i++) {
    for (let j = 0; j < gb_size; j++) {
      if (gb.data[i][j] == '-') {
        if (check_flip(gb,pl,i,j) == 1) {
          found_move = 1;
          process.stdout.write("Possible play:" + '\n');
          process.stdout.write("("+i+","+j+")" + '\n');
        }
      }
    }
  }

  if (found_move == 1) {
    return succ;
  }
  return fail;
}


/*  flip_enemy :
   - flip line, col and diagonals all at once. Based on current
     modified position

   curr_pl -> player that just played
   x,y     -> position that he just played
*/
function check_flip(gb, curr_pl, x, y) {
  let frien_pos,enemy_pos;
  if (curr_pl.id == 1) {
    enemy_pos  = 'o';
    frien_pos  = 'x';
  } else {
    enemy_pos  = 'x';
    frien_pos  = 'o';
  }

  let flg_enemy_row = 0, flg_friendly_row = 0;
  let flg_enemy_col = 0, flg_friendly_col = 0;
  flip_row = 0;
  flip_col = 0;

  let flg_enemy_d1 = 0, flg_friendly_d1 = 0;
  let flg_enemy_d2 = 0, flg_friendly_d2 = 0;
  flip_d1 = 0;
  flip_d2 = 0;

  let flg_diag1 = 1;
  let flg_diag2 = 1;
  let y_d1 = y-x;
  let x_d2 = (x-(7-y)); let y_d2 = (x+y);

  for (let i=0;i<gb_size;i++) {
    let x_d1 = i;  y_d1 += i;
    x_d2 += i;     y_d2 -= i;

    if (x_d2 < 0) {x_d2 = 0;}
    if (x_d2 > 7) {x_d2 = 7;}
    if (y_d2 > 7) {y_d2 = 7;}
    if (y_d1 > 7) {flg_diag1 = 0;}
    if (y_d2 < 0) {flg_diag2 = 0;}

    if (i != y) {
      if (gb.data[x][i] == enemy_pos) { // Found enemy
        flg_enemy_row = 1;
      } else if (gb.data[x][i] == frien_pos) { // Found friendly
        flg_friendly_row = 1;
      }
      if (flg_enemy_row == 1 && flg_friendly_row == 1) {  // if both found then flip
        flip_row = 1;
      }
    }
    if (i != x) {
      if (gb.data[i][y] == enemy_pos) {
        flg_enemy_col = 1;
      } else if (gb.data[i][y] == frien_pos) {
        flg_friendly_col = 1;
      }
      if (flg_enemy_col == 1 && flg_friendly_col == 1) {
        flip_col = 1;
      }
    }
    if (flg_diag1 == 1 && (x_d1 != x && y_d1 != y)) {
      if (gb.data[x_d1][y_d1] == enemy_pos) {
        flg_enemy_d1 = 1;
      } else if (gb.data[x_d1][y_d1] == frien_pos) {
        flg_friendly_d1 = 1;
      }
      if (flg_enemy_d1 == 1 && flg_friendly_d1 == 1) {
        flip_d1 = 1;
      }
    }
    if (flg_diag2 == 1 && (x_d2 != x && y_d2 != y)) {
      if (gb.data[x_d2][y_d2] == enemy_pos) {
        flg_enemy_d2 = 1;
      } else if (gb.data[x_d2][y_d2] == frien_pos) {
        flg_friendly_d2 = 1;
      }
      if (flg_enemy_d2 == 1 && flg_friendly_d2 == 1) {
        flip_d2 = 1;
      }
    }
  }

  if (flip_row == 0 && flip_col == 0 && flip_d1 == 0 && flip_d2 == 0) {
    return fail;
  }
  //flip(gb,curr_pl,x,y,flip_row,flip_col,flip_d1,flip_d2);
  return succ;
}

function flip(gb, curr_pl, x, y, flip_row, flip_col, flip_d1, flip_d2) {
  let frien_pos,enemy_pos;
  if (curr_pl.id == 1) {
    enemy_pos  = 'o';
    frien_pos  = 'x';
  } else {
    enemy_pos  = 'x';
    frien_pos  = 'o';
  }

  let flg_diag1 = 1;
  let flg_diag2 = 1;
  let y_d1 = y-x;
  let x_d2 = (x-(7-y)); let y_d2 = (x+y);

  for (let i=0; i<gb_size; i++) {
    let x_d1 = i;  y_d1 += i;
    x_d2 += i;     y_d2 -= i;

    if (x_d2 < 0) {x_d2 = 0;}
    if (y_d2 > 7) {y_d2 = 7;}
    if (y_d1 > 7) {flg_diag1 = 0;}
    if (y_d2 < 0) {flg_diag2 = 0;}

    if (flip_row == 1 && gb.data[x][i] == enemy_pos)
      gb.data[x][i] = frien_pos;
    if (flip_col == 1 && gb.data[i][y] == enemy_pos)
      gb.data[i][y] = frien_pos;
    if (flip_d1 == 1 && gb.data[x_d1][x_d2] == enemy_pos)
      gb.data[x_d1][y_d1] = frien_pos;
    if (flip_d2 == 1 && gb.data[x_d1][i_d2] == enemy_pos)
      gb.data[x_d2][y_d2] = frien_pos;
  }
}

/*----------------------------------------------------------*/

//  Implementar jogo por classes
//   -> 1 class para o tabuleiro em si + info + functions
//   -> 1 class para representar o jogador + info + functions

//let data = create_mtx();
//setup_board(data);
//print_data(data);
