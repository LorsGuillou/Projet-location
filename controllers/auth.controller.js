const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
    // Save User to Database
    User.create({
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8)
        })
        .then(user => {
            if (req.body.roles) {
                Role.findAll({
                    where: {
                        name: {
                            [Op.or]: req.body.roles
                        }
                    }
                }).then(roles => {
                    user.setRoles(roles).then(() => {
                        req.session.message = "Votre compte a été créé ! Vous pouvez maintenant vous connecter !"
                        res.redirect("/login");
                    });
                });
            } else {
                // user role = 1
                user.setRoles([1]).then(() => {
                    req.session.message = "Votre compte a été créé ! Vous pouvez maintenant vous connecter !";
                    res.redirect("/login");   
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

exports.signin = (req, res) => {
    User.findOne({
            where: {
                email: req.body.email
            }
        })
        .then(user => {
            if (!user) {
                req.session.message = "Les identifiants fournis ne correspondent à aucun utilisateur.";
                return res.redirect("/login");
            }

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                req.session.message = "Mot de passe incorrect.";
                return res.redirect("/login");
            }

            var token = jwt.sign({
                id: user.id
            }, config.secret, {
                expiresIn: 86400 // 24 hours
            });

            var authorities = [];
            user.getRoles().then(roles => {
                for (let i = 0; i < roles.length; i++) {
                    authorities.push("ROLE_" + roles[i].name.toUpperCase());
                }
                req.session.id = user.id;
                req.session.username = user.username;
                req.session.email = user.email;
                req.session.roles = authorities;
                req.session.token = token;
                return res.redirect("/account");
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
};

exports.signout = (req, res) => {
    req.session.destroy();
    res.redirect("/");
};