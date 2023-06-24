const db = require("../models");
const Town = db.town;

exports.findAllTowns = async () => {
    return Town.findAll({
        where: {}
    });
};