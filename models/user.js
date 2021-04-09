const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// Define our model
const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
  },
  password: String,
});

// On save hook, encrypt password
// Before saving a model, run this function
userSchema.pre('save', function (next) {
  // get access to User model
  const user = this;

  // generate a salt then run callback
  bcrypt.genSalt(10, function (err, salt) {
    if (err) {
      return next(err);
    }

    // hash (encrypt) our password using the salt and then run callback
    bcrypt.hash(user.password, salt, null, function (err, hash) {
      if (err) {
        return next(err);
      }

      // overwrite plain text pasword with encrypted password
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function (canidatePassword, callback) {
  bcrypt.compare(canidatePassword, this.password, function (err, isMatch) {
    if (err) {
      return callback(err);
    }
    callback(null, isMatch);
  });
};

// Create the model class
// const User = mongoose.model('User', UserSchema);

// export the model

module.exports = mongoose.model('User', userSchema);
