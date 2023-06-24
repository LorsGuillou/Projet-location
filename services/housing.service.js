const db = require("../models");

exports.findOneHousing = async (id) => {
    const result = await db.housing.findByPk(id, {
        include: [db.heating, db.parking],
    });
    return result;
};

exports.findAllHousing = async () => {
    const result = await db.housing.findAll({
        include: [db.heating, db.parking],
    });
    return result;
};

exports.findAllRecent = async () => {
    const result = await db.housing.findAll({
        limit: 3,
        order: [["createdAt", "DESC"]],
        include: [db.heating, db.parking],
    });
    return result;
};
