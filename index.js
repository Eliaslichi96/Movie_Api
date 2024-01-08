const express = require('express');
morgan = require('morgan'),
fs = require('fs'), 
path = require('path');
const app = express();

let topMovies = [
    {
      title: 'Harry Potter Series'
    },
    {
      title: 'Lord of the Rings: The Return of the King'
    },
    {
      title: 'The Dark Knight'
    },
    {
        title: 'Shuttler Island',
    },
    {
        title: 'Arrival',
    },
    {
        title: 'Interstellar',
    },
    {
        title: 'Lone Survivor',
    },
    {
        title: 'Spider-Man: Across the spider-Verse',
    },
    {
        title: 'Howls Moving Castle',
    },
    {
        title: 'Elemental',
    },
    {
        title: 'Your Name',
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
  
  app.get('/Movies', (req, res) => {
    res.json(topMovies);
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