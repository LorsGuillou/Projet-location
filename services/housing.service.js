const db = require("../models");


exports.findOneHousing = async (id) => {
    return db.housing.findByPk(id, {
        include: [db.heating, db.parking],
    });
};

exports.findAllHousing = async () => {
    return db.housing.findAll({
        where: {},
        include: [db.heating, db.parking],
    });
};