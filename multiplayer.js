/*

  Fix current player bug (!!!)
  Fix validate positions bug (!!!)

*/
let pass_p1 = false;
let skip_change = true;

async function gameFlux() {
  let info_join = await othelloService.join({
    'group': 15,
    'nick': CURRENTUSER.username,
    'pass': CURRENTUSER.password
  }, this.processMsg);
  if (othelloService.color == "light") {  // Current player is second 
    color_player = "white";
    curr_player_dot = "dotp2";
    player_color.checked = false;
  }
}

function processMsg(msg) {
  let data = JSON.parse(msg.data);
  let winner = data.winner;
  if (winner === undefined) {
    let empty = data.count.empty;
    let count_p1 = data.count.dark;
    let count_p2 = data.count.light;
    if (empty != 0 && count_p1 != 0 && count_p2 != 0) {
      let board = data.board;
      let turn = data.turn;
      let skip = data.skip;
      iterateGame(board, count_p1, count_p2);

      if (turn == CURRENTUSER.username && skip != CURRENTUSER.username) {
        validate_position(curr_player_dot,gameboard.data_dots) == false ? pass_p1 = true : pass_p1 = false 

        let cells = document.getElementsByClassName("cell");
        let candidate_dots  = document.getElementsByClassName("dotplace"); 
        for (let i = 0; i < cells.length; i++) {
          cells[i].onclick = function() {
            if (cells[i].firstElementChild.className == "dotplace") {
              let index = -1;
              let cell_index = -1;
              for (let j = 0; j < candidate_dots.length; j++) {
                if (candidate_dots[j].parentElement.id == cells[i].id) {
                  index = j;
                  cell_index = i;
                  break;
                }
              }
              if (index >= 0 && !pass_p1) {
                let cell = candidate_dots[index].parentElement;

                let index_dot = Array.prototype.slice.call(cells).indexOf(cell);
                flip_enemy(gameboard.data_dots, index_dot, curr_player_dot, 0);
                clear_board(candidate_dots);

                let move = findMove(cell_index);
                othelloService.notify({
                  'nick': CURRENTUSER.username,
                  'pass': CURRENTUSER.password,
                  'game': othelloService.game,
                  'move': move
                }); 
              }
            }
          }
        }
      } else if (skip == CURRENTUSER.username) {
        othelloService.notify({
          'nick': CURRENTUSER.username,
          'pass': CURRENTUSER.password,
          'game': othelloService.game,
          'move': null
        });
      }
      (current_pl.innerHTML == "Black" && skip_change == false) ? current_pl.innerHTML = "White" : current_pl.innerHTML = "Black"
      skip_change = false;
    } else {
      if (empty == 0 && winner === undefined) {
        alert("Tie!");
      } else {
        alert(winner+" won!");
      }
      othelloService.events.close();
      player_color.checked = true;
      pl2_checked.checked = false;
    }
  } else {
    alert(winner+" won!");
    othelloService.events.close();
    player_color.checked = true;
    pl2_checked.checked = false;
    window.location.reload();
  }
}

function findMove(index) {
  let row = lookup_line.get(index)-1;
  let col = -1;
  let count_col = 0; // 0, 8, 16, 24, 32, 40, 48, 56
  let adder = 0;
  while (count_col != 8) {
    if (index == (0+adder) || index == (8+adder) || index == (16+adder) || index == (24+adder) || index == (32+adder) 
      || index == (40+adder) || index == (48+adder) || index == (56+adder)) {
      col = count_col;
      break;
    }
    adder++;
    count_col++;
  }
  return {'row': row, 'column': col};
}

function iterateGame(board, count_p1, count_p2) {
  let l = 0;
  counter_p1.innerHTML = count_p1;  
  counter_p2.innerHTML = count_p2;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (l < 64) {
        if (board[i][j] == "dark") {
          gameboard.data_dots[l].className = "dotp1";
        } else if (board[i][j] == "light") {
          gameboard.data_dots[l].className = "dotp2";
        }
      } else {return;}
      l++;
    }
  }
}

function buildRankings() {
  if (document.getElementById("ranking").style.display == "none") {
    let ranking = othelloService.ranking();
    let tableBody = document.getElementById("rank_body");
    while (tableBody.firstChild) {
      tableBody.removeChild(tableBody.firstChild);
    }
    ranking.then(function(data) {
      for (let i = 0; i < 10; i++) {
        tableBody.appendChild((new RankingsRow(data.ranking[i].nick, data.ranking[i].victories, data.ranking[i].games)).toHTMLRow());
      }
    });

    document.getElementById("HOF").style.display = "none";
    document.getElementById("ranking").style.display = "grid";
  } else {
    alert("Rankings already generated");
  }
}

function RankingsRow(username,victories,games) {
  this.username = username;
  this.victories = victories;
  this.games = games;

  this.toHTMLRow = function() {
    let ret = document.createElement("tr");
    let tableCell;

    tableCell = document.createElement("td");
		tableCell.textContent = this.username;
		ret.appendChild(tableCell);

		tableCell = document.createElement("td");
		tableCell.textContent = this.victories;
		ret.appendChild(tableCell);

		tableCell = document.createElement("td");
		tableCell.textContent = this.games;
		ret.appendChild(tableCell);

		return ret;
  }
}
