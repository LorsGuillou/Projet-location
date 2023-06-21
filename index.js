/**
 * Required External Modules
 */

const express = require("express");
const session = require("express-session");
const cors = require("cors");
const path = require("path");
const sessionMiddleware = require('./middleware/sessionMiddleware');

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

app.use(session({
    secret: "secret-session-key",
    resave: false,
    saveUninitialized: false
}));

app.use(sessionMiddleware);

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

// test json
const data = [{
        id: '1',
        name: 'Test 1',
        text: 'Ceci est le 1er test'
    },
    {
        id: '2',
        name: 'Test 2',
        text: 'Ceci est le 2ème test'
    },
    {
        id: '3',
        name: 'Test 3',
        text: 'Ceci est le 3ème test'
    }
];

app.get("/", (req, res) => {
    res.render("index", {
        title: "Accueil",
        data
    });
});

app.get("/location/:id", (req, res) => {
    var locationId = req.params.id;
    res.render("single", {
        title: "Location",
        item: data[locationId]
    });
});

app.get("/about", (req, res) => {
    res.render("about", {
        title: "A propos"
    });
});

app.get("/successSignup", (req, res) => {
    res.render("signin", {
        title: "Connexion",
        message: "Inscription réussie ! Vous pouvez maintenant vous connecter !"
    });
});

app.get("/signin", (req, res) => {
    res.render("signin", {
        title: "Connexion",
    });
});

app.get("/signup", (req, res) => {
    res.render("signup", {
        title: "Inscription"
    });
});

app.get("/account", (req, res) => {
    if (!req.session.username) {
        return res.redirect("/signin")
    }
    res.render("account", {
        title: "Votre compte"
    });
});

// 404
app.use((req, res, next) => {
    res.status(404).render('404', {
        title: "Page non trouvée"
    });
});

/**
 * Actions
 */


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