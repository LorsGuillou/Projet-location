module.exports = (sequelize, Sequelize) => {
    const SchoolDistance = sequelize.define("schoolDistance", {
        type: {
            type: Sequelize.FLOAT
        }
    });

    return SchoolDistance;
};