const commando = require("discord.js-commando");
const fileIO = require("../../savedFiles/fileIO");
const userIsRegistered = require("../../misc/matchmaking").userIsRegistered;

class ProfileCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: "profile",
            group: "inhouse",
            memberName: "profile",
            description: "Check yours (or others) stats `!profile < /womackx>"
        })
        this.users = fileIO.data.users;
    }

    getOutputFromUser(user) {
        return `\`${user
            .name} ${user
            .wins} - ${user
            .losses} - ${Math
            .floor(user.rating.mu * 100)}\``
    }

    async run(message, args) {
        if (message.channel.id === "398946603362287643") {
            const searchName = args.split(" ")[0];
            if (userIsRegistered(this.users, message.author.id)) {
                if (searchName) {
                    const foundUser = this
                        .users
                        .find(user => user.name === searchName);
                    if (foundUser) {
                        message
                            .channel
                            .send(this.getOutputFromUser(foundUser))
                    } else {
                        message
                            .channel
                            .send(`No user with name \`${searchName}\``)
                    }
                } else { //do your profile
                    const foundUser = this
                        .users
                        .find(user => user.discordID === message.author.id);
                    message
                        .channel
                        .send(this.getOutputFromUser(foundUser))

                }
            } else {
                message
                    .channel
                    .send("Please register before using this command");
            }
            message.delete();
        }
    }
}

module.exports = ProfileCommand