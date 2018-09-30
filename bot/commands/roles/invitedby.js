const commando = require("discord.js-commando");
const constants = require("../../constants")

class InvitedByCommand extends commando.Command {

    constructor(client) {
        super(client, {
            name: "invitedby",
            group: "roles",
            memberName: "invitedby",
            description: "Specifies who invited you to the server and gives you base role",
            args: [
                {
                    key: "invitedby",
                    prompt: "Please specify the username of who invited you to this server, example: `!invitedby Curlicue`",
                    type: "string"
                }
            ]
        });

    }

    async run(message, args) {
        const inviterName = args.split(" ")[0];
        const role = message.guild.roles.get(constants.BASE_ROLE_ID);
        if (role !== null) {
            message.member
                .addRole(role);
        }
    }

}

module.exports = InvitedByCommand;