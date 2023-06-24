const db = require("../models");
const Dpe = db.dpe;
const Op = db.Sequelize.Op;

exports.findOneDPEbyValues = async (consumption, emission) => {
    return Dpe.findOne({
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
}

exports.findOneDPEId = async (id) => {
    return Dpe.findByPk(id);
}