import {checkUsername, checkPassword} from '../helpers.js';
import users from '../data/users.js';
import userRoutes from './users.js';
import gameRoutes from './games.js';
import path from 'path';

const constructorMethod = (app) => {

    // Landing page
    app.get("/", (req, res) => {
        res.render('landing-page', {
            title: "Landing Page",
            stylesheet: "/public/css/landing-page.css",
            is_logged_in: req.session.user
        });
    });

    // Login page
    app.get("/login", (req, res) => {
        try {
            return res.render('login', {
                title: "Login",
                stylesheet: "/public/css/login.css",
                script: "/public/js/login.js",
                hidden: "hidden"
            });
        } catch (e) {
            return res.status(e.status).render("error", {
                status: e.status,
                error_message: e.error
            });
        }
    });
    app.post("/login", async (req, res) => {

        // Get username and password from the request body; ignore confirmPassword.
        
        let {username, password} = req.body;

        try {

            // Input validation for username and password.
            username = checkUsername(username, "login");
            password = checkPassword(password);

            // Check if both username and password are correct.
            let user = await users.login(username, password);

            // Add user info to the cookie.
            req.session.user = user;

            return res.redirect("/home");
        
        } catch (e) {

            return res.status(e.status).render('login', {
                title: "Login",
                stylesheet: "/public/css/login.css",
                script: "/public/js/login.js",
                error_message: e.error,
                username: username,
                password: password
            });
        }
    });

    // Registration page
    app.get("/register", (req, res) => {
        try {
            return res.render('registration', {
                title: "Register",
                stylesheet: "/public/css/registration.css",
                script: "/public/js/registration.js",
                hidden: "hidden"
            });
        } catch (e) {
            return res.status(e.status).render("error", {
                status: e.status,
                error_message: e.error
            });
        }
    });
    app.post("/register", async (req, res) => {
        let {username, password} = req.body;
        try {
            username = checkUsername(username, "POST /register");
            password = checkPassword(password, "POST /register");
            let admin = false;
            let newUser = await users.createUser(username, password, admin);
            req.session.user = newUser;
            return res.redirect("/home");

        } catch (e) {
            return res.status(e.status).render('registration', {
                title: "Register",
                stylesheet: "/public/css/registration.css",
                script: "/public/js/registration.js",
                error_message: e.error,
                username: username,
                password: password
            });
        }
    });

    // Home page
    app.get("/home", (req, res) => {
        return res.render('home', {
            title: "Home",
            stylesheet: "/public/css/home.css",
            user: req.session.user,
        });
    });

    // Signout
    app.get("/signout", (req, res) =>{
        req.session.destroy();
        res.sendFile(path.resolve("static/signout.html"));
    })

    // About page
    app.get("/about", (req, res) => {
        res.sendFile(path.resolve("static/about.html"));
    })

    // User routes
    app.use("/users", userRoutes);

    // Game routes
    app.use("/games", gameRoutes);

    // 404 Error
    app.get("/error", (req, res) => {
        res.sendFile(path.resolve("static/error.html"));
    });

    // Redirect everything else to /error
    app.use("*", (req, res) => {
        res.redirect("/error");
    });
}

export default constructorMethod;