module.exports = (sequelize, Sequelize) => {
    const Location = sequelize.define("location", {
        start: {
            type: Sequelize.DATEONLY
        },
        end: {
            type: Sequelize.DATEONLY
        }
    });

    return Location;
};