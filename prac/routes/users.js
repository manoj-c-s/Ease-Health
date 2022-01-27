const express = require("express");
const router = express.Router();

const bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const controller = require("../controller/connect");
const { forwardAuthenticated, ensureAuthenticated } = require("../config/auth");

router.post("/register", urlencodedParser, controller.register);
router.post("/ilogin", urlencodedParser, controller.ilogin);
router.post("/forgot", urlencodedParser, controller.forgot);
// router.get('/home',urlencodedParser,controller.isLogIn,controller.render_home);
router.get("/ilogout", urlencodedParser, controller.ilogout);
//login page
router.get("/ilogin", forwardAuthenticated, (req, res) => {
  res.render("ilogin");
});
//register page
router.get("/register", forwardAuthenticated, (req, res) => {
  res.render("register", { msg: "register to view our website" });
});
router.get("/forgot", (req, res) => {
  res.render("forgot");
});
router.post("/addblogs", ensureAuthenticated, controller.addblogs);
router.post("/login", urlencodedParser, controller.login);
router.get("/login", (req, res) => {
  res.render("login", { msg: "login to view our website" });
});
router.get("/logout", controller.logout, (req, res) => {
  res.render("login");
});

router.get("/dashboard", controller.isLogIn, controller.dashboard);
router.get("/heart", controller.isLogIn, controller.heart);
router.get("/t2d", controller.isLogIn, controller.t2d);
router.get("/blogs", controller.isLogIn, controller.blogs);
router.get("/cancer", controller.isLogIn, controller.cancer);
router.get("/arthritis", controller.isLogIn, controller.arthritis);
router.get("/obesity", controller.isLogIn, controller.obesity);
router.get("/weightgain", controller.isLogIn, controller.weightgain);
router.get("/diet", controller.isLogIn, (req, res) => {
  res.render("diet");
});
router.get("/searchHos", controller.isLogIn, (req, res) => {
  res.render("searchHos", { msg: "welcome " });
});

router.post("/hospital", controller.isLogIn, controller.hospitals);
router.get("/bmicalculator", controller.isLogIn, function (req, res) {
  if (req.notPresent) {
    res.render("login", { msg: "Login to view page source" });
  } else {
    res.render("bmi");
  }
});

//this is used to post the data on the specific route
router.post("/bmicalculator", function (req, res) {
  let heigh = parseFloat(req.body.Height);
  let weigh = parseFloat(req.body.Weight);
  let bmi = weigh / (heigh * heigh);

  //number to string format
  bmi = bmi * 10000;
  bmi = bmi.toFixed(2);

  req_name = req.body.Name;

  // CONDITION FOR BMI
  if (bmi < 19) {
    res.send(
      "<h2>hey! " +
        req_name +
        " your BMI is : " +
        bmi +
        "<br><h1>You are Underweight!</h1><h2> you can gain weight by doing exercise,For more " +
        "<a href='weightgain'> click here</a> </h2>"
    );
  } else if (19 <= bmi && bmi < 25) {
    res.send(
      "<h2>hey! " +
        req_name +
        " your BMI is : " +
        bmi +
        "<br><centre><h1>You are Normalweight! </h1>"
    );
  } else if (25 <= bmi && bmi < 30) {
    res.send(
      "<h2>hey! " +
        req_name +
        " your BMI is : " +
        bmi +
        "<br><centre><h1>You are Overweight!</h1><h2>Try to loose some weight by doing simple exercises like walking,running,jogging etc... </h2>"
    );
  } else {
    res.send(
      "<h2>hey! " +
        req_name +
        " your BMI is : " +
        bmi +
        "<br><h1>You are Obese!</h1><h2>you can loose weight by doing exercise,For more " +
        "<a href='obesity'> click here</a></h2>"
    );
  }
});

router.get("/index", controller.isLogIn, (req, res) => {
  if (req.notPresent) {
    res.render("login", { msg: "Login to view page source" });
  } else {
    res.render("index");
  }
});

router.post("/index", controller.mailer);
router.post("/ret", controller.ret);
router.post("/try", controller.try);

module.exports = router;
