module.exports = (sequelize, Sequelize) => {
    const Housing = sequelize.define("housing", {
        code: {
            type: Sequelize.STRING
        },
        rent: {
            type: Sequelize.FLOAT
        },
        name: {
            type: Sequelize.STRING
        },
        address: {
            type: Sequelize.STRING
        },
        room: {
            type: Sequelize.INTEGER
        },
        bedroom: {
            type: Sequelize.INTEGER
        },
        surface: {
            type: Sequelize.FLOAT
        },
        details: {
            type: Sequelize.TEXT
        }
    });

    return Housing;
}