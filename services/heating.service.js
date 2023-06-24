const db = require("../models");

exports.findAllHeatings = async () => {
    const result = await db.heating.findAll();
    return result;
};