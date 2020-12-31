"use strict";

/*
    Notes:
    -> /ranking (DONE!)
        GET method, returns array with static values
    -> /register (DONE! Need to test with persistent file)
        POST method - 1. Register in object indexed by nick
                      2. if nick exists check password, if not add password
                      3. serialize object altered in file
                      -> init object from file when booting 
    -> /join (Not working, returning game="" and color="")
        POST method - 1. Recieve nick and pass
                      2. Check if file gameQueue.json exists
                      3. if not create file/add usr to Queue *1,
                         else get contents from file
                                -> file contains 1 usr *2,
                                -> otherwise throw error
                      
                        *1 - this usr is "dark" , attribute hash from group number to json in file and send:
                                {"game": *hash*,
                                "color": "dark" }
                        
                        *2 - this usr is "light" , check hash from file with new hash and send...


*/
/*
    For testing /register 
    curl -H "Content-Type: application/json" -d '{nick: "gui",password: 123}' http://localhost:8008/register

*/


const port = 8008;
const http = require('http');
const url = require('url');
const fs = require('fs');
const crypto = require('crypto');

const games = require('./update_module.js');

const headers = {
    plain: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
    },
    sse: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
        'Connection': 'keep-alive'
    }
};

const are_games_loaded = false;

http.createServer(function (request, response) {
    // Initialize games queue in case of server reboot
    if(!are_games_loaded){
        fs.readFile('./gameQueue.json', function (err, data) {
            if(!err){
                let temp_games = JSON.parse(data.toString());
                for (let i = 0; i < temp_games.length; i++) {
                    let game = temp_games[i];
                    games.addEntry(game.hash, game.user, game.color);
                }
            }
        });
        are_games_loaded = true;
    }

    const parsedUrl = url.parse(request.url, true);
    const pathName = parsedUrl.pathname;
    const query = parsedUrl.query;
    let return_flg = 0;     // 1 -> ranking | 2 -> register

    let answer = { status: 200, data: {}, rankings: {}, game: "", color: "" };
    let body = '';
    switch (pathName) {
        case '/join':
            body = '';
            request.on('data', function (chunk) { body += chunk; });
            request.on('end', function () {
                try {
                    handleJoin(response, JSON.parse(body));
                }
                catch (err) {
                    console.log(err.message);
                    answer.status = 400;
                }
            });
            request.on('error', (err) => { console.log(err.message); answer.status = 400; })
            break;
        case '/update':
            answer = handleUpdate(query);
            answer.status = 200;
            break;
        case '/ranking':
            return_flg = 1;
            answer = handleRanking();
            break;
        case '/register':
            return_flg = 2;
            let new_body = '';
            request.on('data', function (chunk) { new_body += chunk; });
            request.on('end', function () {
                try {
                    let data = JSON.parse(new_body);
                    answer.status = handleRegister(data.nick, data.pass);
                }
                catch (err) {
                    console.log(err.message);
                    answer.status = 400;
                }
            });
            request.on('error', (err) => { console.log(err.message); answer.status = 400; })
            break;
        case '/leave':
            body = '';
            request.on('data', function (chunk) { body += chunk; });
            request.on('end', function () {
                try {
                    handleLeave(response, JSON.parse(body));
                }
                catch (err) {
                    console.log(err.message);
                    answer.status = 400;
                }
            });
            request.on('error', (err) => { console.log(err.message); answer.status = 400; })
            break;
        default:
            answer.status = 404;
            break;
    }

    if (answer.status === undefined) {
        answer.status = 200;
    }
    switch (return_flg) {
        case 1:
            response.writeHead(answer.status, headers['plain']);
            response.end(JSON.stringify(answer.rankings));
            break;
        case 2:
            response.writeHead(answer.status, headers['plain']);
            response.end(JSON.stringify(answer.data));
            break;
        default:
            break;
    }
    // response.end();
}).listen(port);

function handleUpdate(query) {
    let nick = query.nick;
    let game = query.game;

    let gen_hash = games.searchEntry(nick);
    console.log("hash ", gen_hash);

    // Generate hash and color of player
    // Check if hash is valid and if it is associated to the player
    // if (player.color == "black") then return normal ({})
    //  else throw error
    // else if (player.color == "light") then start game (and get game init instance) *1
    //  else throw error

    // *1
    //  get game instance
    //      -> game instance starts when "light" player is added to the gameQueue 
}

function handleJoin(response, data) {
    let hash_in = "";
    if (data.group === 33)
        hash_in = "33";

    let game_hash = crypto.createHash('md5').update(hash_in).digest("hex");
    let game_index = games.arr.findIndex(x => x.hash === game_hash);
    let ret = {
        game: game_hash
    }
    if(game_index === -1){
        games.addEntry(game_hash, data.nick, "black");
        ret.color = "black";
    } else {
        games.addEntry(game_hash, data.nick, "light");
        ret.color = "light";
    }
    fs.writeFile('./gameQueue.json', JSON.stringify(games.arr), (err) => {
        if (err) {
            throw err;
        }
        response.writeHead(200, headers['plain']);
        response.end(JSON.stringify(ret));
    });
}

function handleRegister(nick, pass) {
    let usrs = [];
    let wr_data = { nick: nick, pass: pass };
    let status = 200;

    if (nick === undefined || pass === undefined) {
        status = 400;
    }

    fs.readFile('./dataFile.json', function (err, data) {
        if (err) {              // File doesnt exist
            usrs.push(wr_data);
            fs.writeFile('./dataFile.json', JSON.stringify(usrs), (err) => {
                if (err) throw err;
            });
        } else {                // File exists
            usrs = JSON.parse(data.toString());
            for (let i = 0; i < usrs.length; i++) {
                let usr = usrs[i];
                if (usr.nick === nick) {
                    if (usr.pass === pass) {
                        return 200;
                    } else {
                        return 401;
                    }
                }
            }
            usrs.push(wr_data);
            fs.writeFile('./dataFile.json', JSON.stringify(usrs), (err) => {
                if (err) throw err;
            });
        }
    });

    return status;
}

function handleRanking() {
    let answer = { rankings: [{}], status: 0 };
    answer.status = 200;
    answer.rankings = [{ "nick": "123", "victories": 350, "games": 623 },
    { "nick": "a", "victories": 263, "games": 538 },
    { "nick": "tati123", "victories": 249, "games": 441 },
    { "nick": "adeus", "victories": 219, "games": 350 },
    { "nick": "admin", "victories": 219, "games": 317 },
    { "nick": "netcan", "victories": 205, "games": 414 },
    { "nick": "ola", "victories": 201, "games": 461 },
    { "nick": "Player 1", "victories": 192, "games": 372 },
    { "nick": "Player 2", "victories": 183, "games": 369 },
    { "nick": "duarte", "victories": 144, "games": 236 }];
    return answer;
}

function handleLeave(response, data){
    let ret = {}
    let hash_in = "";
    if (data.group === 33)
        hash_in = "33";

    // Must check for player first in games
    games.removeEntry(data.game, data.nick);
    fs.writeFile('./gameQueue.json', JSON.stringify(games.arr), (err) => {
        if (err) {
            throw err;
        }
        response.writeHead(200, headers['plain']);
        response.end(JSON.stringify(ret));
    });

    // Testing
    console.log(games.arr);
}