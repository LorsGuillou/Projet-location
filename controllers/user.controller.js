const db = require("../models");
const User = db.user;
const Op = db.Sequelize.Op;

exports.findAll = (req, res) => {
    const start = req.query.start;
    var condition = start ? { start: { [Op.like]: `%${start}%` } } : null;
    User.findAll({ where: condition })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Users."
            });
        });
};  

exports.findOne = (req, res) => {
    const id = req.params.id;

    User.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find User with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message : "Error retrieving User with id=" + id
            });
        });
};

exports.update = (req, res) => {
    const id = req.params.id;

    User.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "User was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating User with id=" + id
            });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;

    User.destroy({
        where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({
                message: "User was deleted successfully!"
            });
        } else {
            res.send({
                message: `Cannot delete User with id=${id}. Maybe User was not found!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Could not delete User with id=" + id
        });
    });
};

exports.deleteAll = (req, res) => {
    User.destroy({
        where: {},
        truncate: false
    })
    .then(nums => {
        res.send({
            message: `${nums} Users were deleted successfully!`
        });
    })
    .catch(err => {
        res.status(500).send({
            message:
                err.message || "Some error occurred while removing all Users."
        });
    });
};

exports.findAllPublished = async () => {
    return User.findAll({
        where: {}
    });
};