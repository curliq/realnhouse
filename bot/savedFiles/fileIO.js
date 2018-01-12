const usersSeed = require('./users.json');
const gamesSeed = require('./games.json');
const userPath = __dirname + "/users.json"
const gamePath = __dirname + "/games.json"
const fs = require("fs");
const trueskill = require("ts-trueskill");
const getClosestMatch = require("../misc/matchmaking").getClosestMatch;
trueskill.TrueSkill();

const users = [];
const games = [];

exports.data = {
    users,
    games,
    queueIDs: [],
    overflowIDs: []
}

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
    fs.writeFile(userPath, JSON.stringify(tmpUsers, null, 2), (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Saved successfully" + __dirname);
        }
    });
}
exports.readUsers = () => {
    users.length = 0;
    usersSeed.forEach(user => {
        users.push({
            discordID: user.discordID,
            name: user.name,
            rating: new trueskill.Rating(user.mu, user.sigma),
            wins: user.wins,
            losses: user.losses,
            region: user.region
        });
    });
}

exports.writeGames = () => {
    const tmpGames = [];
    games.forEach(game => {
        const tmpGame = {
            gameID: game.gameID,
            results: {
                winA: 0,
                winB: 0
            }
        }
        if (game.playerIDs) {
            tmpGame.playerIDs = game.playerIDs;
        }
        tmpGames.push(tmpGame);
    });
    fs.writeFile(gamePath, JSON.stringify(tmpGames, null, 4), [], function (err) {
        if (err) {
            return console.log(err);
        } else {
            console.log(gamePath + ' was saved');
        }
    });
}

exports.readGames = () => {
    games.length = 0;
    gamesSeed.forEach(game => {
        const players = game
            .playerIDs
            .map(playerID => users.find(user => user.discordID === playerID));
        if (game.playerIDs.length === 6) {
            game.match = getClosestMatch(players);
        }
        games.push(game);
    });
}