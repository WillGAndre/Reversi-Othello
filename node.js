"use strict";

/*
    Notes:
    -> /ranking (DONE!)
        GET method, returns array with static values
    -> /register (DONE!)
        POST method - 1. Register in object indexed by nick
                      2. if nick exists check password, if not add password
                      3. serialize object altered in file
                      4. init object from file when booting 
*/  
/*
    For testing /register 
    curl -H "Content-Type: application/json" -d '{nick: "gui",password: 123}' http://localhost:8008/register

*/


const port = 8008;
const http = require('http');
const url = require('url');
const fs = require('fs');

const headers = {
    plain: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*' 
    }
};

http.createServer(function (request, response) {
    const parsedUrl = url.parse(request.url,true);
    const pathName = parsedUrl.pathname;
    let return_flg = 0;     // 1 -> ranking | 2 -> register

    let answer = {status: 200, data: {}, rankings: {}};
    switch(pathName) {
        case '/ranking':
            return_flg = 1;
            answer = handleRanking();
            break;
        case '/register':
            return_flg = 2;
            let body = '';
            request.on('data', function (chunk) { body += chunk; });
            request.on('end', function() {
                try { 
                    let data = JSON.parse(body);
                    answer.status = handleRegister(data.nick, data.pass);
                } 
                catch(err) {
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
    response.writeHead(answer.status, headers['plain']);
    switch (return_flg) {
        case 1:
            response.write(JSON.stringify(answer.rankings));
            break;
        case 2:
            response.write(JSON.stringify(answer.data));
            break;
        default:
            break;
    }
    response.end();
}).listen(port);

function handleRegister(nick,pass) {
    let usrs = [];
    let wr_data = {nick: nick, pass: pass};
    let status = 200;

    if (nick === undefined || pass === undefined) {
        status = 400;
    }

   fs.readFile('./dataFile.json', function(err,data) {
        if (err) {              // File doesnt exist
            usrs.push(wr_data);
            fs.writeFile('./dataFile.json',JSON.stringify(usrs),(err) => {
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
            fs.writeFile('./dataFile.json',JSON.stringify(usrs),(err) => {
                if (err) throw err;
            });
        }
    });

    return status;
}

function handleRanking() {
    let answer = {rankings: [{}], status: 0};
    answer.status = 200;
    answer.rankings = [{"nick":"123","victories":350,"games":623},
    {"nick":"a","victories":263,"games":538},
    {"nick":"tati123","victories":249,"games":441},
    {"nick":"adeus","victories":219,"games":350},
    {"nick":"admin","victories":219,"games":317},
    {"nick":"netcan","victories":205,"games":414},
    {"nick":"ola","victories":201,"games":461},
    {"nick":"Player 1","victories":192,"games":372},
    {"nick":"Player 2","victories":183,"games":369},
    {"nick":"duarte","victories":144,"games":236}];
    return answer;
}
