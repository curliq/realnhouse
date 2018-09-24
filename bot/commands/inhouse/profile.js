const commando = require("discord.js-commando");
const { RichEmbed } = require('discord.js');
const fileIO = require("../../savedFiles/fileIO");
const constants = require("../../constants");
const userIsRegistered = require("../../misc/matchmaking").userIsRegistered;
class ProfileCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: "profile",
            aliases: ["p"],
            group: "inhouse",
            memberName: "profile",
            description: "Check yours (or others) stats `!profile < /womackx>"
        })
        this.users = fileIO.data.users;
    }

    getOutputFromUser(user, author) {
        return new RichEmbed()
            .setURL(constants.EMBED_LINK)
            .setTitle(user.name)
            .setColor(constants.EMBED_COLOR)
            .setFooter(`Requested by ${author.username}`, author.avatarURL)
            .addField("**Wins**", user.wins, true)
            .addField("**Losses**", user.losses, true)
            .addField("**MMR**", Math.floor(user.rating.mu *100), true);
    }

    async run(message, args) {
        if (message.channel.id === constants.CHANNEL_LEADERBOARD) {
            const searchName = args.split(" ")[0];
            if (userIsRegistered(this.users, message.author.id)) {
                if (searchName) {
                    const foundUser = this
                        .users
                        .find(user => user.name === searchName);
                    if (foundUser) {
                        message
                            .channel
                            .send(this.getOutputFromUser(foundUser, message.author))
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
                        .send(this.getOutputFromUser(foundUser, message.author))

                }
            } else {
                message
                    .channel
                    .send("Please register before using this command");
            }
        }
    }
}

module.exports = ProfileCommand