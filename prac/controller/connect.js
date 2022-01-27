const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const util = require("util");
const mysql = require("mysql");
const passport = require("passport");
var nodemailer = require("nodemailer");
var multer = require("multer");
const fs = require("fs");

let db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "nodejs",
});
db.connect((err) => {
  if (err) {
    console.log(err);
  }
});

// registrer handle
module.exports.register = (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];
  //    check required field
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please fill in all fields" });
  }
  // passwwrd check
  if (password !== password2) {
    errors.push({ msg: "password do not match " });
  }
  if (password.length < 6) {
    errors.push({ msg: "Password should be atleast 6" });
  }
  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
      // console.log(result);
      if (err) throw err;
      if (result.length > 0) {
        req.flash("error_msg", "Email already exits");
        res.render("register");
      } else {
        if (password !== password2) {
          req.flash("error_msg", "Password and Cofirm Password doesn't match");
          res.render("register");
        } else {
          var hashedPass = bcrypt.hashSync(password, 8);
          sql = `INSERT INTO users(name,email,password) VALUES(?,?,?)`;
          db.query(sql, [name, email, hashedPass], (err, result) => {
            if (err) {
              console.log(err);
            }
            req.flash("success_msg", "You are now registered and can log in");
            res.redirect("/users/login");
          });
        }
      }
    });
  }
};

// Login
module.exports.ilogin = (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/addblogs",
    failureRedirect: "/users/ilogin",
    failureFlash: true,
  })(req, res, next);
};
//forgot

// Logout
module.exports.ilogout = (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
};

module.exports.forgot = (req, res) => {
  const { email, newpass } = req.body;
  {
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
      console.log(result);
      if (err) console.log(err);
      if (result.length == 0) {
        res.render("forgot", { msg: "Email doesn't exit" });
      } else {
        sql = "UPDATE users SET password = ? WHERE email = ? ";
        var hashedPass = bcrypt.hashSync(newpass, 8);
        db.query(sql, [hashedPass, email], (error, resu) => {
          console.log(resu);
          if (error) console.log(error);
          else {
            res.render("login", { msg: "password changed succesfully" });
          }
        });
      }
    });
  }
};

module.exports.login = (req, res) => {
  sql = "select * from users where email = ?";
  db.query(sql, [req.body.email], (err, result) => {
    if (result.length == 0) {
      res.render("login", { msg: "Email doesn't exit" });
    } else {
      bcrypt.compare(
        req.body.password,
        result[0].password,
        function (err, resu) {
          if (err) {
            console.log(err);
          } else {
            if (resu) {
              var token = jwt.sign({ id: result[0].id }, "mysecretpassword", {
                expiresIn: "90d",
              });

              var cookieoption = {
                expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                httpOnly: true,
              };
              res.cookie("jwt", token, cookieoption).redirect("dashboard");
            } else {
              res.render("login", { msg: "Incorrect Credentials" });
            }
          }
        }
      );
    }
  });
};

module.exports.isLogIn = async (req, res, next) => {
  if (typeof req.cookies.jwt != "undefined") {
    try {
      token = req.cookies.jwt;
      var decoded = await util.promisify(jwt.verify)(token, "mysecretpassword");
      console.log(decoded);
      sql = "select * from users where id = ?";
      db.query(sql, [decoded.id], (err, result) => {
        if (result.length > 0) {
          data = result[0];
          iname = data.name;
          return next();
        } else {
          return next();
        }
      });
    } catch (err) {
      // err
      if (err) {
        console.log(err);
      }
      return next();
    }
  } else {
    req.notPresent = true;
    return next();
  }
};

module.exports.dashboard = async (req, res) => {
  if (req.notPresent) {
    res.render("login", { msg: "Login to view page source" });
  } else {
    sql = "select * from diseases ";
    db.query(sql, (err, result) => {
      if (err) {
        console.log(err);
      }
      if (result.length > 0) {
        res.render("dashboard", { items: result });
      } else {
        res.send("try again");
      }
    });
  }
};

module.exports.t2d = async (req, res) => {
  if (req.notPresent) {
    req.flash("error_msg", "login to view this page");
    res.render("login");
  } else {
    res.render("t2d");
  }
};
module.exports.obesity = async (req, res) => {
  if (req.notPresent) {
    req.flash("error_msg", "login to view this page");
    res.render("login");
  } else {
    res.render("obesity");
  }
};
module.exports.weightgain = async (req, res) => {
  if (req.notPresent) {
    req.flash("error_msg", "login to view this page");
    res.render("login");
  } else {
    res.render("weightgain");
  }
};

