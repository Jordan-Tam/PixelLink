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
    app.get("/error", (req, res) => {
        res.sendFile(path.resolve("static/error.html"));
    });
    app.use("*", (req, res) => {
        res.redirect("/error");
    });
}

export default constructorMethod;