module.exports = (sequelize, Sequelize) => {
    const Dpe = sequelize.define("dpe", {
        consumption: {
            type: Sequelize.FLOAT
        },
        emission: {
            type: Sequelize.FLOAT
        },
        note: {
            type: Sequelize.STRING
        }
    });

    return Dpe;
};