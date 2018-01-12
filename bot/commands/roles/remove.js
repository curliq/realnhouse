const commando = require("discord.js-commando");

class RemoveRoleCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: "remove",
            group: "roles",
            memberName: "remove",
            description: "Removes a specific role",
            args: [
                {
                    key: "role",
                    prompt: "Please specify a role you would like to remove",
                    type: "string"
                }
            ]
        });

    }

    async run(message, args) {
        const role = message
            .guild
            .roles
            .find((role) => role.name.toLowerCase() === args.role.toLowerCase());
        if (role !== null && message.member.roles.has(role.id)) {
            message
                .member
                .removeRole(role)
                .catch();
        }
    }
}

module.exports = RemoveRoleCommand;