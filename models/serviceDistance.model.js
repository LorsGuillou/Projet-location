module.exports = (sequelize, Sequelize) => {
    const ServiceDistance = sequelize.define("serviceDistance", {
        type: {
            type: Sequelize.FLOAT
        }
    });

    return ServiceDistance;
};