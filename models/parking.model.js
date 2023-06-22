module.exports = (sequelize, Sequelize) => {
    const Parking = sequelize.define("parking", {
        type: {
            type: Sequelize.STRING
        }
    });

    return Parking;
};