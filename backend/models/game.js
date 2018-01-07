//Dependencies
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Schema
const gameSchema = new Schema({
    gameID: {
        type: String,
        required: true
    },
    players: {
        type: [String],
        required: true
    }
});

//CRUD Requests
gameSchema.statics = {
    get: function (query, callback) {
        this.findOne(query, callback);
    },
    getAll: function (callback) {
        this.find(callback);
    },
    updateByID: function (id, updateData, callback) {
        this.findOneAndUpdate({
            gameID: id
        }, updateData, callback);
    },
    removeByID: function (removeData, callback) {
        this.remove(removeData, callback);
    },
    create: function (data, callback) {
        const game = new this(data);
        game.save(callback);
    }
}

//Exports
const game = mongoose.model("game", gameSchema);
module.exports = {
    Game: game
};