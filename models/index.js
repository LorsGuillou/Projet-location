const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD, {
        host: config.HOST,
        dialect: config.dialect,
        operatorsAliases: false,
        pool: {
            max: config.pool.max,
            min: config.pool.min,
            acquire: config.pool.acquire,
            idle: config.pool.idle
        }
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.housing = require("../models/housing.model.js")(sequelize, Sequelize);
db.location = require("../models/location.model.js")(sequelize, Sequelize);
db.town = require("../models/town.model.js")(sequelize, Sequelize);
db.parking = require("../models/parking.model.js")(sequelize, Sequelize);
db.heating = require("../models/heating.model.js")(sequelize, Sequelize);
db.dpe = require("../models/dpe.model.js")(sequelize, Sequelize);

// User / Role relation

db.role.belongsToMany(db.user, {
    through: "user_roles",
    foreignKey: "roleId",
    otherKey: "userId"
});

db.user.belongsToMany(db.role, {
    through: "user_roles",
    foreignKey: "userId",
    otherKey: "roleId"
});

db.ROLES = ["user", "admin"];

// User / Housing relation

db.user.belongsToMany(db.housing, {
    through: db.location,
    foreignKey: "userId",
    otherKey: "housingId"
});

db.housing.belongsToMany(db.user, {
    through: db.location,
    foreignKey: "housingId",
    otherKey: "userId"
});

// Housing / Town relation

db.housing.belongsTo(db.town, {
    foreignKey: "townId"
});

db.town.hasMany(db.housing);

// Housing / Parking relation

db.housing.belongsToMany(db.parking, {
    through: "housing_parking",
    foreignKey: "housingId",
    otherKey: "parkingId"
});

db.parking.belongsToMany(db.housing, {
    through: "housing_parking",
    foreignKey: "parkingId",
    otherKey: "housingId"
});

// Housing / Heating relation

db.housing.belongsToMany(db.heating, {
    through: "housing_heating",
    foreignKey: "housingId",
    otherKey: "heatingId"
});

db.heating.belongsToMany(db.housing, {
    through: "housing_heating",
    foreignKey: "heatingId",
    otherKey: "housingId"
});

// Housing / DPE relation

db.housing.belongsTo(db.dpe, {
    foreignKey: "dpeId"
});

db.dpe.hasMany(db.housing);

module.exports = db;