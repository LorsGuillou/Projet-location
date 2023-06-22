const db = require("../models");
const School = db.school;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    // Validate request
    if (!req.body.title) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a new School object
    const school = {
        name: req.body.name,
        address: req.body.address,
        level: req.body.level
    }

    // Save School in the database
    School.create(school)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the School."
            });
        });
};

exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
    School.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Schools."
            });
        });
};  

exports.findOne = (req, res) => {
    const id = req.params.id;

    School.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find School with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message : "Error retrieving School with id=" + id
            });
        });
};

exports.update = (req, res) => {
    const id = req.params.id;

    School.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "School was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update School with id=${id}. Maybe School was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating School with id=" + id
            });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;

    School.destroy({
        where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({
                message: "School was deleted successfully!"
            });
        } else {
            res.send({
                message: `Cannot delete School with id=${id}. Maybe School was not found!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Could not delete School with id=" + id
        });
    });
};

exports.deleteAll = (req, res) => {
    School.destroy({
        where: {},
        truncate: false
    })
    .then(nums => {
        res.send({
            message: `${nums} Schools were deleted successfully!`
        });
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while removing all Schools."
        });
    });
};

exports.findAllPublished = (req, res) => {
    School.findAll({
        where: {}
    })
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving Schools."
        });
    });
};