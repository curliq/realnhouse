const privateData = require("./privates.js");
const commando = require("discord.js-commando");
const fileIO = require("./savedFiles/fileIO");
//Load in from file

const client = new commando.Client({unknownCommandResponse: false, owner: privateData.ownerID});

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
    .registerDefaults();
client
    .registry
    .registerCommandsIn(__dirname + "/commands");

client.login(privateData.key);

console.log("Bot is online");
