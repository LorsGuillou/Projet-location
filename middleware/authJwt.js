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

// isUser = (req, res, next) => {
//     User.findByPk(req.userId).then(user => {
//         user.getRoles().then(roles => {
//             for (let i = 0; i < roles.length; i++) {
//                 if (roles[i].name === "user") {
//                     next();
//                     return;
//                 }
//             }
//             req.session.message = "La page à laquelle vous avez tenter d'accéder requiert d'être connecté."
//             res.redirect("/login");
//             return;
//         });
//     });
// };

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

// isAdmin = (req, res, next) => {
//     User.findByPk(req.userId).then(user => {
//         user.getRoles().then(roles => {
//             for (let i = 0; i < roles.length; i++) {
//                 if (roles[i].name === "admin") {
//                     next();
//                     return;
//                 }
//             }
//             res.redirect("/");
//             return;
//         });
//     });
// };

const authJwt = {
    verifyToken: verifyToken,
    isUser: isUser,
    isAdmin: isAdmin,
};
module.exports = authJwt;