const Game = require("../models/game").Game;

exports.create = (req, res) => {
    Game.create(req.body, (err, result) => {
        if (err) { return res.send(err); }
        else { return res.json(result); }
    });
};
exports.get = (req, res) => {
    Game.get({ _id: req.params.id }, (err, result) => {
        if (err) { return res.send(err); }
        else { return res.json(result); }
    });
};
exports.getAll = (req, res) => {
    Game.getAll((err, result) => {
        if (err) { return res.send(err); }
        else { return res.json(result); }
    });
};
exports.update = (req, res) => {
    Game.updateByID(req.params.id, req.body, (err, result) => {
        if (err) { return res.send(err); }
        else { return res.json(result); }
    });
};
exports.delete = (req, res) => {
    Game.removeByID({ _id: req.params.id }, (err, result) => {
        if (err) { return res.send(err); }
        else { return res.json(result); }
    });
};