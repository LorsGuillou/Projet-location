const db = require("../models");

exports.findAllParkings = async () => {
    const result = await db.parking.findAll();
    return result;
};