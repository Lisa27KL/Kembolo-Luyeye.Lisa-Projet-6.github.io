const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const dotenv = require("dotenv");
dotenv.config();


// Routes récupérées
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');


const app = express();

// Connexion à la base de données
mongoose.connect(process.env.MONGOBD_CONNECTION,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !') )
  .catch((error) => console.log('Connexion à MongoDB échouée...' + error)
);

app.use(express.json());

// Défis de la semaine l.17 l.23
//console.log(app.use(express.json()))


// CORS
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