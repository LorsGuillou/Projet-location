const db = require("../models");
const { findAllHeatings } = require("../services/heating.services");
const Housing = db.housing;
const Op = db.Sequelize.Op;

exports.createView = async (req, res) => {
    res.render("addHousing", {
        title: "Créer une nouvelle location",
        heatings: await findAllHeatings(),
        message: req.query.message
    });
};

exports.create = async (req, res) => {
    // Validate request
    // if (!req.body.name) {
    //     res.status(400).send({
    //         message: "Content can not be empty!",
    //     });
    //     return;
    // }

    // Create a new housing object

    const heatings = req.body.heatings;

    const housing = {
        name: req.body.name,
        code: req.body.code,
        rent: req.body.rent,
        address: req.body.address,
        room: req.body.room,
        bedroom: req.body.bedroom,
        bathroom: req.body.bathroom,
        surface: req.body.surface,
        consumption: req.body.consumption,
        emission: req.body.emission,
        details: req.body.details,
    };

    // Save Housing in the database
    const createdHousing = await Housing.create(housing);
    await createdHousing.addHeatings(heatings);
    return res.redirect("/housing/create?message=bravo");
};

exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
    Housing.findAll({ where: condition })
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving housings.",
            });
        });
};

exports.findOne = (req, res) => {
    const id = req.params.id;

    Housing.findByPk(id)
        .then((data) => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Housing with id=${id}.`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Error retrieving Housing with id=" + id,
            });
        });
};

exports.update = (req, res) => {
    const id = req.params.id;

    Housing.update(req.body, {
        where: { id: id },
    })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: "Housing was updated successfully.",
                });
            } else {
                res.send({
                    message: `Cannot update Housing with id=${id}. Maybe Housing was not found or req.body is empty!`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Error updating Housing with id=" + id,
            });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;

    Housing.destroy({
        where: { id: id },
    })
        .then((num) => {
            if (num == 1) {
                res.send({
                    message: "Housing was deleted successfully!",
                });
            } else {
                res.send({
                    message: `Cannot delete Housing with id=${id}. Maybe Housing was not found!`,
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Could not delete Housing with id=" + id,
            });
        });
};

exports.deleteAll = (req, res) => {
    Housing.destroy({
        where: {},
        truncate: false,
    })
        .then((nums) => {
            res.send({
                message: `${nums} Housings were deleted successfully!`,
            });
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all housings.",
            });
        });
};



exports.findAllPublished = (req, res) => {
    Housing.findAll({
        where: {},
        include: [db.heating]
    })
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving housings.",
            });
        });
};
