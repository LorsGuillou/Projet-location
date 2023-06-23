const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

verifyToken = (req, res, next) => {
    let token = req.session.token;

    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized!"
            });
        }
        req.userId = decoded.id;
        next();
    });
};

isUser = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userId);
        const roles = await user.getRoles();

        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === "user") {
                return next();
            }
        }

        req.session.message = "La page à laquelle vous avez tenter d'accéder requiert d'être connecté."
        return res.redirect("/login");
    } catch (error) {
        return res.status(500).send({
            message: "Unable to validate User role!",
        });
    }
};

isAdmin = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userId);
        const roles = await user.getRoles();

        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === "admin") {
                return next();
            }
        }

        return res.redirect("/");
    } catch (error) {
        return res.status(500).send({
            message: "Unable to validate User role!",
        });
    }
};

const authJwt = {
    verifyToken: verifyToken,
    isUser: isUser,
    isAdmin: isAdmin,
};
module.exports = authJwt;