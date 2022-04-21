const express = require('express');
const helmet = require('helmet'); // OWASP : Secure Express app by setting various HTTP headers.

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const dotenv = require("dotenv");
dotenv.config();


// Routers 
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');


const app = express();

// Connection with the DataBase MONGODB
mongoose.connect(process.env.MONGOBD_CONNECTION,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !') )
  .catch((error) => console.log('Connexion à MongoDB échouée...' + error)
);

app.use(express.json());
app.use(helmet()); // Configuration des headers
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));

// Défis de la semaine l.17 l.23
//console.log(app.use(express.json()))


// CORS Sécurity
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());

// Routes : authorization, routes, images
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));


module.exports = app;