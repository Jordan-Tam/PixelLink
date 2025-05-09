import express from "express";
import exphbs from "express-handlebars";
import configRoutesFunction from "./routes/index.js";
import session from "express-session";

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  // If the user posts to the server with a property called _method, rewrite the request's method to be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets rewritten in this middleware to a PUT route.
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }

  // let the next middleware run:
  next();
};

const app = express();
app.use(express.json());
app.use("/public", express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(rewriteUnsupportedBrowserMethods);

//* Middleware 0: Set cookie.
app.use(
  session({
    name: "AuthenticationState",
    secret: "some secret string!",
    saveUninitialized: false,
    resave: false,
  })
);

// I have not tested these, since the routes aren't up yet.

//* Middleware 1: Console log information related to each server request.
app.use(async (req, res, next) => {
  let auth = "";
  if (req.session.user) {
    if (req.session.user.admin) auth = "(Authenticated Admin)";
    else {
      auth = "(Authenticated User)";
    }
  } else {
    auth = "(Non-Authenticated)";
  }
  console.log(
    "[" +
      new Date().toUTCString() +
      "]: " +
      req.method +
      " " +
      req.path +
      " " +
      auth
  );
  next();
});

//* Middleware 2: If a logged-in user tries to access the login page, redirect them to the home page.
app.use("/login", async (req, res, next) => {
  if (req.method === "GET") {
    if (req.session.user) {
      return res.redirect("/home"); //Redirect the user to the home page if they are signed in and try to access login page.
    }
  }

  next();
});

//* Middleware 3: If a logged-in user tries to access the register page, redirect them to the home page.
app.use("/register", async (req, res, next) => {
  if (req.method === "GET") {
    if (req.session.user) {
      return res.redirect("/home"); //Redirect the user to the home page if they are signed in and try to access register page.
    }
  }

  next();
});

//* Middleware 4: If an unauthenticated user tries to access the home page, redirect them to the login page.
app.use("/home", async (req, res, next) => {
  if (req.method === "GET") {
    if (!req.session.user) {
      return res.redirect("/login");
    }
  }

  next();
})

//* Middleware 5: If an unauthenticated user tries to access any "/user" page, redirect them to the login page.
app.use("/users", async (req, res, next) => {
  if (req.method === "GET") {
    if (!req.session.user) {
      return res.redirect("/login"); //Redirect the user to the login page if they are not signed in and try to access a user route.
    }
  }

  next();
});

//* Middleware 6: If an unauthenticated user tries to access any "/games" page, redirect them to the login page.
app.use("/games", async (req, res, next) => {
  if (req.method === "GET") {
    if (!req.session.user) {
      return res.redirect("/login"); //Redirect the user to the login page if they are not signed in and try to access a game route.
    }
  }

  next();
});

//* Middleware 7: If a non-admin tries to access post or delete "/games/", redirect them to 403 error(with link back to games list page)
app.use("/games", async(req, res, next) => {
  if (req.method === "POST" || req.method === "DELETE"){
    if((!req.path.includes("/form")) && (!req.session.user || !req.session.user.admin)){
      return res.status(403).render("error", {
        status: 403,
        title: "403 Error",
        error_message: "Permission Denied. Must be an admin.",
        stylesheet: "/public/css/error.css",
        link: "/games/"
      });
    }
  }
  next();
});

//* Middleware 8: If an unauthenticated user tries to access the signout page, redirect them to the login page.
app.use("/signout", async (req, res, next) => {
  if (req.method === "GET") {
    if (!req.session.user) {
      return res.redirect("/login");
    }
  }
  next();
});

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
configRoutesFunction(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
