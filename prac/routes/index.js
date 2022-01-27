const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const { ensureAuthenticated } = require("../config/auth");
const controller = require("../controller/connect");

router.get("/", (req, res) => {
  res.render("login", { msg: "login to view our website" });
});
router.get("/result", (req, res) => {
  res.render("result");
});

router.get(
  "/addblogs",
  ensureAuthenticated,

  (req, res) => {
    res.render("addblogs", { msg: "write here below" });
  }
);

router.get(
  "/view",
  ensureAuthenticated,
  controller.queries,
  controller.appoint,
  (req, res) => {
    res.render("view");
  }
);

module.exports = router;
