const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

/**
 * Defines the schema for movies.
 */

let movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Genre: {
    Name: String,
    Description: String
  },
  Director: {
    Name: String,
    Bio: String
  },
  Actors: [String],
  ImagePath: String,
  Featured: Boolean
});

/**
 * Defines the schema for users.
 */


let userSchema = mongoose.Schema({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  Birthday: Date,
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

/**
 * Static method to hash a password.
 * @param {string} password - The password to hash.
 * @returns {string} - The hashed password.
 */

userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

/**
 * Method to validate a password.
 * @param {string} password - The password to validate.
 * @returns {boolean} - Whether the password is valid.
 */

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.Password);
};

/**
 * Movie model.
 */

let Movie = mongoose.model('Movie', movieSchema);
/**
 * User model.
 */

let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;