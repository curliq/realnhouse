//Dependencies
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Schema
const userSchema = new Schema({
    discordID: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    region: {
        type: String,
        required: true
    },
    mu: {
        type: Number,
        required: true
    },
    sigma: {
        type: Number,
        required: true
    },
    wins: {
        type: Number,
        required: true
    },
    losses: {
        type: Number,
        required: true
    }
});

//CRUD Requests
userSchema.statics = {
    get: function (query, callback) {
        this.findOne(query, callback);
    },
    getAll: function (callback) {
        this.find(callback);
    },
    updateByID: function (id, updateData, callback) {
        this.findOneAndUpdate({
            discordID: id
        }, updateData, callback);
    },
    removeByID: function (removeData, callback) {
        this.remove(removeData, callback);
    },
    create: function (data, callback) {
        this.find({
            discordID: data.discordID
        }, (err, docs) => {
            if (docs.length) {
                callback(`${data.discordID} already is registered`)
            } else {
                const user = {
                    name: data.name,
                    discordID: data.discordID,
                    mu: 25,
                    sigma: 1.618,
                    wins: 0,
                    losses: 0,
                    region: data.region
                }
                const userToSave = new this(user);
                userToSave.save(callback);
            }
        });
    }
}

//Exports
const user = mongoose.model("user", userSchema);
module.exports = {
    User: user
};
