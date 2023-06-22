const db = require("../models");
const Dpe = db.dpe;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    // Validate request
    if (!req.body.title) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }

    // Create a new Dpe object
    const dpe = {
        consumption: req.body.consumption,
        emission: req.body.emission,
        note: req.body.note
    }

    // Save Dpe in the database
    Dpe.create(dpe)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Tutorial."
            });
        });
};

exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
    Dpe.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Dpes."
            });
        });
};  

exports.findOne = (req, res) => {
    const id = req.params.id;

    Dpe.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Dpe with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message : "Error retrieving Dpe with id=" + id
            });
        });
};

exports.update = (req, res) => {
    const id = req.params.id;

    Dpe.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Dpe was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Dpe with id=${id}. Maybe Dpe was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Dpe with id=" + id
            });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;

    Dpe.destroy({
        where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({
                message: "Dpe was deleted successfully!"
            });
        } else {
            res.send({
                message: `Cannot delete Dpe with id=${id}. Maybe Dpe was not found!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Could not delete Dpe with id=" + id
        });
    });
};

exports.deleteAll = (req, res) => {
    Dpe.destroy({
        where: {},
        truncate: false
    })
    .then(nums => {
        res.send({
            message: `${nums} Dpes were deleted successfully!`
        });
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while removing all Dpes."
        });
    });
};

exports.findAllPublished = (req, res) => {
    Dpe.findAll({
        where: {}
    })
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while retrieving Dpes."
        });
    });
};