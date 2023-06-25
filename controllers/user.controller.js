const db = require("../models");
const { findCurrentUser, findAllUsers } = require("../services/user.service");
const bcrypt = require("bcryptjs");

exports.accountView = async (req, res) => {
    const username = req.session.username;
    res.render("account", {
        title: "Votre compte",
        userData: await findCurrentUser(username),
    });
};

exports.allUsersView = async (req, res) => {
    res.render("/users/all", {
        users: await findAllUsers(),
        title: "Tout les utilisateurs",
    });
};

exports.update = async (req, res) => {
    const name = req.session.username;
    const oldUser = await findCurrentUser(name);

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
