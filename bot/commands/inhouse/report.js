const commando = require("discord.js-commando");
const uuidv4 = require('uuid-v4');
const trueskill = require("ts-trueskill");
const combinatorics = require("js-combinatorics");
const constants = require("../../constants");
const fileIO = require("../../savedFiles/fileIO");
const getClosestMatch = require("../../misc/matchmaking").getClosestMatch;
const discordFormatting = require("../../misc/discordFormatting");
const lobbies = require("../../misc/lobbies");

trueskill.TrueSkill();

class ReportCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: "report",
            aliases: ["r"],
            group: "inhouse",
            memberName: "report",
            description: "Report the results of a match !report win/lose",
            args: [
                {
                    key: "result",
                    prompt: "Please type the result of your match (From your perspective) <win/lose>",
                    type: "string"
                }
            ]
        })
        this.users = fileIO.data.users;
        this.games = fileIO.data.games;
    }

    async run(message, args) {
        if (message.channel.id === constants.CHANNEL_MATCH_RESULTS) {
            const userID = message.author.id;
            if (args.result) { //only require teamA/B
                const winOrLose = args
                    .result
                    .toLowerCase();
                const reportedGame = this
                    .games
                    .find(game => game.playerIDs.includes(userID))
                const reportedGameIndex = this
                    .games
                    .findIndex(game => game.playerIDs.includes(userID))

                if (reportedGame) {
                    if (reportedGame.playerIDs.find(id => id === userID)) {
                        const matchID = reportedGame.gameID;
                        let winningTeam = "undecided";
                        let playersTeam = "dunnoyet";
                        if (reportedGame.match.teamA.find(player => player.discordID === userID)) {
                            playersTeam = "teamA"
                        } else {
                            playersTeam = "teamB"
                        }
                        if (winOrLose === "win" || winOrLose === "won") {
                            reportedGame.results[playersTeam] = "won";
                        } else if (winOrLose === "lose" || winOrLose === "lost" || winOrLose === "loss") {
                            reportedGame.results[playersTeam] = "lost";
                        }
                        //Then check if its right, so one team should have one, one lost etc.
                        if (reportedGame.results.teamA === "lost" & reportedGame.results.teamB === "won") {
                            winningTeam = "teamb";
                        } else if (reportedGame.results.teamA === "won" & reportedGame.results.teamB === "lost") {
                            winningTeam = "teama";
                        }
                        //if winning team has been set then it'll go ahead
                        if (reportedGame.results.teamA !== "nothing" && reportedGame.results.teamB !== "nothing" && winningTeam === "undecided") {
                            message
                                .channel
                                .send(`Current status of game report:\n\`TeamA: ${reportedGame.results.teamA}\nTeamB: ${reportedGame.results.teamB}\``)
                        }
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
                            lobbies.unsetLobby(reportedGame.gameID);
                            fileIO.writeUsers(this.users);
                            fileIO.writeGames(this.games);
                            message
                                .channel
                                .send(`Updated results for match ID \` ${matchID} \` with winning Team: TeamB\n Ratings after match are ${discordFormatting.jsonFormat(JSON.stringify(output, null, 4))}`);
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
            message.delete();
        }
    }
}

module.exports = ReportCommand