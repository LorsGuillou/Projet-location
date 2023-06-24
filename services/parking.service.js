const db = require("../models");
const Parking = db.parking;

exports.findAllParkings = async () => {
    return Parking.findAll({
        where: {}
    });
};