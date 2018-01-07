const commando = require("discord.js-commando");

class RegisterCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: "register",
            group: "inhouse",
            memberName: "register",
            description: "Register yourself to play, !register <na/eu>"
        })
    }

    async run(message, args) {
        message.channel.send("register test");
    }
}

module.exports = RegisterCommand