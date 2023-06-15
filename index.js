/**
 * Required External Modules
 */

const express = require("express");
const path = require("path");

/**
 * App Variables
 */

const app = express();
const port = process.env.PORT || "8000";

/**
 *  App Configuration
 */

app.set("views", path.join(__dirname, "src/views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

/**
 * Routes Definitions
 */

app.get("/", (req, res) => {
    res.render("index", {
        title: "Accueil"
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

/**
 * Server Activation
 */

app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});