/**
 * Required External Modules
 */

const express = require("express");
const cors = require("cors");
const path = require("path");

/**
 * App Variables
 */

const app = express();
var corsOptions = {
    origin: "http://localhost:8001"
}

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({
    extended: true
}));

const db = require("./models");

/**
 * Database configuration
 */

db.sequelize.sync();

/**
 * Initial role creation
 */
// const Role = db.role;
// db.sequelize.sync({
//     force: true
// }).then(() => {
//     console.log('Drop and Resync Db');
//     initial();
// });

// function initial() {
//     Role.create({
//         id: 1,
//         name: "user"
//     });

//     Role.create({
//         id: 2,
//         name: "admin"
//     });
// }

/**
 *  App Configuration
 */

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

/**
 * API Routes
 */

require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

/**
 * Front Routes
 */

app.get("/", (req, res) => {
    res.render("index", {
        title: "Accueil",
        exemple: ['Un', 'Deux', 'Trois']
    });
});

app.get("/user", (req, res) => {
    res.render("user", {
        title: "Profile",
        userProfile: {
            nickname: "Auth0"
        }
    });
});

app.get("/about", (req, res) => {
    res.render("about", {
        title: "A propos",
    });
});

app.get("/login", (req, res) => {
    res.render("login", {
        title: "Connexion"
    });
});

app.get("/signin", (req, res) => {
    res.render("signin", {
        title: "Inscription"
    });
});

/**
 * Server Activation
 */

const port = process.env.PORT || "8000";
app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});

/**
 * Database configuration
 */