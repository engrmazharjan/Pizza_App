const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const bcrypt = require("bcrypt");

function init(passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        // Login
        // Check if email exists
        const user = await User.findOne({ email: email });
        if (!user) {
          return done(null, false, {
            message: "Invalid Email / No User With This Email",
          });
        }

        bcrypt
          .compare(password, user.password)
          .then((match) => {
            if (match) {
              return done(null, user, {
                message: "Logged In Successfully",
              });
            }
            return done(null, false, {
              message: "Invalid Username Or Password",
            });
          })
          .catch((err) => {
            return done(null, false, {
              message: `Something Went Wrong: ${err}`,
            });
          });
      }
    )
  );

  // Serialize User
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  // Deserialize User
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
}

module.exports = init;
