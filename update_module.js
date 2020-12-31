const games = [];

module.exports.addEntry = function(game_hash, usr, clr) { 
    games.push({
        hash: game_hash, 
        user: usr,
        color: clr
    }); 
}
module.exports.removeEntry = function(game_hash, usr) {
    let game_index = games.findIndex(x => {
        x.hash === game_hash &&
        x.usr === usr
    })
    games = games.splice(game_index, 1);
}
module.exports.searchEntry = function(usr) { // NOT WORKING
    for (let i = 0; i < games.length; i++) {
        let game = games[i];
        console.log("usr ", usr);
        console.log("game usr ", game.user);
        if (usr === game.user) {return game.hash;}
    }
    console.log("ERROR, USER NOT FOUND 8:41");
}
module.exports.arr = games;