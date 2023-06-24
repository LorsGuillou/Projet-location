const db = require("../models");
const { findOneDPE, findOneDPEbyValues } = require("../services/dpe.service");
const { findAllHeatings } = require("../services/heating.service");
const { findOneHousing, findAllHousing, findAllRecent } = require("../services/housing.service");
const { findAllParkings } = require("../services/parking.service");
const { findAllTowns } = require("../services/town.service");
const Housing = db.housing;
const Op = db.Sequelize.Op;

exports.welcomeView = async (req, res) => {
    res.render("index", {
        title: "Accueil",
        housings: await findAllRecent()
    });
};

exports.allView = async (req, res) => {
    res.render("allCards", {
        title: "Les locations",
        housings: await findAllHousing()
    });
};

exports.singleView = async (req, res) => {

}

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
    console.log(diagnostic);

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
        const createdHousing = await Housing.create(housing, { transaction });
        await createdHousing.addHeatings(req.body.heatings ?? [], { transaction });
        await createdHousing.addParkings(req.body.parkings ?? [], { transaction });
    });
    return res.redirect("/housing/create?message=Success");
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
    const id = req.params.id;
    const oldHousing = await findOneHousing(id);
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

    // Update Housing in the database
    await db.sequelize.transaction(async (transaction) => {
        await oldHousing.update(housing, { transaction });
        await oldHousing.removeHeatings(oldHousing.heatings, { transaction });
        await oldHousing.addHeatings(req.body.heatings ?? [], { transaction });
        await oldHousing.removeParkings(oldHousing.parkings, { transaction });
        await oldHousing.addParkings(req.body.parkings ?? [], { transaction });
    });
    return res.redirect("/housing/update/" + id + "?message=Success");
};

exports.deleteHousing = async (req, res) => {
    const id = req.params.id;
    await db.sequelize.transaction(async (transaction) => {
        await Housing.destroy({ where: { id: id }}, { transaction });
    });
};

exports.viewAll = async (req, res) => {
    res.render("allHousing", {
        title: "Tableau des locations",
        housings: await findAllHousing(),
    });
};
