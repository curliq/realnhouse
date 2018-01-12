const commando = require("discord.js-commando");
const uuidv4 = require('uuid-v4');
const trueskill = require("ts-trueskill");
const combinatorics = require("js-combinatorics");
const fileIO = require("../../savedFiles/fileIO");
const getClosestMatch = require("../../misc/matchmaking").getClosestMatch;
const discordFormatting = require("../../misc/discordFormatting");

trueskill.TrueSkill();

class ReportCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: "report",
            group: "inhouse",
            memberName: "report",
            description: "Report the results of a match !report <id> <teamA/teamB>"
        })

        this.users = fileIO.data.users;
        this.games = fileIO.data.games;
    }

    async run(message, args) {
        const formattedArgs = args.split(" ");
        if (formattedArgs[0]) { //only require teamA/B
            const winningTeam = formattedArgs[0];
            const reportedGame = this
                .games
                .find(game => game.playerIDs.includes(message.author.id))
            const reportedGameIndex = this
                .games
                .find(game => game.playerIDs.includes(message.author.id))
            const matchID = reportedGame.gameID;

            if (reportedGame) {
                if (reportedGame.playerIDs.find(id => message.author.id)) {
                    if (winningTeam.toLowerCase() === "teama") {
                        reportedGame
                            .match
                            .teamA
                            .forEach(player => player.wins += 1);
                        reportedGame
                            .match
                            .teamB
                            .forEach(player => player.losses += 1);
                        var teamARatings = reportedGame
                            .match
                            .teamA
                            .map(player => player.rating);
                        var teamBRatings = reportedGame
                            .match
                            .teamB
                            .map(player => player.rating);
                        var [teamARatings,
                            teamBRatings] = trueskill.rate([teamARatings, teamBRatings]);
                        reportedGame
                            .match
                            .teamA
                            .forEach((player, i) => player.rating = teamARatings[i]);
                        reportedGame
                            .match
                            .teamB
                            .forEach((player, i) => player.rating = teamBRatings[i]);
                        const matchPlayers = reportedGame
                            .match
                            .teamA
                            .concat(reportedGame.match.teamB);
                        // const sortedMatchPlayers
                        const output = matchPlayers.map(player => `${player.name}: ${Math.floor(100 * player.rating.mu)}`);
                        this
                            .games
                            .splice(reportedGameIndex, 1);
                        fileIO.writeUsers(this.users);
                        fileIO.writeGames(this.games);

                        message
                            .channel
                            .send(`Updated results for match ID \` ${matchID} \` with winning Team: TeamA\n Ratings after match are ${discordFormatting.jsonFormat(JSON.stringify(output, null, 4))}`);
                    } else if (winningTeam.toLowerCase() === "teamb") {
                        reportedGame
                            .match
                            .teamB
                            .forEach(player => player.wins += 1);
                        reportedGame
                            .match
                            .teamA
                            .forEach(player => player.losses += 1);
                        var teamBRatings = reportedGame
                            .match
                            .teamB
                            .map(player => player.rating);
                        var teamARatings = reportedGame
                            .match
                            .teamA
                            .map(player => player.rating);
                        var [teamBRatings,
                            teamARatings] = trueskill.rate([teamBRatings, teamARatings]);
                        reportedGame
                            .match
                            .teamB
                            .forEach((player, i) => player.rating = teamBRatings[i]);
                        reportedGame
                            .match
                            .teamA
                            .forEach((player, i) => player.rating = teamARatings[i]);

                        const matchPlayers = reportedGame
                            .match
                            .teamB
                            .concat(reportedGame.match.teamA);
                        // const sortedMatchPlayers
                        const output = matchPlayers.map(player => `${player.name}: ${Math.floor(100 * player.rating.mu)}`);
                        this
                            .games
                            .splice(reportedGameIndex, 1);
                        fileIO.writeUsers(this.users);
                        fileIO.writeGames(this.games);

                        message
                            .channel
                            .send(`Updated results for match ID \` ${matchID} \` with winning Team: TeamB\n Ratings after match are ${discordFormatting.jsonFormat(JSON.stringify(output, null, 4))}`);
                    } else {
                        message
                            .channel
                            .send(`No team found called ${winningTeam}`)
                    }
                } else {
                    message
                        .channel
                        .send("User was not in specified game");
                }

            } else {
                message
                    .channel
                    .send("No game found with that id");
            }
        } else {
            message
                .channel
                .send("Invalid command");
        }
    }
}

module.exports = ReportCommand