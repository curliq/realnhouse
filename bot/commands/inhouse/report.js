const commando = require("discord.js-commando");

class ReportCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: "report",
            group: "inhouse",
            memberName: "report",
            description: "Report the results of a match !report <id> <teamA/teamB>"
        })
    }

    async run(message, args) {
        message.channel.send("report test");
    }
}

module.exports = ReportCommand