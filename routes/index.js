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
        res.render('login', {
            title: "Login",
            stylesheet: "/public/css/login.css"
        });
    });

    // Registration page
    app.get("/register", (req, res) => {
        res.render('registration', {
            title: "Register",
            stylesheet: "/public/css/registration.css",
            script: "/public/js/registration.js"
        });
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

    // Redirect to /error
    app.use("*", (req, res) => {
        res.redirect("/error");
    });
}

export default constructorMethod;