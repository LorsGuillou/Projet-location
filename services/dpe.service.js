const db = require("../models");
const Dpe = db.dpe;
const Op = db.Sequelize.Op;

exports.findOneDPEbyValues = async (consumption, emission) => {
    const result = await Dpe.findOne({
        where: {
            minConsumption: {
                [Op.lte]: consumption
            },
            maxConsumption: {
                [Op.gte]: consumption
            },
            minEmission: {
                [Op.lte]: emission
            },
            maxEmission: {
                [Op.gte]: emission
            }
        }
    });
    return result;
}

exports.findOneDPEId = async (id) => {
    const result = await Dpe.findByPk(id);
    return result;
}