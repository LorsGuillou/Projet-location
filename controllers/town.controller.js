const db = require("../models");
const Town = db.town;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    // Validate request
    if (!req.body.title) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a new Town object
    const town = {
        name: req.body.name,
        postalCode: req.body.postalCode
    }

    // Save Town in the database
    Town.create(town)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Town."
            });
        });
};

exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
    Town.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Towns."
            });
        });
};  

exports.findOne = (req, res) => {
    const id = req.params.id;

    Town.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Town with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message : "Error retrieving Town with id=" + id
            });
        });
};

exports.update = (req, res) => {
    const id = req.params.id;

    Town.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Town was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Town with id=${id}. Maybe Town was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Town with id=" + id
            });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;

    Town.destroy({
        where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({
                message: "Town was deleted successfully!"
            });
        } else {
            res.send({
                message: `Cannot delete Town with id=${id}. Maybe Town was not found!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Could not delete Town with id=" + id
        });
    });
};

exports.deleteAll = (req, res) => {
    Town.destroy({
        where: {},
        truncate: false
    })
    .then(nums => {
        res.send({
            message: `${nums} Towns were deleted successfully!`
        });
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while removing all Towns."
        });
    });
};

exports.findAllPublished = (req, res) => {
    Town.findAll({
        where: {}
    })
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving Towns."
        });
    });
};