const express = require('express');
const helmet = require('helmet'); // OWASP : Secure Express app by setting various HTTP headers.
const rateLimit = require('express-rate-limit');

const mongoose = require('mongoose');
const path = require('path');

const dotenv = require("dotenv");
dotenv.config();


// Routers 
const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');


const app = express();

// Connection with the DataBase MONGODB
mongoose.connect(process.env.MONGODB_CONNECTION,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connection to MongoDB successful!'))
  .catch((error) => console.log(`Connection to MongoDB failed : ${error}`)
  );

app.use(express.json());
app.use(helmet({crossOriginResourcePolicy: false,}));

// CORS Sécurity
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


// Routes : authorization, routes, images
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000, //15 minutes
  max: 20, // Limit each IP à 30 requests per "window" / 15 mins.
  message: `BEWARE ! Too many connection attempts from this IP`
}));

module.exports = app;