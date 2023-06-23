const db = require("../models");
const Heating = db.heating;

exports.findAllHeatings = async () => {
    return Heating.findAll({
        where: {}
    });
};