const db = require("../models");
const bcrypt = require("bcryptjs");

async function run() {
    await db.sequelize.sync({
        force: true,
    });
    console.log("Drop and Resync Db");
    const roleMap = await createRoles();
    await createAdmin(roleMap);
    await createTowns();
    await createHeatings();
    await createParkings();
    await createDPEs();

    async function createRoles() {
        const roleUser = await db.role.create({
            name: "user",
        });

        const roleAdmin = await db.role.create({
            name: "admin",
        });
        
        return {roleUser, roleAdmin}
    }

    async function createAdmin(roleMap) {
        const admin = await db.user.create({
            username: "admin",
            mail: "admin@admin.fr",
            password: bcrypt.hashSync("admin", 8)
        });
        await admin.addRoles([roleMap.roleUser, roleMap.roleAdmin]);
    }

    async function createTowns() {
        await db.town.create({
            name: "Saint-Rivoal",
            postalCode: 29190
        });

        await db.town.create({
            name: "Commana",
            postalCode: 29450
        });
    }

    async function createHeatings() {
        await db.heating.create({
            type: "Bois"
        });
        await db.heating.create({
            type: "Gaz"
        });
        await db.heating.create({
            type: "Electrique"
        });
    }

    async function createParkings() {
        await db.parking.create({
            type: "Parking"
        });
        await db.parking.create({
            type: "Garage"
        });
    }

    async function createDPEs() {
        await db.dpe.create({
            minConsumption: 0,
            maxConsumption: 70,
            minEmission: 0,
            maxEmission: 6,
            class: "A"
        });

        await db.dpe.create({
            minConsumption: 71,
            maxConsumption: 110,
            minEmission: 7,
            maxEmission: 11,
            class: "B"
        });

        await db.dpe.create({
            minConsumption: 111,
            maxConsumption: 180,
            minEmission: 12,
            maxEmission: 30,
            class: "C"
        });

        await db.dpe.create({
            minConsumption: 181,
            maxConsumption: 250,
            minEmission: 31,
            maxEmission: 50,
            class: "D"
        });

        await db.dpe.create({
            minConsumption: 251,
            maxConsumption: 320,
            minEmission: 51,
            maxEmission: 70,
            class: "E"
        });

        await db.dpe.create({
            minConsumption: 321,
            maxConsumption: 420,
            minEmission: 71,
            maxEmission: 100,
            class: "F"
        });
    }
}

run();
