let events = null;
let apiEndPoint = "http://twserver.alunos.dcc.fc.up.pt:8008";

function joinGame() {
  let joinAns = getFetch(apiEndPoint+"/join",{'group': 15, 'nick': CURRENTUSER.username, 'pass': CURRENTUSER.password});
    joinAns.then(value => {
    if (value.error == null) {
      color_player = value.color;
      game_hash = value.game;
      let data = playMultiGame(game_hash);
    } else {
      setInterval(() => {joinGame();}, 4000);
    } 
  })
}

function playMultiGame(game_hash) {
  let url = apiEndPoint+"/update?nick="+CURRENTUSER.username+"&game="+game_hash;
  events = new EventSource(url);
  let data = 0;
  events.onopen = function() {
    console.log("Connection is open");
  }
  events.onmessage = function(event) {
    data = JSON.parse(event.data);
  }
  events.onerror = function() {
    console.log("Error in connection " + events.readyState);
    events.close();
    setInterval(() => {
      if (events.readyState == EventSource.CLOSED) {
        playMultiGame(game_hash);
      }
    }, 4000);
  }
  // events.close();       Must close when game ends
  return data;
}

// Fetch - POST
async function getFetch(url,payLoad) {
  try {
    const response = await fetch(url, {method: 'POST', body: JSON.stringify(payLoad)});
    if (!response.ok)
      throw new Error(response.statusText);
    const data = await response.json()      // Asynchronous
    return data;
  } catch(error) {
    return error;
  }
}