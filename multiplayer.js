let events = null;

async function gameFlux() {
  let info_join = await othelloService.join({
    'group': 15,
    'nick': CURRENTUSER.username,
    'pass': CURRENTUSER.password
  }, this.processMsg);
  let usr_color = info_join.color;
  let game_hash = info_join.game;

  // let info_update = await othelloService.update({nick: CURRENTUSER.username, game: game_hash}, processMsg);

  // if (othelloService.events.readyState == EventSource.OPEN) {
  // 	let flg_end = false;
  // 	console.log("test");	
  // }
}

function processMsg(msg) {
  let data = JSON.parse(msg.data);
  console.log(data);
}


// async function joinGame() {
//   let joinAns = getFetch("http://twserver.alunos.dcc.fc.up.pt:8008/join",{'group': 15, 'nick': CURRENTUSER.username, 'pass': CURRENTUSER.password});
//     return await joinAns;
// }

// function update(value) {
// 	if (value.error == null) {
//       // color_player = value.color;
//       // game_hash = value.game;
//       return {color_player: value.color, game_hash: value.game};
//     } else {
//       setInterval(() => {joinGame();}, 4000);
//     }
// }

// function playMultiGame(game_hash) {
//   let url = "http://twserver.alunos.dcc.fc.up.pt:8008/update?nick="+CURRENTUSER.username+"&game="+game_hash;
//   events = new EventSource(url);
//   let data = 0;
//   events.onopen = function() {
//     console.log("Connection is open");
//   }
//   events.onmessage = function(event) {
//     data = JSON.parse(event.data);
//   }
//   events.onerror = function() {
//     console.log("Error in connection " + events.readyState);
//     events.close();
//     setInterval(() => {
//       if (events.readyState == EventSource.CLOSED) {
//         playMultiGame(game_hash);
//       }
//     }, 4000);
//   }
//   // events.close();       Must close when game ends
//   return data;
// }

// Fetch - POST
async function getFetch(url, payLoad) {
  try {
    const response = await fetch(url, { method: 'POST', body: JSON.stringify(payLoad) });
    if (!response.ok)
      throw new Error(response.statusText);
    const data = await response.json()      // Asynchronous
    return data;
  } catch (error) {
    return error;
  }
}