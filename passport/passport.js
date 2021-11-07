var bCrypt = require("bcrypt");
var passport = require("passport");
let LocalStrategy = require("passport-local").Strategy;

// function to be called while there is a new sign/signup
// We are using passport local signin/signup strategies for our app
module.exports = function (passport, auth) {
  var Auth = auth;

  //   passport.use(
  //     "local-signup",
  //     new LocalStrategy(
  //       {
  //         usernameField: "email",
  //         passwordField: "password",
  //         passReqToCallback: true, // allows us to pass back the entire request to the callback
  //       },
  //       function (req, email, password, done) {
  //         console.log("Signup for - ", email);
  //         var generateHash = function (password) {
  //           return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
  //         };
  //         Auth.findOne({
  //           where: {
  //             email: email,
  //           },
  //         }).then(function (user) {
  //           //console.log(user);
  //           if (user) {
  //             return done(null, false, {
  //               message: "That email is already taken",
  //             });
  //           } else {
  //             var userPassword = generateHash(password);
  //             var data = {
  //               email: email,
  //               password: userPassword,
  //               firstname: req.body.firstname,
  //               lastname: req.body.lastname,
  //             };

  //             Auth.create(data).then(function (newUser, created) {
  //               if (!newUser) {
  //                 return done(null, false);
  //               }
  //               if (newUser) {
  //                 return done(null, newUser);
  //               }
  //             });
  //           }
  //         });
  //       }
  //     )
  //   );

  //LOCAL SIGNIN
  passport.use(
    "local-signin",
    new LocalStrategy(
      {
        // By default, local strategy uses username and password, we will override with email
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true, // allows us to pass back the entire request to the callback
      },

      function (req, email, password, done) {
        var Auth = auth;

        var isValidPassword = function (userpass, password) {
          let isMatch = true;
          if (userpass === password) return isMatch;
          else {
            isMatch = false;
            return isMatch;
          }
          //   return bCrypt.compareSync(password, userpass);
        };
        console.log("logged to", email);
        Auth.findOne({
          where: {
            email: email,
          },
        })
          .then(function (user) {
            // console.log(user);
            if (!user) {
              // Verify callback for email
              return done(null, false, {
                message: "Email does not exist",
              });
            }

            if (!isValidPassword(user.password, password)) {
              // Verify callback for password
              return done(null, false, {
                message: "Incorrect password.",
              });
            }

            var userinfo = user.get();
            // console.log("user info is");
            // console.log(userinfo);

            // Verify callback for user - return user info if email & password is correct
            return done(null, userinfo);
          })
          .catch(function (err) {
            console.log("Error:", err);

            return done(null, false, {
              message: "Something went wrong with your Sign in",
            });
          });
      }
      // function (email, password, done) {
      //   var Auth = auth;
      //   Auth.findOne({ "email": email }, function (err, user) {
      //     if (err) return done(err);
      //     if (!user)
      //       return done(null, false, {
      //         message: "Pas d'utilisateur avec ce login.",
      //       });
      //     if (!user.validPassword(password))
      //       return done(null, false, { message: "Oops! Mauvais password." });
      //     return done(null, user);
      //   });
      // }
    )
  );

  // Keep user data into session
  passport.serializeUser(function (auth, done) {
    done(null, auth.id);
  });

  // Retrieve user data from session
  passport.deserializeUser(function (id, done) {
    Auth.findByPk(id).then(function (user) {
      if (user) {
        done(null, user.get());
      } else {
        done(user.errors, null);
      }
    });
    // Auth.findById(id, function (err, user) {
    //   done(err, user);
    // });
  });
};
