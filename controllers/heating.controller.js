const db = require("../models");
const Heating = db.heating;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    // Validate request
    if (!req.body.title) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a new Heating object
    const heating = {
        type: req.body.type
    }

    // Save Heating in the database
    Heating.create(heating)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Heating."
            });
        });
};

exports.findAll = (req, res) => {
    const type = req.query.type;
    var condition = type ? { type: { [Op.like]: `%${type}%` } } : null;
    Heating.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Heatings."
            });
        });
};  

exports.findOne = (req, res) => {
    const id = req.params.id;

    Heating.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Heating with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message : "Error retrieving Heating with id=" + id
            });
        });
};

exports.update = (req, res) => {
    const id = req.params.id;

    Heating.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Heating was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Heating with id=${id}. Maybe Heating was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Heating with id=" + id
            });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;

    Heating.destroy({
        where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({
                message: "Heating was deleted successfully!"
            });
        } else {
            res.send({
                message: `Cannot delete Heating with id=${id}. Maybe Heating was not found!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Could not delete Heating with id=" + id
        });
    });
};

exports.deleteAll = (req, res) => {
    Heating.destroy({
        where: {},
        truncate: false
    })
    .then(nums => {
        res.send({
            message: `${nums} Heatings were deleted successfully!`
        });
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while removing all Heatings."
        });
    });
};

exports.findAllPublished = (req, res) => {
    Heating.findAll({
        where: {}
    })
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving Heatings."
        });
    });
};