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
            stylesheet: "/public/css/landing-page.css"
        });
    });

    // Login page
    app.get("/login", (req, res) => {
        try{
            return res.render('login', {
                title: "Login",
                stylesheet: "/public/css/login.css",
                script: "/public/js/login.js"
            });
        } catch (error) {
            return res.status(500).json({error});
        }
    });
    app.post("/login", async (req, res) => {
        try{
            const {username, password} = req.body;
            username = checkUsername(username, "login");
            password = checkPassword(password);
            const user = await users.login(username, password);
            req.session.user = user;
            return res.render('home', {user: req.session.user});
        } catch (error) {
            return res.status(400).render('login', {
                title: "Login",
                stylesheet: "/public/css/login.css",
                script: "/public/js/login.js",
                error_message: error.message
            });
        }
    });

    // Registration page
    app.get("/register", (req, res) => {
        try {
            return res.render('registration', {
                title: "Register",
                stylesheet: "/public/css/registration.css",
                script: "/public/js/registration.js"
            });
        } catch (error) {
            return res.status(500).json({error});
        }
    });
    app.post("/register", async (req, res) => {
        try {
            const {username, email, password, admin} = req.body;
            username = checkUsername(username, "register");
            email = checkEmail(email, "register");
            password = checkPassword(password);
            admin = checkAdmin(admin, "register");
            const newUser = await users.createUser(username, email, password, admin);
            req.session.user = newUser;
            return res.render('home', {user: req.session.user});
        } catch (error) {
            return res.render('registration', {
                title: "Register",
                stylesheet: "/public/css/registration.css",
                script: "/public/js/registration.js",
                error_message: error.message
            });
        }
    });

    app.get("/signout", (req, res) =>{
        req.session.destroy();
        res.sendFile(path.resolve("static/signout.html"));
    })

    // About page
    app.get("/about", (req, res) => {
        res.sendFile(path.resolve("static/about.html"));
    })

    // 404 Error
    app.get("/error", (req, res) => {
        res.sendFile(path.resolve("static/error.html"));
    });

    // User routes
    app.use("/user", userRoutes);

    // Game routes
    app.use("/game", gameRoutes);

    // Redirect everything else to /error
    app.use("*", (req, res) => {
        res.redirect("/error");
    });
}

export default constructorMethod;