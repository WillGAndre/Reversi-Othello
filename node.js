"use strict";

/*
    Notes:
    -> /ranking (DONE!)
        GET method, returns array with static values
    -> /register (Not working, returns status 400 due to undefined values of nick and/or pass)
        POST method - 1. Register in object indexed by nick
                      2. if nick exists check password, if not add password
                      3. serialize object altered in file
                      4. init object from file when booting 
*/  
/*
    For testing /register 
    curl -H "Content-Type: application/json" -d '{"nick":"gui","password":"123"}' http://localhost:8008/register

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
    // const pathQuery = parsedUrl.query;

    let answer = {status: {}, data: {}, rankings: {}};
    switch(pathName) {
        case '/ranking':
            answer = handleRanking();
            break;
        case '/register':
            answer = handleRegister(request);
            break;
        default:
            answer.status = 404;
            break;
    }

    if (answer.status === undefined) {
        answer.status = 200;
    }
    response.writeHead(answer.status, headers['plain']);
    response.write(JSON.stringify(answer));
    response.end();
}).listen(port);

function handleRegister(request) {
    let body = '';
    let data = {};
    request.on('data', (chunk) => { body += chunk; })
    request.on('end', () => {
        try { data = JSON.parse(body); }
        catch(err) { console.log(err); answer.status = 400; }
    })
    request.on('error', (err) => { console.log(err.message); answer.status = 400; })

    let nick = data.nick;
    let pass = data.pass;
    let answer = {data: {}, status: 0};

    if (nick === undefined || pass === undefined) {
        answer.status = 400;
        return answer;
    }

    let dataFromFile;
    fs.open('dataFile.txt', 'r', function (err,dataFile) {  // Tries to open file
        if (err) {
            throw err;
        } else {
            dataFromFile = JSON.parse(dataFile.toString());
        }
    });

    if (dataFromFile === undefined) {   // If file doesnt exist, create new one
        fs.writeFile('dataFile.txt',JSON.stringify(data),(err) => {
            if (err) throw err;
        });
    } else {    
        let user_found = false;
        if (dataFromFile.nick == nick) {
            user_found = true;
        } else {
            fs.writeFile('dataFile.txt',JSON.stringify(data),(err) => {
                if (err) throw err;
            });
            answer.status = 200;
        }
        if (user_found) {
            if (dataFromFile.pass == pass) {
                answer.status = 200;
            } else {
                answer.status = 401;
            }
            return answer;
        }
    }
    return answer;
}

/*
function handleRegister(data) {
    let nick = data.nick;
    let pass = data.pass;
    let answer = {data: {}, status: 0};

    if (nick === undefined || pass === undefined) {
        answer.status = 400;
        return answer;
    }

    let dataFromFile;
    fs.open('dataFile.txt', 'r', function (err,dataFile) {  // Tries to open file
        if (err) {
            throw err;
        } else {
            dataFromFile = JSON.parse(dataFile.toString());
        }
    });

    if (dataFromFile === undefined) {   // If file doesnt exist, create new one
        fs.writeFile('dataFile.txt',JSON.stringify(data),(err) => {
            if (err) throw err;
        });
    } else {    
        let user_found = false;
        if (dataFromFile.nick == nick) {
            user_found = true;
        } else {
            fs.writeFile('dataFile.txt',JSON.stringify(data),(err) => {
                if (err) throw err;
            });
            answer.status = 200;
        }
        if (user_found) {
            if (dataFromFile.pass == pass) {
                answer.status = 200;
            } else {
                answer.status = 401;
            }
            return answer;
        }
    }
    return answer;
}
*/

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
