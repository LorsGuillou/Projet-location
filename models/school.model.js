module.exports = (sequelize, Sequelize) => {
    const School = sequelize.define("schools", {
        name: {
            type: Sequelize.STRING
        },
        address: {
            type: Sequelize.STRING
        },
        level: {
            type: Sequelize.STRING
        }
    });

    return School;
};