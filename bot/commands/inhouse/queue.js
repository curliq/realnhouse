const commando = require("discord.js-commando");
const uuidv4 = require('uuid-v4');
const trueskill = require("ts-trueskill");
const combinatorics = require("js-combinatorics");
const lobbies = require("../../misc/lobbies");
const constants = require("../../constants");
const maps = require("../../misc/maps");
const fileIO = require("../../savedFiles/fileIO");
const getClosestMatch = require("../../misc/matchmaking").getClosestMatch;
const userIsRegistered = require("../../misc/matchmaking").userIsRegistered;

trueskill.TrueSkill();

class QueueCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: "queue",
            aliases: [
                "q", "que"
            ],
            group: "inhouse",
            memberName: "queue",
            description: "!queue will make you **join** OR **leave**, depending on if you are in or not."
        });

        this.users = fileIO.data.users;
        this.games = fileIO.data.games;
        this.queueIDs = fileIO.data.queueIDs;
        this.overflowIDs = fileIO.data.overflowIDs;
    }

    getUserActiveGame(userID) {
        let returnID = false;
        this
            .games
            .forEach(game => {
                game
                    .playerIDs
                    .forEach(playerID => {
                        if (playerID === userID) {
                            returnID = game.gameID;
                        }
                    });
            });
        return returnID;
    }

    userInQueue(userID) {
        return this
            .queueIDs
            .includes(userID) || this
            .overflowIDs
            .includes(userID);
    }

    //might not work
    getQueueDisplayNames() {
        return this
            .queueIDs
            .map(userID => this.users.find(user => user.discordID === userID).name);
    }

    //same as above
    getQueueUsers() {
        return this
            .queueIDs
            .map(userID => this.users.find(user => user.discordID === userID));
    }

    mergeOverflow() {
        if (this.queueIDs.length < 6) {
            if (this.overflowIDs.length > 0) {
                this.queueIDs = this
                    .queueIDs
                    .concat(this.overflowIDs.splice(0, 6 - this.queueIDs.length));
            }
        }
    }

    formatTeams(teams) {
        return `**TeamA**\n${teams.teamA[0]}\n${teams.teamA[1]}\n${teams.teamA[2]}\n**TeamB**\n${teams.teamB[0]}\n${teams.teamB[1]}\n${teams.teamB[2]}`;
    }

    getTagIDs(match) {
        let output = "";
        match.forEach(id => output += `<@${id}> `);
        return output;
    }

    async run(message, args) {
        if (message.channel.id === constants.CHANNEL_QUEUE) {
            if (userIsRegistered(this.users, message.author.id)) {
                const userID = message.author.id;
                const user = this
                    .users
                    .find(user => user.discordID === userID);
                // If user isnt in queue add them, or if they are X person and flag "force", for
                // testing.
                if (!this.userInQueue(userID) || message.author.id === "121630407782432769" && args === "force") {
                    const userActiveGame = this.getUserActiveGame(userID);
                    //User doesnt have a game
                    if (!userActiveGame) {
                        this.mergeOverflow();
                        if (this.queueIDs.length < 6) {
                            this
                                .queueIDs
                                .push(userID);
                            message
                                .channel
                                .send(`**${user.name}** joined the queue, Queue currently has **${this.queueIDs.length}** players`);
                            //If there is enough for a game after adding to queue
                            console.log("length is " + this.queueIDs.length)
                            if (this.queueIDs.length === 6) {
                                message
                                    .channel
                                    .send("Queue is now full, creating a match and clearing the queue");
                                const closestMatch = getClosestMatch(this.getQueueUsers());
                                const teams = {
                                    teamA: closestMatch
                                        .teamA
                                        .map(player => player.name),
                                    teamB: closestMatch
                                        .teamB
                                        .map(player => player.name)
                                };
                                //generate a game ID and add them to the game list
                                const uuid = uuidv4().substring(0, 7);
                                this
                                    .games
                                    .push({
                                        gameID: uuid,
                                        playerIDs: this
                                            .queueIDs
                                            .slice(),
                                        results: {
                                            teamA: "nothing",
                                            teamB: "nothing"
                                        },
                                        match: closestMatch
                                    });
                                this.queueIDs = [];
                                this.mergeOverflow();

                                const embed = {
                                    "title": "`Match Created`",
                                    "color": 0x50FF38,
                                    "description": "A 3v3 match has been created",
                                    "author": {
                                        "name": message.guild.name,
                                        "icon_url": "https://cdn.discordapp.com/attachments/420735220593983508/" +
                                            "493546396935389184/checkbox-marked-circle.png"
                                    },
                                    "fields": [
                                        {
                                            "name": "Players",
                                            value: this.formatTeams(teams)
                                        }, {
                                            "name": "Maps",
                                            value: maps.getMaps()
                                        }, {
                                            "name": "Lobby",
                                            value: lobbies.getLobby(uuid)
                                        }, {
                                            "name": "Reporting Instructions",
                                            value: "Please report results for the winning team using `!report win/lose`"
                                        }
                                    ]
                                }
                                message
                                    .channel
                                    .send(this.getTagIDs(this.games.find(game => game.gameID === uuid).playerIDs),
                                        {embed});
                                fileIO.writeGames(this.games);
                            }
                        } else {
                            this
                                .overflowIds
                                .push(message.user.id);
                            message
                                .channel
                                .send('Added **' + user.name + '** to overflow queue while previous match is created. ' +
                                    'You will be moved to the main queue shortly.');
                        }
                    } else {
                        message
                            .channel
                            .send('**' + user.name + '** is already in a match with ID `' + userActiveGame + '`');
                    }
                } else { //remove from queue
                    const queueID = this
                        .queueIDs
                        .findIndex(q => q === userID)
                    const overflowID = this
                        .overflowIDs
                        .findIndex(q => q === userID)
                    if (queueID !== -1 || overflowID !== -1) {
                        if (queueID !== -1) {
                            this
                                .queueIDs
                                .splice(queueID, 1);
                        }
                        if (overflowID !== -1) {
                            this
                                .overflowIds
                                .splice(overflowID, 1);
                        }
                        message
                            .channel
                            .send(`**${user.name}** left the queue, ` +
                                `Queue currently has **${this.queueIDs.length}** players`);
                    }
                }
            } else {
                message
                    .channel
                    .send("Please register before using this command");
            }
        }
    }
}

module.exports = QueueCommand