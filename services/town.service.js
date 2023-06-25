const db = require("../models");

exports.findAllTowns = async () => {
    const result = await db.town.findAll();
    return result;
};

exports.findOneTown = async (id) => {
    const result = await db.town.findByPk(id);
    return result;
}