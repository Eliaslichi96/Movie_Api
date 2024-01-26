const express = require('express');
morgan = require('morgan'),
fs = require('fs'),
bodyParser = require('body-parser'),
path = require('path'),
uuid = require('uuid');

const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;


  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  let auth = require("./auth")(app);

  app.use(bodyParser.json()); //any time using req.body, the data will be expected to be in JSON format
  app.use(bodyParser.urlencoded({ extended: true }));
  const passport = require("passport");
  require("./passport");

 

let users = [
  {
    id:1,
    name: "Kim",
    favMovies: []
},
{
  id:2,
    name: "Secondloco",
    favMovies: ['The Dark Knight']
  },
  {
    id:3,
    name: "Thirdloco",
    favMovies: ['Inception']
  }
];


let movies = [
    {
      'Title': 'Harry Potter Series',
      'Description': '',
      'Genre': {
        'Name':'fantasy literature',
        'Description':'The novels fall into the genre of fantasy literature, and qualify as a type of fantasy called "urban fantasy", "contemporary fantasy", or "low fantasy". They are mainly dramas, and maintain a fairly serious and dark tone throughout, though they do contain some notable instances of tragicomedy and black humour.'
      },
      'Director': {
        'Name': 'Chris Columbus',
        'Bio': 'Chris Joseph Columbus is an American filmmaker. Born in Spangler, Pennsylvania, Columbus studied film at Tisch School of the Arts where he developed an interest in filmmaking.',
        'Birth': 'September 10, 1958'
      }
     
    },
    {
      'Title': 'Lord of the Rings: The Return of the King',
      'Description': 'The final installment of the epic fantasy trilogy where the fellowship faces its ultimate challenge in the battle for Middle Earth.',
      'Genre': {
        'Name': 'Fantasy',
        'Description': 'Fantasy genre involving epic quests and magical elements.'
      },
      'Director': {
        'Name': 'Peter Jackson',
        'Bio': 'Peter Jackson is a New Zealand film director, producer, and screenwriter. He is best known for his work on the film adaptations of J.R.R. Tolkien\'s novels.',
        'Birth': 'October 31, 1961'
      }
    },
    {
      'Title': 'The Dark Knight',
  'Description': 'In this superhero film, Batman faces the Joker, a criminal mastermind who seeks to create chaos in Gotham City. The battle between the two forces Batman to confront his own moral limits.',
  'Genre': {
    'Name': 'Action',
    'Description': 'Action film involving intense conflicts, often with a central superhero or protagonist.'
  },
  'Director': {
    'Name': 'Christopher Nolan',
    'Bio': 'Best known for his cerebral, often nonlinear, storytelling, acclaimed writer-director Christopher Nolan has made a significant impact in the world of filmmaking.',
    'Birth': 'July 30, 1970'
  }
    },
    {
      'Title': 'Shutter Island',
      'Description': 'In this psychological thriller, two U.S. Marshals investigate the disappearance of a prisoner from a mental institution, uncovering dark secrets and facing personal challenges.',
      'Genre': {
        'Name': 'Mystery',
        'Description': 'Mystery films involve suspenseful and perplexing plots that engage the audience in solving a crime or uncovering hidden truths.'
      },
      'Director': {
        'Name': 'Martin Scorsese',
        'Bio': 'Martin Scorsese is an American film director, producer, screenwriter, and actor. He is widely regarded as one of the greatest directors in the history of cinema.',
        'Birth': 'November 17, 1942'
      }
    },
    {
      'Title': 'Arrival',
  'Description': 'A linguist is recruited to help communicate with extraterrestrial visitors whose mysterious arrival sparks global tensions. As she delves into their language, she unlocks profound revelations.',
  'Genre': {
    'Name': 'Science Fiction',
    'Description': 'Science fiction films explore speculative concepts, often involving advanced technology, space exploration, and extraterrestrial life.'
  },
  'Director': {
    'Name': 'Denis Villeneuve',
    'Bio': 'Denis Villeneuve is a Canadian film director and writer. Known for his visually stunning and thought-provoking films, he has gained recognition in the world of cinema.',
    'Birth': 'October 3, 1967'
  }
    },
    {
      'Title': 'Interstellar',
      'Description': 'In this science fiction epic, a team of explorers embarks on a space journey through a wormhole to find a new habitable planet for humanity facing extinction on Earth.',
      'Genre': {
        'Name': 'Science Fiction',
        'Description': 'Science fiction films explore speculative concepts, often involving advanced technology, space exploration, and extraterrestrial life.'
      },
      'Director': {
        'Name': 'Christopher Nolan',
        'Bio': 'Christopher Nolan continues his exploration of complex narratives and breathtaking visuals in this interstellar odyssey.',
        'Birth': 'July 30, 1970'
      }
    },
    {
      'Title': 'Lone Survivor',
      'Description': 'Based on true events, this war film recounts the failed mission of a Navy SEAL team in Afghanistan and the harrowing survival story of the lone survivor.',
      'Genre': {
        'Name': 'War',
        'Description': 'War films depict conflicts, battles, and the impact of war on individuals and societies.'
      },
      'Director': {
        'Name': 'Peter Berg',
        'Bio': 'Peter Berg is an American director, producer, writer, and actor. He has worked on a variety of films, exploring themes of courage and resilience.',
        'Birth': 'March 11, 1964'
      }
    },
    {
      'Title': 'Spider-Man: Across the Spider-Verse',
      'Description': 'In this animated superhero film, Spider-Man teams up with alternate versions of himself from different dimensions to stop a powerful threat that spans across the multiverse.',
      'Genre': {
        'Name': 'Animation',
        'Description': 'Animated films use visual techniques to create a captivating and imaginative storytelling experience.'
      },
      'Director': {
        'Name': 'Joaquim Dos Santos, Kemp Powers',
        'Bio': 'The creative duo brings their expertise to the animated superhero world, delivering a visually stunning and dynamic Spider-Verse story.',
        'Birth': 'Director 1 Birth Date, Director 2 Birth Date'
      }
    },
    {
      'Title': 'Howls Moving Castle',
      'Description':'A young woman is cursed with an old body by a spiteful witch. As she seeks a way to break the curse, she becomes involved with a wizard named Howl and his magical moving castle.',
      'Genre':{
        'Name':'Animation',
        'Description':'Animated films are those in which individual drawings, paintings, or illustrations are photographed frame by frame (stop-frame cinematography).'
      },
      'Director': {
        'Name': 'Hayao Miyazaki',
        'Bio':'Hayao Miyazaki is a Japanese animator, director, producer, screenwriter, author, and co-founder of Studio Ghibli. He is considered one of the greatest animators and directors in the history of cinema.',
        'Birth':'January 5, 1941'
      }
    }
  ]
  
  // setup logging

 const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})
 app.use(morgan('combined', {stream: accessLogStream}));  // enable morgan logging to 'log.txt'

