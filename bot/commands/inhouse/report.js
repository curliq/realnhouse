const commando = require("discord.js-commando");
const uuidv4 = require('uuid-v4');
const trueskill = require("ts-trueskill");
const combinatorics = require("js-combinatorics");
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
        if (message.channel.id === "443051872610156549") {
            const userID = message.author.id;
            if (args.result) {
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
                        let playersTeam = "dunnoyet";

                        if (reportedGame.match.teamA.find(player => player.discordID === userID)) {
                            playersTeam = "teamA"
                        } else if (reportedGame.match.teamB.find(player => player.discordID === userID)) {
                            playersTeam = "teamB"
                        }
                        else if (reportedGame.match.teamC.find(player => player.discordID === userID)) {
                            playersTeam = "teamC"
                        }
                        else if (reportedGame.match.teamD.find(player => player.discordID === userID)) {
                            playersTeam = "teamD"
                        }
                        else if (reportedGame.match.teamE.find(player => player.discordID === userID)) {
                            playersTeam = "teamE"
                        }
                        else if (reportedGame.match.teamF.find(player => player.discordID === userID)) {
                            playersTeam = "teamF"
                        }
                        else if (reportedGame.match.teamG.find(player => player.discordID === userID)) {
                            playersTeam = "teamG"
                        }
                        else if (reportedGame.match.teamH.find(player => player.discordID === userID)) {
                            playersTeam = "teamH"
                        }
                        else if (reportedGame.match.teamI.find(player => player.discordID === userID)) {
                            playersTeam = "teamI"
                        }
                        else if (reportedGame.match.teamJ.find(player => player.discordID === userID)) {
                            playersTeam = "teamJ"
                        }
                        const teamNames = ["teamA", "teamB", "teamC", "teamD", "teamE", "teamF", "teamG", "teamH", "teamI", "teamJ",]
                        if (winOrLose === "win" || winOrLose === "won") {
                            for (let i = 0; i < teamNames.length; i++) {
                                if (teamNames[i] === playersTeam) {
                                    reportedGame.match[teamNames[i]][0].wins += 1;
                                } else {
                                    reportedGame.match[teamNames[i]][0].losses += 1;
                                }
                            }
                            this
                                .games
                                .splice(reportedGameIndex, 1);
                            fileIO.writeUsers(this.users);
                            fileIO.writeGames(this.games);
                            message
                                .channel
                                .send(`Updated results for match ID \` ${matchID} \` With ${message.author.username} winning\n`);
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