const privateData = require("./privates.js");
const commando = require("discord.js-commando");
const bot = new commando.Client({unknownCommandResponse: false, owner: privateData.ownerID});

bot
    .registry
    .registerGroup("inhouse", "Inhouse");
bot
    .registry
    .registerGroup("admin", "Admin");
bot
    .registry
    .registerDefaults();
bot
    .registry
    .registerCommandsIn(__dirname + "/commands");

bot.login(privateData.key);

console.log("Bot is online");
