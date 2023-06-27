const db = require("../models");
const Op = db.Sequelize.Op;

exports.findAllStays = async () => {
    const result = await db.renting.findAll();
    return result;
};

exports.findOneStay = async (id) => {
    const result = await db.renting.findByPk(id);
    return result;
};

exports.findUserStays = async (id) => {
    const result = await db.renting.findAll({
        where: {
            userId: id,
        },
    });
    return result;
};

exports.compareStays = async (housingId, start, end) => {
    const result = await db.renting.findOne({
        where: {
            housingId: housingId,
            [Op.or]: [
                {
                    start: { [Op.between]: [start, end], },
                },
                {
                    end: { [Op.between]: [start, end], },
                },
            ],
        },
    });
    return result;
};
