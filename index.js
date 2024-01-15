const express = require('express');
morgan = require('morgan'),
fs = require('fs'), 
bodyParser = require('body-parser'),
path = require('path'),
uuid = require('uuid');


const app = express();
app.use(bodyParser.json());


let users = [
  {
  id: 1,
  name: "Kim",
  favoriteMovies: []
  }

]

let topMovies = [
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
      'Description': '',
      'Genre': {
        'Name':'',
        'Description':''
      },
      'Director': {
        'Name': '',
        'Bio': '',
        'Birth': ''
      }
    },
    {
      'Title': "The Dark Knight",
      'Description': '',
      'Genre': {
        'Name':'',
        'Description':''
      },
      'Director': {
        'Name': '',
        'Bio': '',
        'Birth': ''
      }
    },
    {
      'Title': "Shuttler Island",
      'Description': '',
      'Genre': {
        'Name':'',
        'Description':''
      },
      'Director': {
        'Name': '',
        'Bio': '',
        'Birth': ''
      }
    },
    {
      'Title': 'Arrival',
      'Description': '',
      'Genre': {
        'Name':'',
        'Description':''
      },
      'Director': {
        'Name': '',
        'Bio': '',
        'Birth': ''
      }
    },
    {
      'Title': 'Interstellar',
      'Description': '',
      'Genre': {
        'Name':'',
        'Description':''
      },
      'Director': {
        'Name': '',
        'Bio': '',
        'Birth': ''
      }
    },
    {
      'Title': 'Lone Survivor',
      'Description': '',
      'Genre': {
        'Name':'',
        'Description':''
      },
      'Director': {
        'Name': '',
        'Bio': '',
        'Birth': ''
      }
    },
    {
      'Title': 'Spider-Man: Across the spider-Verse',
      'Description': '',
      'Genre': {
        'Name':'',
        'Description':''
      },
      'Director': {
        'Name': '',
        'Bio': '',
        'Birth': ''
      }
    },
    {
      'Title': 'Howls Moving Castle',
      'Description': '',
      'Genre': {
        'Name':'',
        'Description':''
      },
      'Director': {
        'Name': '',
        'Bio': '',
        'Birth': ''
      }
    },
    {
      'Title': 'Elemental',
      'Description': '',
      'Genre': {
        'Name':'',
        'Description':''
      },
      'Director': {
        'Name': '',
        'Bio': '',
        'Birth': ''
      }
    },
    {
      'Title': 'Your Name',
      'Description': '',
      'Genre': {
        'Name':'',
        'Description':''
      },
      'Director': {
        'Name': '',
        'Bio': '',
        'Birth': ''
      }
    }
  ];
  
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
app.post('/users', (req, res) => { 
  const newUser = req.body;

  if (newUser.name) {
    newUser.id = uuid.v4();
    users.push(newUser);
    res.status(201).jason(newUser);
  } else {
    res.status(400).send('users need names')
  }
})

  // read movies 
  app.get('/movies', (req, res) => {
    res.status(200).json(topMovies);
  });
//title
  app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movie = topMovies.find( movie =>movie.Title === title);

    if (movie) {
      res.status(200).json(movie);
    } else {
      res.status(400).send('no such movie')
    }
  })
//genre
  app.get('/movies/genre/:genreName', (req, res) => {
    const { genreName } = req.params;
    const genre = topMovies.find( movie =>movie.Genre.Name === genreName).Genre;

    if (genre) {
      res.status(200).json(genre);
    } else {
      res.status(400).send('no such movie')
    }
  })
//director
app.get('/movies/director/:directorName', (req, res) => {
  const { directorName } = req.params;
  const director = topMovies.find( movie =>movie.Director.Name === directorName).Director;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send('no such movie')
  }
})
  
  // set up error handling
app.use((err, req, res, next)=>{
    console.error(err.stack);
    res.status(500).send('Something broke!');
  
  })
  
  // listen for requests
  app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });