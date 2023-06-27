const db = require("../models");
const { findOneDPEbyValues } = require("../services/dpe.service");
const { findAllHeatings } = require("../services/heating.service");
const { findOneHousing, findAllHousing, findAllRecent } = require("../services/housing.service");
const { findAllParkings } = require("../services/parking.service");
const { findAllTowns } = require("../services/town.service");

exports.welcomeView = async (req, res) => {
    res.render("index", {
        housings: await findAllRecent(),
        title: "Accueil",
    });
};

exports.allViewFront = async (req, res) => {
    res.render("allCards", {
        housings: await findAllHousing(),
        title: "Les locations",
    });
};

exports.allViewBack = async (req, res) => {
    res.render("allHousing", {
        housings: await findAllHousing(),
        title: "Tableau des locations",
        message: req.query.message,
    });
};

exports.singleView = async (req, res) => {
    const alert = req.session.alert;
    const id = req.params.id;
    const housing = await findOneHousing(id);
    
    res.render("single", {
        housing,
        title: housing.name,
        alert
    });
};

exports.createView = async (req, res) => {
    res.render("addHousing", {
        title: "Créer un nouvel article",
        towns: await findAllTowns(),
        heatings: await findAllHeatings(),
        parkings: await findAllParkings(),
        message: req.query.message,
    });
};

exports.create = async (req, res) => {
    const diagnostic = await findOneDPEbyValues(req.body.consumption, req.body.emission);

    const housing = {
        name: req.body.name,
        code: req.body.code,
        rent: req.body.rent,
        address: req.body.address,
        townId: req.body.town,
        room: req.body.room,
        bedroom: req.body.bedroom,
        bathroom: req.body.bathroom,
        surface: req.body.surface,
        consumption: req.body.consumption,
        emission: req.body.emission,
        dpeId: diagnostic.id,
        details: req.body.details,
    };

    // Save Housing in the database
    await db.sequelize.transaction(async (transaction) => {
        const createdHousing = await db.housing.create(housing, { transaction });
        await createdHousing.addHeatings(req.body.heatings ?? [], { transaction });
        await createdHousing.addParkings(req.body.parkings ?? [], { transaction });
    });
    return res.redirect("/dashboard/housing/create?message=Success");
};

exports.updateView = async (req, res) => {
    const id = req.params.id;
    res.render("updateHousing", {
        title: "Mettre à jour un logement",
        housing: await findOneHousing(id),
        towns: await findAllTowns(),
        heatings: await findAllHeatings(),
        parkings: await findAllParkings(),
        message: req.query.message,
    });
};

exports.update = async (req, res) => {
    const oldHousing = await findOneHousing(req.params.id);
    const diagnostic = await findOneDPEbyValues(req.body.consumption, req.body.emission);

    const newHousing = {
        name: req.body.name,
        code: req.body.code,
        rent: req.body.rent,
        address: req.body.address,
        townId: req.body.town,
        room: req.body.room,
        bedroom: req.body.bedroom,
        bathroom: req.body.bathroom,
        surface: req.body.surface,
        consumption: req.body.consumption,
        emission: req.body.emission,
        dpeId: diagnostic.id,
        details: req.body.details,
    };

    // Update Housing in the database
    await db.sequelize.transaction(async (transaction) => {
        await oldHousing.update(newHousing, { transaction });
        await oldHousing.removeHeatings(oldHousing.heatings, { transaction });
        await oldHousing.addHeatings(req.body.heatings ?? [], { transaction });
        await oldHousing.removeParkings(oldHousing.parkings, { transaction });
        await oldHousing.addParkings(req.body.parkings ?? [], { transaction });
    });
    return res.redirect("/dashboard/housing/update/" + id + "?message=Success");
};

exports.deleteHousing = async (req, res) => {
    const id = req.params.id;
    await db.sequelize.transaction(async (transaction) => {
        await db.housing.destroy({ where: { id: id }}, { transaction });
    });
    res.redirect("/dashboard/housing/all?message=Success");
};
