const games = [];

module.exports.addEntry = function(game_hash, usr, clr) { games.push({hash: game_hash,user: usr,color: clr}); }
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