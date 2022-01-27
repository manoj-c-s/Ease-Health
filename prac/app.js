const express = require("express");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const cookies = require("cookie-parser");
const app = express();

// Passport Config
require("./config/passport")(passport);

//EJS
app.set("view engine", "ejs");
app.use("/", express.static(__dirname + "/public"));

//bodyparse
app.use(express.urlencoded({ extended: false }));
app.use(cookies());


//express midlleware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

//routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

const PORT = process.env.PORT || 5001;
app.listen(PORT, console.log("server started on ${ PORT }"));
