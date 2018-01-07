const commando = require("discord.js-commando");
const fileIO = require("../../fileIO");

const trueskill = require("ts-trueskill");
trueskill.TrueSkill();

class RegisterCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: "register",
            group: "inhouse",
            memberName: "register",
            description: "Register yourself to play, !register <name> <na/eu>"
        })
    }

    async run(message, args) {
        const formattedArgs = args.split(" ");
        if (message.channel.id == '325760309996290048') {
            if (!formattedArgs[0]) {
                message
                    .channel
                    .send("Please provide a username to register with, which should be your Battlerite name");
            }
            if (!formattedArgs[1] && (formattedArgs[1].toUpperCase() !== "NA" || formattedArgs[1].toUpperCase() !== "EU")) {
                message
                    .channel
                    .send("Please provide a region. !register <EU/NA>");
            } else {
                const users = this.client.inhouseUsers;
                const discordID = message.author.id;
                const name = formattedArgs[0].trim();
                const region = formattedArgs[1].toUpperCase();
                if (!users.find(u => u.discordID === discordID)) {
                    const newUser = {
                        discordID,
                        name,
                        region,
                        rating: new trueskill.Rating(25, 1.618),
                        wins: 0,
                        losses: 0
                    }
                    users.push(newUser);
                    message
                        .channel
                        .send(`Registered ${name} in ${region}`)
                    fileIO.writeUsers(this.client.inhouseUsers);
                } else {
                    message
                        .channel
                        .send(`${name} is already registered.`);
                }
            }
        }
    }
}

module.exports = RegisterCommand