const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const port = process.env.PORT || 3000;

// Define paths for Express config
const publicDirPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirPath));

// example for serving/rendering a dynamic page
app.get('', (req, res) => {
  res.render('index', {
    title: 'Welcome to Weather',
    name: 'Eliot Clarke',
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: "It's ABOUT time, y'all!",
    name: 'Todd Toddington',
  });
});

app.get('/help', (req, res) => {
  res.render('help', {
    title: 'Halp',
    name: 'Bob Newhart',
    message: "You friggin' need help, dawg.",
  });
});

app.get('/weather', (req, res) => {
  if (!req.query.address) {
    return res.send({
      message: 'You gotta ask to receive, bud.',
      error: 'No address query provided',
    });
  } else {
    let queryString = req.query.address;
    geocode(queryString, (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({
          message: 'There was a problem.',
          error,
        });
      }
      forecast(
        latitude,
        longitude,
        (error, { forecastString, forecastImg }) => {
          if (error) {
            return res.send({
              message: 'There was a problem.',
              error,
            });
          }

          res.send({
            forecast: forecastString,
            forecastImg,
            location,
            address: queryString,
          });
        }
      );
    });
  }
});

app.get('/products', (req, res) => {
  if (!req.query.search) {
    return res.send({
      message: 'You gotta ask to receive, bud.',
      error: 'No search query provided',
    });
  }
  console.log(req.query.search);
  res.send({
    products: [],
  });
});

app.get('/help/*', (req, res) => {
  res.render('404', {
    title: 'lolo404olol',
    name: 'Jaoquin Phoenix',
    message: 'Help article not found',
  });
});

app.get('*', (req, res) => {
  res.render('404', {
    title: 'lolo404olol',
    name: 'Don Quixote',
    message: 'Sorry we could not find your page.',
  });
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
