const jwt = require('jwt-simple');
let User = require('../models/user');
const config = require('../config');

const tokenForUser = user => {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
};

exports.signin = (req, res, next) => {
  let email = req.body.email;
  let password = req.body.password;
  const user = new User({
    email,
    password,
  });
  // User has already had their email and password authenticated
  // We just need to give them a token
  res.json({ token: tokenForUser(user) });
};

exports.signup = (req, res, next) => {
  const email = req.body.formProps.email;
  const password = req.body.formProps.password;
  if (!email || !password) {
    return res
      .status(422)
      .send({ error: 'You must provide email and password' });
  }

  // See if a user with the given email exists
  User.findOne({ email: email }, function (err, existingUser) {
    if (err) {
      return next(err);
    }

    // If a user with an email does exist, return an error
    if (existingUser) {
      return res.status(422).send({ error: 'Email is in use' });
    }

    // If a user with email does not exist, create and save user record
    const user = new User({
      email,
      password,
    });

    user.save(err => {
      if (err) {
        return next(err);
      }

      // respond to request indicating the user was created
      res.json({ token: tokenForUser(user) });
    });
  });
};
