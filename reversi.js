// constructor of gameboard (Not finished !)
/*
class gameboard {
  constructor(color,gp1,gp2,data) {
    this.color = "green";
    this.gp1 = this.gp2 = 2;
    this.data = this.data;  // Must be equal to [] before setup
    for (let i=0;i<8;i++) {data[i] = new Array(8);}
  }

  get num_gp1() {
    return this.gp1;
  }

  setup_board(data) {
    for (let i=0;i<8;i++) {
      for (let j=0;j<8;j++) {
        data[i][j] = '-';
        if (i==3||i==4) {
          data[i][i] = 'x';
        }
        if((i==3&&j==4)||(j==3&&i==4)) {
          data[i][j] = 'o';
        }
      }
    }
  }

  print_data(data) {
    process.stdout.write("  ");
    for(let upper=0;upper<8;upper++) {process.stdout.write(upper+" ");}
    process.stdout.write('\n');
    for (let line in data) {
      for (let col in data[line]) {
        if (col==0) {
          process.stdout.write(line+" "+data[line][col]+" ");
        } else {
          process.stdout.write(data[line][col]+" ");  // Print without trailing newline
        }
      }
      process.stdout.write('\n');
    }
  }
}

let data = []
let gb = new gameboard("green",2,2,data);
process.stdout.write(gb.num_gp1);
gb.setup_board(data);
gb.print_data(data);
*/


function create_mtx() {
  var data = [];
  for (let i=0; i < 8; i++) {
    data[i] = new Array(8);
  }
  return data;
}

function setup_board() {
  for (let i=0; i<8; i++) {
    for (let j=0; j<8; j++) {
      data[i][j] = '-';
      if (i==3||i==4) {
        data[i][i] = 'x';
      }
      if((i==3&&j==4)||(j==3&&i==4)) {
        data[i][j] = 'o';
      }
    }
  }
}

function print_data() {
  process.stdout.write("  ");
  for(let upper=0;upper<8;upper++) {process.stdout.write(upper+" ");}
  process.stdout.write('\n');
  for (let line in data) {
    for (let col in data[line]) {
      if (col==0) {
        process.stdout.write(line+" "+data[line][col]+" ");
      } else {
        process.stdout.write(data[line][col]+" ");  // Print without trailing newline
      }
    }
    process.stdout.write('\n');
  }
}

/*----------------------------------------------------------*/

/*----------------------------------------------------------*/

//  Implementar jogo por classes
//   -> 1 class para o tabuleiro em si + info + functions
//   -> 1 class para representar o jogador + info + functions

let data = create_mtx();
setup_board(data);
print_data(data);
