const privateData = require("./privates.js");
const commando = require("discord.js-commando");
const fileIO = require("./savedFiles/fileIO");
//Load in from file

const client = new commando.Client({unknownCommandResponse: false, owner: privateData.OWNER});
const log = console.log;
console.log = function (body) {
    log('[ts=' + new Date().toISOString() + '][message=' + body + ']');
};
//delete messages if theyre in the right channel and not from the bot
client.on("message", (message) => {
    log(message.content);
    if (message.channel.id === "398946565831655424" || message.channel.id === "398934750892392448" || message.channel.id === "398946650514522113" || message.channel.id === "398946603362287643") {
        if (message.author.id !== "398933581314916362") {
            message.delete();
        }
    }
});
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
