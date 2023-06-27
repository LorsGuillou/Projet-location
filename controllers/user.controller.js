const db = require("../models");
const { findCurrentUser, findAllUsers } = require("../services/user.service");
const bcrypt = require("bcryptjs");

exports.accountView = async (req, res) => {
    res.render("account", {
        title: "Votre compte",
        userData: await findCurrentUser(req.session.userId),
    });
};

exports.allUsersView = async (req, res) => {
    res.render("allUsers", {
        users: await findAllUsers(),
        title: "Tout les utilisateurs",
    });
};

exports.update = async (req, res) => {
    const oldUser = await findCurrentUser(req.session.userId);

    const updatedUser = {
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
    };

    await db.sequelize.transaction(async (transaction) => {
        await oldUser.update(updatedUser, { transaction });
    });
    return res.redirect("/account");
};

exports.deleteUser = async (req, res) => {
    const id = req.params.id;
    await db.sequelize.transaction(async (transaction) => {
        await db.user.destroy({ where: { id: id } }, { transaction });
    });
    res.redirect("/db.users/all");
};
