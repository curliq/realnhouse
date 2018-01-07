const commando = require("discord.js-commando");

class ProfileCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: "profile",
            group: "inhouse",
            memberName: "profile",
            description: "Check yours (or others) stats `!profile < /womackx>"
        })
    }

    async run(message, args) {
        //Search if args exists
        //Use users name if not
        message
            .channel
            .send("profile test");
    }
}

module.exports = ProfileCommand