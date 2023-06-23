module.exports = (sequelize, Sequelize) => {
    const ServiceDistance = sequelize.define("service_distance", {
        type: {
            type: Sequelize.FLOAT
        }
    });

    return ServiceDistance;
};