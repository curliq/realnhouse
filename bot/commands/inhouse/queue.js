const commando = require("discord.js-commando");
const uuidv4 = require('uuid-v4');
const trueskill = require("ts-trueskill");
const combinatorics = require("js-combinatorics");
const lobbies = require("../misc/lobbies");
const maps = require("../misc/maps");
const fileIO = require("../savedFiles/fileIO");

trueskill.TrueSkill();

class QueueCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: "queue",
            group: "inhouse",
            memberName: "queue",
            description: "Join or Leave the inhouse queue"
        });
        this.client.queueIDs = [];
        this.client.overflowIDs = [];
    }
    users = this.client.inhouseUsers;
    games = this.client.inHouseGames;
    queueIDs = this.client.queueIDs;
    overflowIDs = this.client.overflowIDs;

    getUserActiveGame = (userID) => {
        this
            .games
            .forEach(game => {
                game
                    .playerIds
                    .forEach(playerID => {
                        if (playerID === userID) {
                            return game.gameID;
                        }
                    });
            });
        return false;
    }

    userInQueue = (userID) => {
        return queueIDs.includes(userID) || overflowIDs.includes(userID);
    }
    //mmight not work
    getQueueDisplayNames = () => {
        return queueIDs.map(userID => users.find(user => user.discordID === userID).name);
    }
    //same as above
    getQueueUsers = () => {
        return queueIDs.map(userID => users.find(user => user.discordID === userID));
    }

    mergeOverflow = () => {
        if (queueIDs.length < 6) {
            if (overflowIDs.length > 0) {
                queueIDs = queueIDs.concat(overflowIDs.splice(0, 6 - queueIDs.length));
            }
        }
    }

    formatTeams = (teams) => {
        return `**TeamA**
        ${teams.teamA[0]}
${teams.teamA[1]}
${teams.teamA[2]}
**TeamB**
${teams.teamB[0]}
${teams.teamB[1]}
${teams.teamB[2]}`;
    }

    getTagIDs = (match) => {
        let output = "";
        match.forEach(id => output += `<@${id}> `);
        return output;
    }
    getClosestMatch = (players) => {
        const indices = [
            0,
            1,
            2,
            3,
            4,
            5
        ];
        const combination;
        const combinations = combinatorics.combination(indices, 3); //change this if you want more players per team
        const matchup = {
            teamA: [
                players[0], players[1], players[2]
            ],
            teamB: [
                players[3], players[4], players[5]
            ],
            quality: 0
        }
        while (combination = combinations.next()) {
            const teamA = [
                players[combination[0]],
                players[combination[1]],
                players[combination[2]]
            ]
            const teamARatings = teamA.map(playerA => playerA.rating);
            const teamBIds = _.filter(indices, function (index) {
                return combination.indexOf(index) === -1;
            });
            const teamB = [
                players[teamBIds[0]],
                players[teamBIds[1]],
                players[teamBIds[2]]
            ];
            const teamBRatings = _.map(teamB, function (playerB) {
                return playerB.rating;
            });
            const quality = trueskill.quality([teamARatings, teamBRatings])
            if (quality > matchup.quality) { // pick the match with the higest quality
                matchup.teamA = teamA;
                matchup.teamB = teamB;
                matchup.quality = quality;
            }
        }
        return matchup;
    }

    async run(message, args) {
        const formattedArgs = args.split(" ");
        if (!formattedArgs[0] && (formattedArgs[0].toLowerCase() === "join" || formattedArgs[0].toLowerCase() === "leave")) {
            message
                .channel
                .send("Please either specify if you're joining or leaving the queue.")
        } else {
            const userID = message.author.id;
            const user = this
                .users
                .find(user => user.discordID === userID);

            if (formattedArgs[0].toLowerCase() === "join") {
                //If user isnt in queue
                if (!this.userInQueue(userID)) {
                    const userActiveGame = this.getUserActiveGame(userID);
                    //User doesnt have a game
                    if (!userActiveGame) {
                        this.mergeOverflow();
                        if (queueIDs.length < 6) {
                            this
                                .queueIDs
                                .push(userID);
                            message
                                .channel
                                .send(`Added ${user.name} to queue, Queue currently has ${this.queueIDs.length} players`);
                            //If there is enough for a game after adding to queue
                            if (this.queueIDs.length === 6) {
                                message
                                    .channel
                                    .send("Queue is now full, creating a match and clearing the queue");
                                const closestMatch = this.getClosestMatch(getQueueUsers);
                                const teams = {
                                    teamA: this
                                        .closestMatch
                                        .teamA
                                        .map(player => player.name),
                                    teamB: this
                                        .closestMatch
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
                                        "icon_url": message.guild.icon_url
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
                                            value: "Please report results for the winning team using `!report" + uuid + " <teamA/teamB>`"
                                        }
                                    ]

                                }
                                message
                                    .channel
                                    .send(this.getTagIDs(games.find(game => game.gameID === uuid).playerIDs), {embed});
                                fileIO.writeGames(this.games);
                            }
                        } else {
                            console.log('Adding user ' + message.user.id + ' to overflow queue while previous match is created. You will be moved to the mai' +
                                    'n queue shortly.');
                            overflowIds.push(message.user.id);
                            message
                                .channel
                                .send('Added ' + user.name + ' to overflow queue while previous match is created. You will be moved to the mai' +
                                        'n queue shortly.');
                        }
                    } else {
                        message
                            .channel
                            .send(user.name + ' is already in a match with ID `' + userActiveGame + '`');
                    }
                } else {
                    message
                        .channel
                        .send(user.name + ' is already in queue');
                }
            }//leave
            else{
                const queueID = queueIDs.findIndex(q=>q===userID)
                const overflowID = overflowIDs.findIndex(q=>q===userID)
                if(queueID !== -1 || overflowID !== -1){
                    if(queueID !== -1){
                        queueIDs.splice(queueID,1);
                    }
                    if(overflowID !== -1){
                        overflowIds.splice(overflowID,1);
                    }

                    message.channel.send(`${user.name} has been removed from the que, there are ${queueIDs.length} remaining in queue`);

                }

            }
        }
    }
}

module.exports = QueueCommand