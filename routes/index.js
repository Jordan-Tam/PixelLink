// import ??? from './??.js';
// import ??? from './??.js';

import path from 'path';

const constructorMethod = (app) => {
    app.get("/", (req, res) => {
        res.render('landing-page', {
            title: "Landing Page",
            stylesheet: "/public/css/landing-page.css"
        });
    });
    app.get("/login", (req, res) => {
        res.render('login', {
            title: "Login",
            stylesheet: "/public/css/login.css"
        });
    });
    app.get("/error", (req, res) => {
        res.sendFile(path.resolve("static/error.html"));
    });
    app.use("*", (req, res) => {
        res.redirect("/error");
    });
}

export default constructorMethod;