module.exports.cancer = async (req, res) => {
  if (req.notPresent) {
    req.flash("error_msg", "login to view this page");
    res.render("login");
  } else {
    res.render("cancer");
  }
};
module.exports.arthritis = async (req, res) => {
  if (req.notPresent) {
    req.flash("error_msg", "login to view this page");
    res.render("login");
  } else {
    res.render("arthritis");
  }
};

module.exports.heart = async (req, res) => {
  if (req.notPresent) {
    req.flash("error_msg", "login to view this page");
    res.render("login");
  } else {
    res.render("heart");
  }
};

module.exports.logout = (req, res) => {
  res.cookie("jwt", "logout", {
    expires: new Date(Date.now() + 2 * 1000),
    httpOnly: true,
  });
  res.render("login", { msg: "logged out succesfully" });
};

module.exports.hospitals = (req, res) => {
  if (req.body.zip === "") {
    res.render("searchHos", { msg: "Login to view page source" });
  } else {
    const zip = req.body.zip;
    if (zip.length != 6) {
      msg = "inalid zip";
      res.render("searchHos");
    } else {
      sql = `select * from hospitals where zip = ?`;
      db.query(sql, [zip], (err, result) => {
        if (err) throw err;
        if (result != 0) {
          res.render("hospitals", {
            items: result,
            msg: "result showing hospitals",
          });
        }
      });
    }
  }
};
var to;
var subject;
var body;
var path;

var Storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./image");
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

var upload = multer({
  storage: Storage,
}).single("image");
module.exports.mailer = (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      console.log(err);
      return res.end("Something went wrong!");
    } else {
      to = req.body.to;
      subject = req.body.subject;
      body = req.body.body;
      path = req.file.path;
      console.log(to);
      console.log(subject);
      console.log(body);
      console.log(req.file);

      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "healthservices.info.official@gmail.com",
          pass: "healthyservice123",
        },
      });

      var mailOptions = {
        from: "healthservices.info.official@gmail.com",
        to: to,
        subject: subject,
        text: body,
        attachments: [
          {
            path: path,
          },
        ],
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
          fs.unlink(path, function (err) {
            if (err) {
              return res.end(err);
            } else {
              db.query(
                "insert into appointments(email,subject,body,img) values(?,?,?,?)",
                [to, subject, body, path],
                (err, result) => {
                  if (err) throw err;

                  return res.redirect("/users/searchHos");
                }
              );
            }
          });
        }
      });
    }
  });
};

module.exports.ret = (req, res) => {
  to = req.body.to;
  subject = req.body.subject;
  body = req.body.body;
  console.log(subject);
  console.log(body);
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "healthservices.info.official@gmail.com",
      pass: "healthyservice123",
    },
  });
  var mailOptions = {
    from: "healthservices.info.official@gmail.com",
    to: to,
    subject: subject,
    text: body,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);

      return res.redirect("/addblogs");
    }
  });
};

module.exports.try = (req, res) => {
  subject = req.body.subject;
  body = req.body.body;
  console.log(subject);
  console.log(body);
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "healthservices.info.official@gmail.com",
      pass: "healthyservice123",
    },
  });
  var mailOptions = {
    from: "healthservices.info.official@gmail.com",
    to: "manojcs123456@gmail.com",
    subject: subject,
    text: body,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      db.query(
        "insert into queries(subject,body) values(?,?)",
        [subject, body],
        (err, result) => {
          if (err) throw err;
          return res.redirect("/users/dashboard");
        }
      );
    }
  });
};

module.exports.queries = (req, res, next) => {
  sql = "select * from queries";
  db.query(sql, (err, quer) => {
    if (err) throw err;
    else {
      if (quer.length != 0) {
        queries = quer;
        return next();
      }
    }
  });
};
// module.exports.blogs = (req, res, next) => {
//   sql = `select date,Bby,head,content,img from blogs `;
//   db.query(sql, (err, result) => {
//     if (err) throw err;
//     else {
//       items = result;
//       res.render("blogs");
//     }
//   });
// };
module.exports.appoint = (req, res, next) => {
  sql = "select * from appointments";
  db.query(sql, (err, apnt) => {
    if (err) throw err;
    else {
      if (apnt.length != 0) {
        appoint = apnt;
        return next();
      }
    }
  });
};

module.exports.addblogs = function (req, res) {
  message = "";
  const { head, by, image, content } = req.body;
  {
    var sql = "INSERT INTO blogs(`head`,`content`,`Bby`,`img`) VALUES(?,?,?,?)";
    db.query(sql, [head, content, by, image], function (err, result) {
      if (err) throw err;
      res.render("addblogs", { msg: "" });
    });
  }
};

module.exports.blogs = function (req, res) {
  var sql = "SELECT * FROM blogs";
  db.query(sql, function (err, result) {
    if (result.length <= 0);

    res.render("blogs", { items: result });
  });
};
