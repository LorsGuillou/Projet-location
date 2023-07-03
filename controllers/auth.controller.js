const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;B

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
    // Save User to Database
    try {
        const user = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
        });

        const result = await user.setRoles([1]);
        if (result) {
            req.session.message = "Votre compte a été créé ! Vous pouvez maintenant vous connecter !";
            return res.redirect("/login");
        }
    } catch (error) {
        req.session.message = error;
        return res.redirect("/login");
    }
};

exports.signin = async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                email: req.body.email,
            },
        });

        if (!user) {
            req.session.message = "Les identifiants fournis ne correspondent à aucun utilisateur.";
            return res.redirect("/login");
        }

        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

        if (!passwordIsValid) {
            req.session.message = "Mot de passe incorrect.";
            return res.redirect("/login");
        }

        const token = jwt.sign(
            {
                id: user.id,
            },
            config.secret,
            {
                algorithm: "HS256",
                expiresIn: 86400, // 24 hours
            }
        );

        let authorities = [];
        const roles = await user.getRoles();
        for (let i = 0; i < roles.length; i++) {
            authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }

        req.session.token = token;
        req.session.userId = user.id;
        req.session.username = user.username;
        req.session.email = user.email;
        req.session.roles = authorities;
        return res.redirect("/account");
    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
};

exports.signout = async (req, res) => {
    try {
        req.session.destroy();
        return res.redirect("/");
    } catch (err) {
        this.next(err);
    }
};
