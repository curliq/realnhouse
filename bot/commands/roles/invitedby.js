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
                    key: "invitedbyuser",
                    prompt: "Please specify the username of who invited you to this server, example: `!invitedby Curlicue`",
                    type: "string"
                }
            ]
        });

    }

    async run(message, args) {
        if (message.channel.id === constants.CHANNEL_LEADERBOARD) {

            const baseRole = message.guild.roles.get(constants.BASE_ROLE_ID);

            if (baseRole !== null) {
                message.member.addRole(baseRole);
                message.reply(`Welcome to the IHL server, invited by: **${args.invitedbyuser}**`)
            }
        }
    }

}

module.exports = InvitedByCommand;