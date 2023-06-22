module.exports = (sequelize, Sequelize) => {
    const Town = sequelize.define("towns", {
        name: {
            type: Sequelize.STRING
        },
        postalCode: {
            type: Sequelize.INTEGER
        }
    });

    return Town;
};