const commando = require("discord.js-commando");

class LeaderboardCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: "leaderboard",
            group: "inhouse",
            memberName: "leaderboard",
            description: "Check the top 15 players"
        })
    }

    async run(message) {
        message.channel.send("leaderboard test");
    }
}

module.exports = LeaderboardCommand