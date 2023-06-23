module.exports = (sequelize, Sequelize) => {
    const SchoolDistance = sequelize.define("school_distance", {
        type: {
            type: Sequelize.FLOAT
        }
    });

    return SchoolDistance;
};