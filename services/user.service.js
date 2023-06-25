const db = require("../models");

exports.findCurrentUser = async (username) => {
    const result = await db.user.findOne({
        where: { username: username },
    });
    return result;
};

exports.findAllUsers = async () => {
    const result = await db.user.findAll();
    return result;
};
