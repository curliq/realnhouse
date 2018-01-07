const User = require("../models/user").User;

exports.create = (req, res) => {
    User.create(req.body, (err, result) => {
        if (err) { return res.send(err); }
        else { return res.json(result); }
    });
};
exports.get = (req, res) => {
    User.get({ _id: req.params.id }, (err, result) => {
        if (err) { return res.send(err); }
        else { return res.json(result); }
    });
};
exports.getAll = (req, res) => {
    User.getAll((err, result) => {
        if (err) { return res.send(err); }
        else { return res.json(result); }
    });
};
exports.update = (req, res) => {
    User.updateByID(req.params.id, req.body, (err, result) => {
        if (err) { return res.send(err); }
        else { return res.json(result); }
    });
};
exports.delete = (req, res) => {
    User.removeByID({ _id: req.params.id }, (err, result) => {
        if (err) { return res.send(err); }
        else { return res.json(result); }
    });
};