const db = require("../models");
const Op = db.Sequelize.Op;

exports.findOneDPEbyValues = async (consumption, emission) => {
    const result = await db.dpe.findOne({
        where: {
            minConsumption: {
                [Op.lte]: consumption,
            },
            maxConsumption: {
                [Op.gte]: consumption,
            },
            minEmission: {
                [Op.lte]: emission,
            },
            maxEmission: {
                [Op.gte]: emission,
            },
        },
    });
    return result;
};

exports.findOneDPEById = async (id) => {
    const result = await db.dpe.findByPk(id);
    return result;
};
