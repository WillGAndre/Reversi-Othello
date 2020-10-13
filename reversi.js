/*
  In this test, we consider the following:
    'x' - player 1 (black)
    'o' - player 2 (grey)
*/

const gb_size = 8;
const succ  = 1;
const error = -1;

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
    this.gbPieces = this.gbPieces;
    if(this.id%2==0) {
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
gb.print_data();

let p1 = new player(1,"-",2);
let p2 = new player(2,"-",2);

get_player_move(gb);

/*----------------------------------------------------------*/

function get_player_move(gb,p1) { // Player 1 (Human) x
  let x = 3; let y = 5; // values from input (test)
  let flg_diag = 1;

  if (gb.data[x][y]!='-') {return error;}

  for (let i=0;i<gb_size;i++) {
    let x_d1 = i, y_d = 7-y+i;
    let x_d2 = x-i;
    if (y_d > 7) {flg_diag=0;}
    if (gb.data[i][y]=='o' || gb.data[x][i]=='o') {gb.data[x][y]='x'; return succ;}
    if (flg_diag==1 && (gb.data[x_d1][y_d]=='o' || gb.data[x_d1][y_d]=='o')) {
      gb.data[x][y]='x';
      return succ;
    }
  }

  return error;
}

/*
  For flipping :
   - create aux function to flip line, col and diagonals all at
   once. Based on current modified position
*/

/*----------------------------------------------------------*/

//  Implementar jogo por classes
//   -> 1 class para o tabuleiro em si + info + functions
//   -> 1 class para representar o jogador + info + functions

//let data = create_mtx();
//setup_board(data);
//print_data(data);
