//Dependencies
const mongoose = require("mongoose");

//Connect to DB
mongoose.connect("mongodb://localhost/inhouse");
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));

db.once("open", () => {
    console.log("Connection with database succeeded.");
});

exports.db = db;