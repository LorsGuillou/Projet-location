module.exports = (sequelize, Sequelize) => {
    const Heating = sequelize.define("heating", {
        type: {
            type: Sequelize.STRING
        }
    });

    return Heating;
};