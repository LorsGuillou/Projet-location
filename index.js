/**
 * Required External Modules
 */

const express = require("express");
const session = require("express-session");
const cors = require("cors");
const path = require("path");

/**
 * App Variables
 */

const app = express();
var corsOptions = {
    origin: "http://localhost:8001",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(
    session({
        secret: "secret-session-key",
        resave: false,
        saveUninitialized: false,
    })
);

/**
 * Middlewares
 */

const { authJwt } = require("./middleware");
const { verifySignUp } = require("./middleware");
const sessionMiddleware = require("./middleware/sessionMiddleware");

app.use(sessionMiddleware);

/**
 *  App Configuration
 */

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

/**
 * Controllers
 */

const authController = require("./controllers/auth.controller");
const housingController = require("./controllers/housing.controller");
const locationController = require("./controllers/renting.controller");

/**
 * Routes
 */

// index
app.get("/", (req, res) => {
    res.render("index", {
        title: "Accueil",
    });
});

// all locations
app.get("/location/all", (req, res) => {
    res.render("all", {
        title: "Les logements"
    })
});

// single location
app.get("/location/:id", (req, res) => {
    var locationId = req.params.id;
    res.render("single", {
        title: data[locationId][text],
        item: data[locationId],
    });
});



// about
app.get("/about", (req, res) => {
    res.render("about", {
        title: "A propos",
    });
});

// Signup, form action and redirection

app.get("/register", (req, res) => {
    res.render("register", {
        title: "Inscription",
    });
});

app.post(
    "/signup",
    [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted],
    authController.signup
);

// Login page, signin and signout methods

app.get("/login", (req, res) => {
    const message = req.session.message;
    req.session.message = null;
    res.render("login", {
        title: "Connexion",
        message,
    });
});

app.post("/signin", authController.signin);

app.get("/signout", authController.signout);

app.get("/account", authJwt.verifyToken, authJwt.isUser, (req, res) => {
    res.render("account", {
        title: "Votre compte",
    });
});

app.get("/dashboard", authJwt.verifyToken, authJwt.isAdmin, (req, res) => {
    res.render("dashboard", {
        title: "Administration",
    });
});

// authJwt.verifyToken, authJwt.isAdmin,
app.get("/housing/all", housingController.viewAll);

app.get("/housing/create",  housingController.createView);

app.post("/housing/create", housingController.create);

app.get("/housing/update/:id", housingController.updateView);

app.post("/housing/update/:id", housingController.update);

// 404
app.use((req, res, next) => {
    res.status(404).render("404", {
        title: "Page non trouvée",
    });
});

/**
 * Server Activation
 */

const port = process.env.PORT || "8000";
app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});
