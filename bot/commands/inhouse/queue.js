const commando = require("discord.js-commando");

class QueueCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: "queue",
            group: "inhouse",
            memberName: "queue",
            description: "Join the inhouse queue"
        })
    }

    async run(message, args) {
        message.channel.send("queue test");
    }
}

module.exports = QueueCommand