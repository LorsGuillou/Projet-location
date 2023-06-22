const db = require("../models");
const Service = db.service;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    // Validate request
    if (!req.body.title) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a new Service object
    const service = {
        name: req.body.name,
        type: req.body.type,
        address: req.body.address,
    }

    // Save Service in the database
    Service.create(service)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Service."
            });
        });
};

exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
    Service.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Services."
            });
        });
};  

exports.findOne = (req, res) => {
    const id = req.params.id;

    Service.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Service with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message : "Error retrieving Service with id=" + id
            });
        });
};

exports.update = (req, res) => {
    const id = req.params.id;

    Service.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Service was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Service with id=${id}. Maybe Service was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Service with id=" + id
            });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;

    Service.destroy({
        where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({
                message: "Service was deleted successfully!"
            });
        } else {
            res.send({
                message: `Cannot delete Service with id=${id}. Maybe Service was not found!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Could not delete Service with id=" + id
        });
    });
};

exports.deleteAll = (req, res) => {
    Service.destroy({
        where: {},
        truncate: false
    })
    .then(nums => {
        res.send({
            message: `${nums} Services were deleted successfully!`
        });
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while removing all Services."
        });
    });
};

exports.findAllPublished = (req, res) => {
    Service.findAll({
        where: {}
    })
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving Services."
        });
    });
};