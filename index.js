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
const userController = require("./controllers/user.controller");
const housingController = require("./controllers/housing.controller");
const housingService = require("./services/housing.service");
const rentingController = require("./controllers/renting.controller");

const housings = housingService.findAllHousing();

/**
 * Routes
 */

// index
app.get("/", housingController.welcomeView);

// all locations
app.get("/location/all", housingController.allViewFront);

// single location
app.get("/location/:id", housingController.singleView);

app.post("/location/:id/rent", rentingController.create);

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

app.get("/account", authJwt.verifyToken, authJwt.isUser, userController.accountView);

// authJwt.verifyToken, authJwt.isAdmin,

app.get("/dashboard", (req, res) => {
    res.render("dashboard", {
        title: "Administration",
    });
});

app.get("/dashboard/housing/all", housingController.allViewBack);

app.get("/dashboard/housing/create",  housingController.createView);

app.post("/dashboard/housing/create", housingController.create);

app.get("/dashboard/housing/update/:id", housingController.updateView);

app.post("/dashboard/housing/update/:id", housingController.update);

app.get("/dashboard/housing/delete/:id", housingController.deleteHousing);

app.get("/dashboard/users/all", userController.allUsersView);

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
