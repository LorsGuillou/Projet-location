const db = require("../models");

exports.findCurrentUser = async (id) => {
    const result = await db.user.findByPk(id);
    return result;
};

exports.findAllUsers = async () => {
    const result = await db.user.findAll();
    return result;
};
