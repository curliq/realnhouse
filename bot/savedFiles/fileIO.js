const usersSeed = require('./users.json');
const gamesSeed = require('./games.json');
const fs = require("fs");
const trueskill = require("ts-trueskill");
trueskill.TrueSkill();

exports.writeUsers = (users) => {
    const tmpUsers = users.map(user => {
        return {
            discordID: user.discordID,
            name: user.name,
            sigma: user.rating.sigma,
            mu: user.rating.mu,
            wins: user.wins,
            losses: user.losses,
            region: user.region
        }
    });
    fs.writeFile("./users.json", JSON.stringify(tmpUsers, null, 2), (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Saved successfully");
        }
    });
}
exports.readUsers = () => {
    return usersSeed.map(user => {
        return {
            discordID: user.discordID,
            name: user.name,
            rating: new trueskill.Rating(user.mu, user.sigma),
            wins: user.wins,
            losses: user.losses,
            region: user.region
        }
    });
}

exports.writeGames = (games) => {

       /*  var tmp = {};
        _.each(games, function (game, key) {
            tmp[key] = {};
            if (game.playerIds) {
                tmp[key].playerIds = game.playerIds;
            }
        });
        fs.writeFile(outputGames, JSON.stringify(tmp, null, 4), [], function (err) {
            if (err) {
                return console.log(err);
            } else {
                console.log(outputGames + ' was saved');
            }
        });*/
}

exports.readGames = () => {

 
    return []
}