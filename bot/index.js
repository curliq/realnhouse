const privateData = require("./privates.js");
const commando = require("discord.js-commando");
const fileIO = require("./savedFiles/fileIO");

const client = new commando.Client({unknownCommandResponse: false, owner: privateData.ownerID});
client
    .registry
    .registerGroup("inhouse", "Inhouse");
client
    .registry
    .registerGroup("admin", "Admin");
client
    .registry
    .registerDefaults();
client
    .registry
    .registerCommandsIn(__dirname + "/commands");

client.login(privateData.key);

//Load in from file
client.inhouseUsers = fileIO.readUsers();
client.inhouseGames = fileIO.readGames();

console.log("Bot is online");
