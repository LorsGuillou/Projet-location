module.exports = (sequelize, Sequelize) => {
    const Location = sequelize.define("renting", {
        start: {
            type: Sequelize.DATEONLY
        },
        end: {
            type: Sequelize.DATEONLY
        }
    });

    return Location;
};