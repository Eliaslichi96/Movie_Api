const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  uuid = require('uuid');
const app = express();
const mongoose = require('mongoose');
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;
const cors = require('cors');
const passport = require('passport');
require('./passport');
const { check, validationResult } = require('express-validator');

// only certain origins to be given access 
//app.use(cors({
//origin: (origin, callback) => {
// if(!origin) return callback(null, true);
// if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
// let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
// return callback(new Error(message ), false);
// }
// return callback(null, true);
//}
//}));

mongoose.connect(process.env.CONNECTION_URI,
  { useNewUrlParser: true, useUnifiedTopology: true });

//mongoose.connect('mongodb://localhost:27017/finalattempt', 
//{ useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());

app.use(morgan('common'));
let auth = require('./auth')(app);

// Welcome route
app.get('/', (req, res) => {
  res.send('Welcome to movie API');
});


// READ/GET all users
app.get('/users', passport.authenticate("jwt", { session: false }),
  async (req, res) => {

    await Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });


// Get a user by username
app.get('/users/:Username',
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Users.findOne({ Username: req.params.Username })
      .then((users
      ) => {
        res.json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });


//Add a user
/* We’ll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/
app.post('/users',
  [check('Username', 'Username is required').isLength({ min: 5 }),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()],
  async (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    await Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res
            .status(400)
            .send(req.body.Username + " already exists");
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthdate: req.body.Birthday,
          })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send("Error: " + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error " + error);
      });

  });


// Update a user's info, by username

/* We’ll expect JSON in this format
{
  Username: String,
  (required)
  Password: String,
  (required)
  Email: String,
  (required)
  Birthday: Date
}*/
app.put('/users/:Username',
  [check('UserName', 'UserName is required').isLength({ min: 5 }),
  check('UserName', 'UserName contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Email', 'Email does not appear to be valid').isEmail()],
  passport.authenticate('jwt', { session: false }), async (req, res) => {
    if (req.user.Username !== req.params.Username) {
      return res.status(400).send('Permission denied');
    }
    // CONDITION ENDS
    await Users.findOneAndUpdate({ Username: req.params.Username }, {
      $set:
      {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }
    },
      { new: true }) // This  line makes sure that the updated document is returned
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send('Error: ' + err);
      })
  });


// Add a movie to a user's list of favorites
app.post('/users/:username/Movies/:MovieID',
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Users.findOneAndUpdate({ Username: req.params.Username }, {
      $push: { FavoriteMovies: req.params.MovieID }
    },
      { new: true }) // This line makes sure that the updated document is returned
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });


//delete  users favoritemovie 
app.delete('/users/:username/movies/:movieId', passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    await Users.findOneAndUpdate({ UserName: req.params.Username }, {
      $pull: { FavoriteMovies: req.params.movieId }
    },
      { new: true })
      .then((updatedUser) => {
        res.json(updatedUser);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

// Delete a user by username
app.delete('/users/:username', passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    if (req.user.UserName !== req.params.Username) {
      return res.status(400).send('Permission denied');
    }
    await Users.findOneAndUpdate({ UserName: req.params.username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.username + ' was not found.');
        } else {
          res.status(200).send(req.params.username + ' was deleted.');
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

// READ/GET all Movies
app.get('/movies',
  async (req, res) => {
    await Movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

// READ/GET movies title
app.get('/movies/:title',
  async (req, res) => {
    await Movies.findOne({ Title: req.params.title })
      .then((movie) => {
        res.json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });



// READ/GET movie genre
app.get('/movies/genre/:genre',
  async (req, res) => {
    await Movies.find({ Genre: req.params.genre })
      .then((movie) => {
        if (!movie.length) {
          res.status(400).send(req.params.genre + ' movies were not found.');
        } else {
          res.json(movie);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

// READ/GET movie director
app.get('/movies/director/:directorName',
  async (req, res) => {
    await Directors.findOne({ Name: req.params.directorName })
      .then((directors) => {
        if (!directors) {
          res.status(400).send(req.params.directorName + ' was not found.');
        } else {
          res.json(directors);
        }

      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

let allowedOrigins = ['http://localhost:8080', 'http://testsite.com', 'http://localhost:1234'];

app.use(cors());

app.use('/documentation', express.static('public', { index: 'documentation.html' }));


// error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// listen for request
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});

