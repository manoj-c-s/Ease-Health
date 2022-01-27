const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const passport = require('passport');


// Load User model
const db = require('../models/dbcon');

module.exports = function(passport){
passport.use( new LocalStrategy({

  usernameField: 'email',

  passwordField: 'password',

  passReqToCallback: true //passback entire req to call back
} , function (req, email, password, done){


      if(!email || !password ) { return done(null, false, req.flash('error_msg','All fields are required.')); }

      if(password.length <6){
        return done(null, false, req.flash('error_msg','password should be mnimum 6.')); 
      }
      db.query("select * from instructers where email = ?", [email], function(err, rows){

          console.log(err); console.log(rows);

        if (err) return done(req.flash('message',err));

        if(!rows.length){ return done(null, false, req.flash('error_msg','Invalid username or password.')); }

        bcrypt.compare(password, rows[0].password, (err, isMatch) => {
          if (err) console.log(err);
          if (isMatch) {insname=rows[0].name;
            return done(null, rows[0]);
            
          } else {
            return done(null, false, req.flash('error_msg','Incorrect Password '));
          }
        });

   

      });

    }

));}

passport.serializeUser(function(rows, done){

  done(null, rows.id);

});

passport.deserializeUser(function(id, done){

  db.query("select * from instructers where id = "+ id , function (err, rows){

      done(null, rows[0]);

  });

});