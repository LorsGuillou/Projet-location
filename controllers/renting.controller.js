const db = require("../models");
const { findOneHousing } = require("../services/housing.service");
const { findOneStay, compareStays } = require("../services/renting.service");
const { findCurrentUser } = require("../services/user.service");
const Location = db.location;
const Op = db.Sequelize.Op;

exports.create = async (req, res) => {
    try {
        const renting = {
            start: req.body.start,
            end: req.body.end,
            userId: req.session.userId,
            housingId: req.params.id,
        };

        const comparison = await compareStays(renting.housingId, renting.start, renting.end);

        if (comparison != null) {
            req.session.alert = "Un séjour existe déjà sur cette période, veuillez changer les dates saisies.";
            return res.redirect("/location/" + req.params.id);
        }

        if (renting.start > renting.end) {
            req.session.alert =
                "Votre arrivée prévu est une date plus avancée que votre départ, veuillez changer les dates saisies.";
            return res.redirect("/location/" + req.params.id);
        }
        await db.sequelize.transaction(async (transaction) => {
            await db.renting.create(renting, { transaction });
        });
        req.session.alert = "Séjour enregistré.";
        return res.redirect("/location/" + req.params.id);
    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
};

exports.update = async (req, res) => {
    try {
        const oldStay = await findOneStay(req.params.id);

        const newStay = {
            start: req.body.start,
            end: req.body.end,
            status: "En attente",
        };

        const comparison = await compareStays(oldStay.housingId, renting.start, renting.end);

        if (comparison != null) {
            req.session.alert = "Un séjour existe déjà sur cette période, veuillez changer les dates saisies.";
            return res.redirect("/account/location/" + req.params.id);
        }

        if (newStay.start > newStay.end) {
            req.session.alert =
                "Votre arrivée prévu est une date plus avancée que votre départ, veuillez changer les dates saisies.";
            return res.redirect("/account/location/" + req.params.id);
        }

        await db.sequelize.transaction(async (transaction) => {
            await oldStay.update(newStay, { transaction });
        });
        req.session.alert = "Votre séjour a bien été enregistré.";
        return res.redirect("/location/" + req.params.id);
    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
};

exports.delete = (req, res) => {
    const id = req.params.id;

    Location.destroy({
        where: { id: id },
    })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: "Location was deleted successfully!",
                });
            } else {
                res.send({
                    message: `Cannot delete Location with id=${id}. Maybe Location was not found!`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Could not delete Location with id=" + id,
            });
        });
};

exports.deleteAll = (req, res) => {
    Location.destroy({
        where: {},
        truncate: false,
    })
        .then((nums) => {
            res.send({
                message: `${nums} Locations were deleted successfully!`,
            });
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all Locations.",
            });
        });
};

exports.findAllPublished = (req, res) => {
    Location.findAll({
        where: {},
    })
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Locations.",
            });
        });
};