// setup app routing
app.use(express.static('public'));

  // GET requests
  app.get('/', (req, res) => {
    res.send('Welcome to my Movie club!'); 
  });
  
  app.get('/documentation', (req, res) => {                  
    res.sendFile('public/documentation.html', { root: __dirname });
  });
  
// create  users
app.post('/users', async (req, res) => {
  await Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// create user Users
 // .create({
   // Username: req.body.Username,
   // Password: req.body.Password,
   // Email: req.body.Email,
   // Birthday: req.body.Birthday
 // })
// PUT update 
app.put('/users/:id',(req, res) => {
  const {id} = req.params;
  const updatedUser = req.body;
let user = users.find( user => user.id == id);

if (user){
  user.name = updatedUser.name;
  res.status(200).json(user)   
 } else {
    res.status(400).send("User not found");
  }
})

// POST create
app.post('/users',(req, res) => {
  const newUser = req.body;

  if (newUser.name){
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).json(newUser);
  } else {
    res.status(400).send("User needs name")
  }
})

// POST Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:movieID', async (req, res) => {
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

//GET read all users
app.get('/users', async (req, res) => {
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
app.get('/users/:Username', async (req, res) => {
  await Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//delete

app.delete('/users/:id/:moviesTitle',(req, res) => {
  const { id, favMovies: moviesTitle } = req.params;


let user = users.find( user => user.id == id);

if (user){
  user.favMovies = user.favMovies.filter(title => title !== moviesTitle);
  res.status(200).send(`${moviesTitle} has been removed from user ${id}'s array`);   
 } else {
    res.status(400).send("User not found");
  }
})

app.delete('/users/:id',(req, res) => {
  const {id} = req.params;

let user = users.find( user => user.id == id);

if (user){
  users = users.filter(user => user.id != id);
  res.status(200).send(` Users ${id} has been deleted`);   
 } else {
    res.status(400).send("User not found");
  }
})

// Delete a user by username
app.delete('/users/:Username', async (req, res) => {
  await Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

  // read movies 
  app.get('/movies', (req, res) => {
    res.status(200).send('Movies array');
  });
  // title
app.get('/movies/:title', (req, res) => {
  const requestedMovie = movies.find(movie => movie.Title === req.params.title); // Use req.params.title instead of title
  if (movies) {
    res.status(200).json(requestedMovie );
  } else {
    res.status(400).send("No such movie");
  }
});


//genre
  app.get('/movies/genres/:genreName', (req, res) => {
  const {genreName} = req.params;
  const genre = movies.find( movie => movie.Genre.Name === genreName).Genre;
  if (genre){
  res.status(200).json(genre);
  } else {
    res.status(400).send("No such genre");
  }
});
//director
app.get('/movies/directors/:directorName', (req, res) => {
  const {directorName} = req.params;
  const director = movies.find( movie => movie.Director.Name === directorName).Director;
  if (director){
  res.status(200).json(director);
  } else {
    res.status(400).send("No such director");
  }
});
  
  // set up error handling
app.use((err, req, res, next)=>{
    console.error(err.stack);
    res.status(500).send('Something broke!');
  
  })
  
  // listen for requests
  app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });

  mongoose.connect('mongodb://localhost:27017/lastattempt', 
  { useNewUrlParser: true, useUnifiedTopology: true });