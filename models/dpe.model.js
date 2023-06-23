module.exports = (sequelize, Sequelize) => {
    const Dpe = sequelize.define("dpe", {
        minConsumption: {
            type: Sequelize.FLOAT
        },
        maxConsumption: {
            type: Sequelize.FLOAT
        },
        minEmission: {
            type: Sequelize.FLOAT
        },
        maxEmission: {
            type: Sequelize.FLOAT
        },
        class: {
            type: Sequelize.STRING
        }
    });

    return Dpe;
};