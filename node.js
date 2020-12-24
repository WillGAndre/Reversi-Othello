"use strict";

/*
    Notes:
    -> /ranking (DONE!)
        GET method, returns array with static values
<<<<<<< HEAD
    -> /register (DONE! Need to test with persistent file)
=======
    -> /register (Not working, returns status 400 due to undefined values of nick and/or pass)
>>>>>>> 020bd7cc94be1ec9965bcd63fd2f36820426fab6
        POST method - 1. Register in object indexed by nick
                      2. if nick exists check password, if not add password
                      3. serialize object altered in file
                      4. init object from file when booting 
*/  
/*
    For testing /register 
<<<<<<< HEAD
    curl -H "Content-Type: application/json" -d '{nick: "gui",password: 123}' http://localhost:8008/register
=======
    curl -H "Content-Type: application/json" -d '{"nick":"gui","password":"123"}' http://localhost:8008/register
>>>>>>> 020bd7cc94be1ec9965bcd63fd2f36820426fab6

*/


const port = 8008;
const http = require('http');
const url = require('url');
const fs = require('fs');
<<<<<<< HEAD
const { Console } = require('console');
=======
>>>>>>> 020bd7cc94be1ec9965bcd63fd2f36820426fab6

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
<<<<<<< HEAD
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
=======
    // const pathQuery = parsedUrl.query;

    let answer = {status: {}, data: {}, rankings: {}};
    switch(pathName) {
        case '/ranking':
            answer = handleRanking();
            break;
        case '/register':
            answer = handleRegister(request);
>>>>>>> 020bd7cc94be1ec9965bcd63fd2f36820426fab6
            break;
        default:
            answer.status = 404;
            break;
    }

    if (answer.status === undefined) {
        answer.status = 200;
    }
    response.writeHead(answer.status, headers['plain']);
<<<<<<< HEAD
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
    let wr_data = {nick: nick, pass: pass};
    let status = 200;

    if (nick === undefined || pass === undefined) {
        status = 400;
    }

    let dataFromFile;
    fs.readFile('dataFile.txt', function(err,dataFile) {
=======
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
>>>>>>> 020bd7cc94be1ec9965bcd63fd2f36820426fab6
        if (err) {
            throw err;
        } else {
            dataFromFile = JSON.parse(dataFile.toString());
        }
    });

    if (dataFromFile === undefined) {   // If file doesnt exist, create new one
<<<<<<< HEAD
        fs.writeFile('dataFile.txt',JSON.stringify(wr_data),(err) => {
            if (err) 
                throw err;
            else {
                status = 200;
            }
        });
    } else {    // file exists   
=======
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
>>>>>>> 020bd7cc94be1ec9965bcd63fd2f36820426fab6
        let user_found = false;
        if (dataFromFile.nick == nick) {
            user_found = true;
        } else {
<<<<<<< HEAD
            fs.writeFile('dataFile.txt',JSON.stringify(wr_data),(err) => {
                if (err) throw err;
            });
            status = 200;
        }
        if (user_found) {
            if (dataFromFile.pass == pass) {
                status = 200;
            } else {
                status = 401;
            }
        }
    }
    return status;
}
=======
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
>>>>>>> 020bd7cc94be1ec9965bcd63fd2f36820426fab6

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
