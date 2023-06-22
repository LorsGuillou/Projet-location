const db = require("../models");
const Parking = db.parking;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    // Validate request
    if (!req.body.title) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a new Parking object
    const parking = {
        type: req.body.type
    }

    // Save Parking in the database
    Parking.create(parking)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Parking."
            });
        });
};

exports.findAll = (req, res) => {
    const type = req.query.type;
    var condition = name ? { type: { [Op.like]: `%${type}%` } } : null;
    Parking.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Parkings."
            });
        });
};  

exports.findOne = (req, res) => {
    const id = req.params.id;

    Parking.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Parking with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message : "Error retrieving Parking with id=" + id
            });
        });
};

exports.update = (req, res) => {
    const id = req.params.id;

    Parking.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Parking was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Parking with id=${id}. Maybe Parking was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Parking with id=" + id
            });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;

    Parking.destroy({
        where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({
                message: "Parking was deleted successfully!"
            });
        } else {
            res.send({
                message: `Cannot delete Parking with id=${id}. Maybe Parking was not found!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Could not delete Parking with id=" + id
        });
    });
};

exports.deleteAll = (req, res) => {
    Parking.destroy({
        where: {},
        truncate: false
    })
    .then(nums => {
        res.send({
            message: `${nums} Parkings were deleted successfully!`
        });
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while removing all Parkings."
        });
    });
};

exports.findAllPublished = (req, res) => {
    Parking.findAll({
        where: {}
    })
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving Parkings."
        });
    });
};