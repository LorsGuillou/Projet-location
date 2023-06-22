module.exports = (sequelize, Sequelize) => {
    const Service = sequelize.define("services", {
        name: {
            type: Sequelize.STRING
        },
        address: {
            type: Sequelize.STRING
        },
        type: {
            type: Sequelize.STRING
        }
    });

    return Service;
};