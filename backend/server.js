//Dependencies
const express = require("express");
const bodyParser = require("body-parser");

//Express
const app = express();
const port = process.env.port || 3000;
const router = express.Router();

//Mongo
const db = require("./config/db");
const User = require("./controller/user");
const Game = require("./controller/game");

//Middleware
//add authentication
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//Routing
app.use("/api", router);
//Game crud
router.get("/game", Game.getAll);
router.get("/game/:id", Game.get);
router.post("/game/", Game.create);
router.put("/game/:id", Game.update);
router.delete("/game/:id", Game.delete);

//User crud
router.get("/user", User.getAll);
router.get("/user/:id", User.get);
router.post("/user/", User.create);
router.put("/user/:id", User.update);
router.delete("/user/:id", User.delete);

//Run server, open browser.
app.listen(port, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Server is running on port " + port)
    }
});