const privateData = require("./privates.js");
const commando = require("discord.js-commando");
const fileIO = require("./savedFiles/fileIO");
const constants = require("./constants");
//Load in from file

const client = new commando.Client({unknownCommandResponse: false, owner: privateData.OWNER});
const log = console.log;
console.log = function (body) {
    log('[ts=' + new Date().toISOString() + '][message=' + body + ']');
};

client.on("message", (message) => {
    log(message.content + " - on " + message.channel);
}

fileIO.readUsers();
fileIO.readGames();
client
    .registry
    .registerGroup("inhouse", "Inhouse");
client
    .registry
    .registerGroup("admin", "Admin");
client
    .registry
    .registerGroup("roles", "Roles");
client
    .registry
    .registerDefaults();
client
    .registry
    .registerCommandsIn(__dirname + "/commands");
client.login(privateData.DISCORD_BOT_KEY);
log("Bot is online");

process.on('unhandledRejection', error => {
    log(error.message);
});
