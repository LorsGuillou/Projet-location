const db = require("../models");
const Town = db.town;

exports.findAllTowns = async () => {
    const result = await db.town.findAll();
    return result;
};