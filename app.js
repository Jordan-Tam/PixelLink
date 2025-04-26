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

app.use(
  session({
    name: "AuthenticationState",
    secret: "some secret string!",
    saveUninitialized: false,
    resave: false,
  })
);

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");



// I have not tested these, since the routes aren't up yet.

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

app.use("/login", async (req, res, next) => {
  if (req.method === "GET") {
    if (req.session.user) {
      res.redirect("/home"); //Redirect the user to the home page if they are signed in and try to access login page.
    }
  }

  next();
});

app.use("/register", async (req, res, next) => {
  if (req.method === "GET") {
    if (req.session.user) {
      res.redirect("/home"); //Redirect the user to the home page if they are signed in and try to access register page.
    }
  }

  next();
});

app.use("/user", async (req, res, next) => {
  if (req.method === "GET") {
    if (!req.session.user) {
      res.redirect("/login"); //Redirect the user to the login page if they are not signed in and try to access a user route.
    }
  }

  next();
});

app.use("/game", async (req, res, next) => {
  if (req.method === "GET") {
    if (!req.session.user) {
      res.redirect("/login"); //Redirect the user to the login page if they are not signed in and try to access a game route.
    }
  }

  next();
});

app.use("/signout", async (req, res, next) => {
  if (req.method === "GET") {
    if (!req.session.user) {
      return res.redirect("/login");
    }
  }
  next();
});

configRoutesFunction(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
