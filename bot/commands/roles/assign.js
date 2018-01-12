const commando = require("discord.js-commando");

class AssignRoleCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: "assign",
            group: "roles",
            memberName: "assign",
            description: "Assigns a specific role",
            args: [
                {
                    key: "role",
                    prompt: "Please specify a role you would like to assign",
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
        if (role !== null && !message.member.roles.has(role.id)) {
            message
                .member
                .addRole(role);
        }
    }
}

module.exports = AssignRoleCommand;